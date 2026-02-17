import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AGENT_ID = "agent_5501kgzectw4ep69wjamch6xr2k7";

/* ── Custom OV·voice mark ─────────────────────────────── */
const OVMark = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    {/* Mic body */}
    <rect x="10.5" y="3" width="7" height="13" rx="3.5" fill="white" fillOpacity="0.92" />
    {/* Mic stand arc */}
    <path
      d="M6.5 14.5C6.5 18.918 9.806 22.5 14 22.5C18.194 22.5 21.5 18.918 21.5 14.5"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity="0.9"
    />
    {/* Stand line */}
    <line x1="14" y1="22.5" x2="14" y2="25.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
    {/* Base */}
    <line x1="10.5" y1="25.5" x2="17.5" y2="25.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.85" />
    {/* OV letterform — subtle 'OV' above the mic, as a small highlight arc */}
    <path
      d="M9 8.5 Q14 6 19 8.5"
      stroke="white"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeOpacity="0.35"
    />
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

/* ── Main component ───────────────────────────────────── */
const VoiceAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user, profile } = useAuth();

  const conversation = useConversation({
    onConnect: () => console.log("Connected to OmniaVital agent"),
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
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

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

  return (
    <>
      {/* ── Floating orb ─────────────────────────────── */}
      <div className="fixed bottom-16 right-6 z-50">
        <motion.button
          onClick={handleToggle}
          className="relative w-[58px] h-[58px] rounded-full flex items-center justify-center focus:outline-none"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.91 }}
          aria-label="Open Ritual Advisor"
        >
          {/* Ambient glow — always present, livelier when connected */}
          <motion.div
            className="absolute inset-[-8px] rounded-full"
            style={{
              background: isConnected
                ? "radial-gradient(circle, hsla(168,76%,42%,0.28) 0%, transparent 65%)"
                : "radial-gradient(circle, hsla(168,76%,42%,0.13) 0%, transparent 65%)",
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: isConnected ? 1.6 : 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Active pulse rings */}
          {isConnected && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: "hsla(168,76%,42%,0.3)" }}
                animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: "hsla(168,76%,42%,0.2)" }}
                animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              />
            </>
          )}

          {/* Orb body — 3-layer depth: outer rim, main gradient, inner highlight */}
          <div
            className="relative w-[54px] h-[54px] rounded-full flex items-center justify-center"
            style={{
              background: isConnected
                ? "linear-gradient(145deg, hsl(168,76%,52%) 0%, hsl(168,76%,38%) 50%, hsl(168,60%,28%) 100%)"
                : "linear-gradient(145deg, hsl(168,76%,30%) 0%, hsl(168,76%,22%) 55%, hsl(168,60%,16%) 100%)",
              boxShadow: isConnected
                ? [
                    "0 0 0 1px hsla(168,76%,60%,0.35)",       // outer rim highlight
                    "0 0 36px -4px hsla(168,76%,42%,0.75)",   // colour glow
                    "0 12px 32px -6px hsla(0,0%,0%,0.8)",     // depth shadow
                    "inset 0 1.5px 0 hsla(255,100%,100%,0.22)", // inner top shine
                    "inset 0 -2px 6px hsla(0,0%,0%,0.35)",    // inner bottom depth
                  ].join(", ")
                : [
                    "0 0 0 1px hsla(168,76%,42%,0.22)",
                    "0 0 18px -4px hsla(168,76%,42%,0.4)",
                    "0 10px 28px -6px hsla(0,0%,0%,0.75)",
                    "inset 0 1.5px 0 hsla(255,100%,100%,0.14)",
                    "inset 0 -2px 6px hsla(0,0%,0%,0.3)",
                  ].join(", "),
            }}
          >
            {/* Top-left specular highlight — gives a sphere/lens feel */}
            <div
              className="absolute top-[6px] left-[8px] w-[14px] h-[8px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 40% 40%, hsla(255,100%,100%,0.28) 0%, transparent 100%)",
              }}
            />
            {isOpen ? (
              <X size={17} strokeWidth={2.5} className="text-white relative z-10" />
            ) : isConnected ? (
              <WaveformBars isSpeaking={isSpeaking} />
            ) : (
              <OVMark size={26} />
            )}
          </div>
        </motion.button>
      </div>

      {/* ── Agent panel ──────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[94px] right-6 z-50 w-[300px] rounded-2xl overflow-hidden"
            style={{
              background: "hsl(0,0%,6%)",
              border: "1px solid hsl(0,0%,16%)",
              boxShadow: "0 24px 60px -12px hsla(0,0%,0%,0.9), 0 0 0 1px hsla(0,0%,100%,0.04)",
            }}
          >
            {/* Top gradient bar */}
            <div
              className="h-[2px] w-full"
              style={{ background: "linear-gradient(90deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)" }}
            />

            {/* Header */}
            <div
              className="px-5 pt-4 pb-4"
              style={{ borderBottom: "1px solid hsl(0,0%,12%)" }}
            >
              <div className="flex items-center gap-3">
                {/* Mini orb mark */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(145deg, hsl(168,76%,24%) 0%, hsl(168,76%,40%) 100%)",
                    boxShadow: "0 2px 12px -4px hsla(168,76%,42%,0.5)",
                  }}
                >
                  <OVMark size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground tracking-tight">Ritual Advisor</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {isConnected
                      ? isSpeaking ? "Speaking…" : "Listening…"
                      : user
                      ? `Personalized for ${profile?.full_name?.split(" ")[0] || "you"}`
                      : "AI-powered wellness guidance"}
                  </p>
                </div>
                {isConnected && (
                  <motion.div
                    className="w-2 h-2 rounded-full ml-auto flex-shrink-0"
                    style={{ background: "hsl(168,76%,42%)" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-7 flex flex-col items-center gap-5">
              {isConnected ? (
                <>
                  {/* Active orb */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-[-6px] rounded-full"
                      style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.14) 0%, transparent 70%)" }}
                      animate={{ scale: isSpeaking ? [1, 1.4, 1] : [1, 1.12, 1] }}
                      transition={{ duration: isSpeaking ? 0.5 : 2.2, repeat: Infinity }}
                    />
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(140deg, hsl(168,76%,40%) 0%, hsl(42,80%,52%) 100%)",
                        boxShadow: "0 0 28px -6px hsla(168,76%,42%,0.6)",
                      }}
                    >
                      <OVMark size={28} />
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    {isSpeaking ? "Your advisor is responding…" : "Speak naturally — I'm listening"}
                  </p>

                  <button
                    onClick={stopConversation}
                    className="w-full py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-xl transition-all duration-200 hover:brightness-110"
                    style={{
                      background: "hsl(0,0%,10%)",
                      color: "hsl(0,0%,70%)",
                      border: "1px solid hsl(0,0%,18%)",
                    }}
                  >
                    End Session
                  </button>
                </>
              ) : (
                <>
                  {/* Idle orb */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-[-8px] rounded-full"
                      style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.09) 0%, transparent 65%)" }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(145deg, hsl(168,76%,18%) 0%, hsl(168,76%,32%) 100%)",
                        border: "1px solid hsla(168,76%,42%,0.2)",
                        boxShadow: "0 4px 20px -8px hsla(168,76%,42%,0.4)",
                      }}
                    >
                      <OVMark size={28} />
                    </div>
                  </div>

                  <div className="text-center space-y-1.5">
                    <p className="text-[13px] font-semibold text-foreground tracking-tight">
                      {user ? "Talk to your advisor" : "Meet your Ritual Advisor"}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                      {user && profile?.ritual_summary
                        ? profile.ritual_summary
                        : "Ask about protocols, products, or build your personalized ritual."}
                    </p>
                  </div>

                  <button
                    onClick={startConversation}
                    disabled={isConnecting}
                    className="w-full py-3 text-[11px] font-semibold tracking-[0.22em] uppercase rounded-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, hsl(168,76%,40%) 0%, hsl(168,76%,34%) 100%)",
                      color: "hsl(0,0%,98%)",
                      boxShadow: "0 4px 24px -6px hsla(168,76%,42%,0.55), 0 0 0 1px hsla(168,76%,42%,0.2), inset 0 1px 0 hsla(255,100%,100%,0.1)",
                    }}
                  >
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
