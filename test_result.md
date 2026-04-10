#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "White label health and wellness website (OmniVital) launch readiness. Phase 1: Replace 3 old products with 6 new launch products, fix brand name, create Supabase schema, update landing page and PDPs."

backend:
  - task: "FastAPI server status endpoint"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Basic status endpoint, not changed"
        - working: true
          agent: "testing"
          comment: "Tested all backend endpoints successfully. GET /api/ returns Hello World, GET /api/status returns status checks list, POST /api/status creates new status checks with MongoDB persistence. All endpoints responding correctly at https://white-wellness.preview.emergentagent.com/api"

frontend:
  - task: "Landing page hero section"
    implemented: true
    working: true
    file: "frontend/src/components/HeroSection.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Updated tagline, hero copy. Brand renamed to OmniVital."

  - task: "Product catalog - RitualGrid (6 products, 3 time slots)"
    implemented: true
    working: true
    file: "frontend/src/components/RitualGrid.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "6 products from static catalog shown in morning/midday/evening groups. Supabase PostgREST cache was stale so switched to static data."

  - task: "Product detail pages (PDPs)"
    implemented: true
    working: true
    file: "frontend/src/pages/ProductDetail.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "All 6 PDPs working with full detail: benefits, bio-availability, sourcing, ritual tabs, directions. Add to Ritual CTA works with Supabase."

  - task: "Dashboard - ritual stack management"
    implemented: true
    working: true
    file: "frontend/src/pages/Dashboard.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Dashboard shows user rituals grouped by morning/midday/evening, streak tracking, daily check-in, add/remove/pause products."

  - task: "Auth (Supabase)"
    implemented: true
    working: true
    file: "frontend/src/pages/Auth.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Supabase auth, brand name updated"

  - task: "Supabase schema (products, profiles, user_rituals, ritual_logs, email_signups)"
    implemented: true
    working: true
    file: "supabase migrations"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "All tables created via Supabase MCP migrations with RLS policies. Products seeded."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Product catalog - RitualGrid"
    - "Product detail pages"
    - "Navigation between pages"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "Phase 1 complete. Replaced old 3-product catalog with 6 new launch products (OV Drive, OV Adapt, OV Bright, OV Quiet Focus, OV Neuro Night, OV Cortex). Created Supabase schema. Updated brand from OmniaVital to OmniVital. Products shown in morning/midday/evening groupings. Static catalog used due to Supabase PostgREST cache delay. PDPs fully functional. Dashboard shows ritual management with check-ins."
    - agent: "testing"
      message: "Backend testing completed successfully. All FastAPI endpoints working correctly: GET /api/ (Hello World), GET /api/status (returns status checks), POST /api/status (creates status checks with MongoDB persistence). Backend is fully functional at production URL. No issues found."
