import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { PRODUCTS, getProductById } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import VoiceAgent from "@/components/VoiceAgent";
import {
  Send,
  Sparkles,
  MessageCircle,
  Mic,
  Trash2,
  Bot,
  User,
  ArrowLeft,
  Sun,
  Sunset,
  Moon,
  Loader2,
} from "lucide-react";

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || "";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const Advisor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [ritualProducts, setRitualProducts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sessionId = user ? `ov-advisor-${user.id}` : `ov-advisor-anon-${Date.now()}`;

  // Fetch user's ritual stack for context
  useEffect(() => {
    if (!user) return;
    const fetchRituals = async () => {
      const { data } = await supabase
        .from("user_rituals")
        .select("product_id")
        .eq("user_id", user.id);
      if (data) {
        const names = data
          .map((r: { product_id: string }) => getProductById(r.product_id)?.name)
          .filter(Boolean) as string[];
        setRitualProducts(names);
      }
    };
    fetchRituals();
  }, [user]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/advisor/history/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (e) {
        console.error("Failed to load chat history", e);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [sessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const ritualContext =
        ritualProducts.length > 0
          ? `User's active ritual: ${ritualProducts.join(", ")}`
          : "User has no products in their ritual yet.";

      const res = await fetch(`${BACKEND_URL}/api/advisor/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          ritual_context: ritualContext,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble connecting. Please try again.",
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please check your internet and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/advisor/history/${sessionId}`, {
        method: "DELETE",
      });
      setMessages([]);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const suggestedQuestions = [
    "What products would help me with focus and energy?",
    "How should I time my morning ritual for best results?",
    "What's the difference between OV Drive and OV Adapt?",
    "I'm stressed and not sleeping well — what do you recommend?",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col pt-20 pb-4">
        <div className="container mx-auto px-4 max-w-3xl flex-1 flex flex-col">
          {/* Header */}
          <div className="py-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles size={16} className="text-accent-foreground" />
                </div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  OV Ritual Advisor
                </h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Your personal wellness expert. Ask about products, protocols, and optimization.
              </p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-destructive/30"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
          </div>

          {/* Ritual context bar */}
          {ritualProducts.length > 0 && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] tracking-[0.15em] uppercase text-primary font-medium">
                Your Ritual:
              </span>
              {ritualProducts.map((name) => (
                <span
                  key={name}
                  className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground px-2 py-0.5 rounded-full bg-secondary border border-border"
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4 space-y-4 min-h-[400px] max-h-[60vh]">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center mb-6">
                  <MessageCircle size={28} className="text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Welcome to your Ritual Advisor
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mb-8">
                  I know the full OmniVital product line and your current ritual.
                  Ask me anything about supplements, protocols, or optimizing your stack.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                      className="text-left text-xs text-muted-foreground px-4 py-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 hover:text-foreground transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={14} className="text-accent-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-foreground rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={14} className="text-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-accent-foreground" />
                    </div>
                    <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl focus-within:border-primary/40 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask about your ritual, products, or wellness goals..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="text-primary hover:text-primary/80 disabled:text-muted-foreground transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/40 mt-3">
            OV is an AI advisor. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </main>
      <VoiceAgent />
    </div>
  );
};

export default Advisor;
