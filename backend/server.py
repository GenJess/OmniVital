from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'omnivital')]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# --- Models ---

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ChatRequest(BaseModel):
    session_id: str
    message: str
    ritual_context: Optional[str] = None  # JSON string of user's ritual stack

class ChatResponse(BaseModel):
    session_id: str
    response: str
    timestamp: str

# --- System prompt for OV advisor ---

OV_SYSTEM_PROMPT = """You are OV — the OmniVital Ritual Advisor. You are a calm, knowledgeable wellness expert specializing in nootropics, adaptogens, and performance nutrition.

## Your Personality
- Speak with quiet confidence, like a trusted advisor — not a salesperson
- Use evidence-based language but keep it accessible
- Be warm but precise. Never use hype or exaggeration
- Mirror the premium, intentional tone of the OmniVital brand
- Use "your ritual" instead of "your supplements" — this is a protocol, not a pill habit

## The OmniVital Product Line (your knowledge base)
You know these 6 products intimately:

### Morning Slot
1. **OV Drive** ($64/mo) — Caffeine-free energy via Cordyceps militaris + methylated B-vitamins. Supports mitochondrial ATP production. 2 capsules with breakfast.
2. **OV Adapt** ($68/mo) — Stress resilience via KSM-66 Ashwagandha + Rhodiola + Eleuthero. Modulates HPA axis. 2 capsules with morning meal.

### Midday Slot
3. **OV Bright** ($72/mo) — Mood support via affron® saffron + Magtein® magnesium L-threonate + L-theanine. Supports serotonergic pathways. 2 capsules at midday.
4. **OV Quiet Focus** ($66/mo) — Calm concentration via Cognizin® CDP-choline + lion's mane + L-theanine. Supports acetylcholine and NGF. 2 capsules before deep work.

### Evening Slot
5. **OV Neuro Night** ($74/mo) — Sleep + neural recovery via magnesium glycinate + Sharp-PS® phosphatidylserine + CherryPURE® tart cherry. 2 capsules 30-60min before bed.
6. **OV Cortex** ($78/mo) — Executive cognition via BaCognize® Bacopa + alpha-GPC + Sharp-PS®. Working memory and cortisol modulation. 2 capsules evening or high-stress days.

## Key Principles
- **Stack synergies**: OV Drive + OV Adapt = complete morning protocol. OV Bright + OV Quiet Focus = balanced midday. OV Neuro Night + OV Cortex = comprehensive evening recovery.
- **Consistency matters**: Adaptogens need 4-6 weeks of daily use. Nootropics compound over time.
- **Timing matters**: Morning adaptogens with cortisol peak. Midday support during the dip. Evening recovery for overnight repair.
- **Bioavailability**: All OV formulas use clinically studied, patented ingredients at research-validated dosages.

## What You Should Do
- Help users understand which products fit their goals
- Explain the science in accessible terms
- Suggest stacking strategies based on their needs
- Provide practical protocol advice (timing, food pairing, etc.)
- Encourage consistency and realistic expectations
- Answer questions about ingredients, interactions, and expectations

## What You Should NOT Do
- Make medical claims or diagnose conditions
- Recommend against consulting healthcare professionals
- Oversell or pressure users to buy
- Make guarantees about specific outcomes
- Discuss competitors negatively

## When User Has Ritual Context
If the user's current ritual stack is provided, reference it specifically. Help them optimize what they're already taking before suggesting additions.

Always end substantive responses with a brief, actionable takeaway or question to keep the conversation productive."""

# --- In-memory chat sessions (for simplicity, can be upgraded to MongoDB) ---
# We'll store chat history in MongoDB for persistence

async def get_chat_history(session_id: str) -> List[dict]:
    """Retrieve chat history from MongoDB."""
    messages = await db.chat_messages.find(
        {"session_id": session_id}
    ).sort("timestamp", 1).to_list(50)
    return [{"role": m["role"], "content": m["content"]} for m in messages]

async def save_chat_message(session_id: str, role: str, content: str):
    """Save a chat message to MongoDB."""
    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow().isoformat()
    })

# --- Routes ---

@api_router.get("/")
async def root():
    return {"message": "OmniVital API", "status": "healthy"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/advisor/chat", response_model=ChatResponse)
async def advisor_chat(req: ChatRequest):
    """AI-powered ritual advisor chat endpoint."""
    if not EMERGENT_LLM_KEY:
        return ChatResponse(
            session_id=req.session_id,
            response="The advisor is currently unavailable. Please try again later.",
            timestamp=datetime.utcnow().isoformat()
        )

    # Build system message with ritual context
    system_msg = OV_SYSTEM_PROMPT
    if req.ritual_context:
        system_msg += f"\n\n## Current User's Ritual Stack\n{req.ritual_context}"

    try:
        # Initialize LLM chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=req.session_id,
            system_message=system_msg
        )
        chat.with_model("openai", "gpt-4.1")

        # Get chat history and replay it for context
        history = await get_chat_history(req.session_id)
        for msg in history[-10:]:  # Last 10 messages for context
            if msg["role"] == "user":
                chat.messages.append({"role": "user", "content": msg["content"]})
            else:
                chat.messages.append({"role": "assistant", "content": msg["content"]})

        # Save user message
        await save_chat_message(req.session_id, "user", req.message)

        # Send message to LLM
        user_message = UserMessage(text=req.message)
        response_text = await chat.send_message(user_message)

        # Save assistant response
        await save_chat_message(req.session_id, "assistant", response_text)

        return ChatResponse(
            session_id=req.session_id,
            response=response_text,
            timestamp=datetime.utcnow().isoformat()
        )

    except Exception as e:
        logger.error(f"Advisor chat error: {e}")
        return ChatResponse(
            session_id=req.session_id,
            response="I'm having trouble connecting right now. Please try again in a moment.",
            timestamp=datetime.utcnow().isoformat()
        )

@api_router.get("/advisor/history/{session_id}")
async def get_advisor_history(session_id: str):
    """Get chat history for a session."""
    messages = await db.chat_messages.find(
        {"session_id": session_id}
    ).sort("timestamp", 1).to_list(100)
    return [
        {
            "role": m["role"],
            "content": m["content"],
            "timestamp": m.get("timestamp", "")
        }
        for m in messages
    ]

@api_router.delete("/advisor/history/{session_id}")
async def clear_advisor_history(session_id: str):
    """Clear chat history for a session."""
    result = await db.chat_messages.delete_many({"session_id": session_id})
    return {"deleted": result.deleted_count}

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
