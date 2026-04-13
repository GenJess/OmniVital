import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getProductById } from "@/data/products";
import logoMark from "@/assets/logo-mark.png";

const AGENT_ID = "agent_5501kgzectw4ep69wjamch6xr2k7";

/* ── Custom OV·voice mark ─────────────────────────────── */
const OVMark = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="10.5" y="3" width="7" height="13" rx="3.5" fill="white" fillOpacity="0.92" />
    <path
      d="M6.5 14.5C6.5 18.918 9.806 22.5 14 22.5C18.194 22.5 21.5 18.918 21.5 14.5"
      stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9"
    />
    <line x1="14" y1="22.5" x2="14" y2="25.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
    <line x1="10.5" y1="25.5" x2="17.5" y2="25.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.85" />
    <path d="M9 8.5 Q14 6 19 8.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.35" />
  </svg>
);

/* ── Waveform bars ────────────────────────────────────── */
const WaveformBars = ({ isSpeaking }: { isSpeaking: boolean }) => (
  <div className="flex items-center gap-[3px]">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-[2.5px] rounded-full bg-white"
        animate={isSpeaking
          ? { height: [3, 14 + i * 2, 3] }
          : { height: [3, 7, 3] }
        }
        transition={{
          duration: isSpeaking ? 0.33 : 1.1,
          repeat: Infinity,
          delay: i * 0.08,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* ── Siri-style animated ring ─────────────────────────── */
const PulsingRings = ({ active }: { active: boolean }) => (
  <>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute inset-0 rounded-full"
        style={{
          border: `1.5px solid hsla(168,76%,42%,${active ? 0.35 - i * 0.1 : 0.15 - i * 0.04})`,
        }}
        animate={{
          scale: active ? [1, 1.6 + i * 0.5] : [1, 1.25 + i * 0.2],
          opacity: [active ? 0.6 : 0.3, 0],
        }}
        transition={{
          duration: active ? 1.6 : 3,
          repeat: Infinity,
          ease: "easeOut",
          delay: i * (active ? 0.35 : 0.6),
        }}
      />
    ))}
  </>
);

/* ── Main component ───────────────────────────────────── */
const VoiceAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user, profile } = useAuth();

  // Fetch user's ritual context for dynamic variables
  const [ritualContext, setRitualContext] = useState<string>("");
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    if (!user) return;
    const loadContext = async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 6);

      const [ritualsRes, logsRes] = await Promise.all([
        supabase.from("ov_user_rituals").select("*").eq("user_id", user.id).eq("is_paused", false),
        supabase.from("ov_ritual_logs").select("*").eq("user_id", user.id).gte("logged_at", weekAgo.toISOString()),
      ]);

      const activeRituals = ritualsRes.data || [];
      const weekLogs = logsRes.data || [];

      const formulaNames = activeRituals
        .map(r => getProductById(r.product_id)?.name)
        .filter(Boolean);

      // Compute streak
      const streakArr = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0);
        const nd = new Date(d); nd.setDate(nd.getDate() + 1);
        return weekLogs.some(l => { const ld = new Date(l.logged_at); return ld >= d && ld < nd; });
      });
      const streakCount = [...streakArr].reverse().findIndex(d => !d);
      const streak = streakCount === -1 ? 7 : streakCount;
      setStreakDays(streak);

      const parts: string[] = [];
      if (profile?.full_name) parts.push(`User: ${profile.full_name}`);
      if (formulaNames.length > 0) {
        parts.push(`Active formulas: ${formulaNames.join(", ")}`);
      } else {
        parts.push("No active formulas yet");
      }
      if (streak > 0) parts.push(`Current streak: ${streak} days`);
      setRitualContext(parts.join(". "));
    };
    loadContext();
  }, [user, profile]);

  const conversation = useConversation({
    onConnect: () => console.log("Connected to OmniVital agent"),
    onDisconnect: () => console.log("Disconnected from agent"),
    onError: (error) => console.error("Agent error:", error),
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
        // Pass user's ritual context as dynamic variables to ElevenLabs agent
        dynamicVariables: {
          user_name: profile?.full_name?.split(" ")[0] || "there",
          ritual_context: ritualContext || "No active formulas",
          streak_days: String(streakDays),
        },
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, profile, ritualContext, streakDays]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleToggle = () => {
    if (isOpen) {
      if (conversation.status === "connected") stopConversation();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;
  const firstName = profile?.full_name?.split(" ")[0] || "you";

  return (
    <>
      {/* ── Floating orb ─────────────────────────────────── */}
      <div className="fixed bottom-20 right-6 z-50">
        <motion.button
          onClick={handleToggle}
          className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center focus:outline-none"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Open Ritual Advisor"
          data-testid="voice-agent-toggle"
        >
          <PulsingRings active={isConnected} />

          <motion.div
            className="absolute inset-[-12px] rounded-full pointer-events-none"
            style={{
              background: isConnected
                ? "radial-gradient(circle, hsla(168,76%,42%,0.35) 0%, hsla(42,80%,55%,0.08) 40%, transparent 65%)"
                : "radial-gradient(circle, hsla(168,76%,42%,0.15) 0%, transparent 60%)",
            }}
            animate={{
              scale: isSpeaking ? [1, 1.3, 1] : [1, 1.1, 1],
              opacity: isSpeaking ? [0.7, 1, 0.7] : [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: isSpeaking ? 0.6 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div
            className="relative w-[54px] h-[54px] rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: isConnected
                ? "linear-gradient(145deg, hsl(168,76%,48%) 0%, hsl(168,76%,34%) 50%, hsl(42,70%,38%) 100%)"
                : "linear-gradient(145deg, hsl(0,0%,8%) 0%, hsl(0,0%,5%) 100%)",
              boxShadow: isConnected
                ? ["0 0 0 1.5px hsla(168,76%,60%,0.45)", "0 0 40px -4px hsla(168,76%,42%,0.7)", "0 12px 32px -6px hsla(0,0%,0%,0.85)", "inset 0 1px 0 hsla(0,0%,100%,0.2)"].join(", ")
                : ["0 0 0 1px hsla(168,76%,42%,0.25)", "0 0 24px -4px hsla(168,76%,42%,0.35)", "0 10px 28px -6px hsla(0,0%,0%,0.8)", "inset 0 1px 0 hsla(0,0%,100%,0.08)"].join(", "),
            }}
          >
            <div className="absolute top-[4px] left-[6px] w-[16px] h-[10px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 40% 40%, hsla(0,0%,100%,0.2) 0%, transparent 100%)" }} />
            {isOpen ? (
              <X size={17} strokeWidth={2.5} className="text-white/80 relative z-10" />
            ) : isConnected ? (
              <WaveformBars isSpeaking={isSpeaking} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <ellipse cx="12" cy="8" rx="5.5" ry="5" stroke="white" strokeWidth="1.4" fill="none" opacity="0.85" />
                <path d="M5.5 15L12 23L18.5 15" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
              </svg>
            )}
          </div>
        </motion.button>
      </div>

      {/* ── Agent panel ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[100px] right-6 z-50 w-[300px] rounded-sm overflow-hidden"
            style={{
              background: "hsl(0,0%,6%)",
              border: "1px solid hsl(0,0%,16%)",
              boxShadow: "0 24px 60px -12px hsla(0,0%,0%,0.9), 0 0 0 1px hsla(0,0%,100%,0.04)",
            }}
          >
            <div className="h-[2px] w-full"
              style={{ background: "linear-gradient(90deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)" }} />

            {/* Header */}
            <div className="px-5 pt-4 pb-4" style={{ borderBottom: "1px solid hsl(0,0%,12%)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(145deg, hsl(168,76%,24%) 0%, hsl(168,76%,40%) 100%)",
                    boxShadow: "0 2px 12px -4px hsla(168,76%,42%,0.5)",
                  }}>
                  <img src={logoMark} alt="OV" className="w-5 h-5 brightness-0 invert" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground tracking-tight">Ritual Advisor</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isConnected
                      ? isSpeaking ? "Speaking…" : "Listening…"
                      : user
                      ? `Personalized for ${firstName}`
                      : "AI-powered wellness guidance"}
                  </p>
                </div>
                <button onClick={handleToggle}
                  className="w-7 h-7 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all flex-shrink-0"
                  data-testid="voice-panel-close">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-7 flex flex-col items-center gap-5">
              {isConnected ? (
                <>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-[-6px] rounded-full"
                      style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.14) 0%, transparent 70%)" }}
                      animate={{ scale: isSpeaking ? [1, 1.4, 1] : [1, 1.12, 1] }}
                      transition={{ duration: isSpeaking ? 0.5 : 2.2, repeat: Infinity }}
                    />
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(140deg, hsl(168,76%,40%) 0%, hsl(42,80%,52%) 100%)",
                        boxShadow: "0 0 28px -6px hsla(168,76%,42%,0.6)",
                      }}>
                      <OVMark size={28} />
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    {isSpeaking ? "Your advisor is responding…" : "Speak naturally — I'm listening"}
                  </p>

                  <button onClick={stopConversation}
                    className="w-full py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-xl transition-all duration-200 hover:brightness-110"
                    style={{ background: "hsl(0,0%,10%)", color: "hsl(0,0%,70%)", border: "1px solid hsl(0,0%,18%)" }}>
                    End Session
                  </button>
                </>
              ) : (
                <>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-[-8px] rounded-full"
                      style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.09) 0%, transparent 65%)" }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(145deg, hsl(168,76%,18%) 0%, hsl(168,76%,32%) 100%)",
                        border: "1px solid hsla(168,76%,42%,0.2)",
                        boxShadow: "0 4px 20px -8px hsla(168,76%,42%,0.4)",
                      }}>
                      <OVMark size={28} />
                    </div>
                  </div>

                  <div className="text-center space-y-1.5">
                    <p className="text-[13px] font-semibold text-foreground tracking-tight">
                      {user ? `Talk to your advisor, ${firstName}` : "Meet your Ritual Advisor"}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                      {ritualContext
                        ? ritualContext
                        : "Ask about protocols, products, or build your personalized ritual."}
                    </p>
                  </div>

                  <button onClick={startConversation} disabled={isConnecting}
                    className="w-full py-3 text-[11px] font-semibold tracking-[0.22em] uppercase rounded-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, hsl(168,76%,40%) 0%, hsl(168,76%,34%) 100%)",
                      color: "hsl(0,0%,98%)",
                      boxShadow: "0 4px 24px -6px hsla(168,76%,42%,0.55), 0 0 0 1px hsla(168,76%,42%,0.2), inset 0 1px 0 hsla(0,0%,100%,0.1)",
                    }}>
                    {isConnecting ? "Connecting…" : "Start Conversation"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAgent;
