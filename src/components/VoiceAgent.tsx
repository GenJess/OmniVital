import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AGENT_ID = "agent_5501kgzectw4ep69wjamch6xr2k7";

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
      if (conversation.status === "connected") {
        stopConversation();
      }
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <>
      {/* Floating orb trigger */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        {/* Hover label */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase whitespace-nowrap"
              style={{
                background: "hsla(0,0%,4%,0.82)",
                border: "1px solid hsla(0,0%,100%,0.1)",
                color: "hsl(0,0%,75%)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 16px -4px hsla(0,0%,0%,0.5)",
              }}
            >
              Ritual Advisor
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orb button */}
        <motion.button
          onClick={handleToggle}
          className="relative w-16 h-16 rounded-full flex items-center justify-center focus:outline-none"
          whileTap={{ scale: 0.93 }}
        >
          {/* Outer pulsing rings — only when connected */}
          {isConnected && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.15) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.12) 0%, transparent 70%)" }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </>
          )}

          {/* Idle soft glow ring */}
          {!isConnected && (
            <motion.div
              className="absolute inset-[-6px] rounded-full"
              style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.1) 0%, transparent 65%)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Gradient orb body */}
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
            style={{
              background: isConnected
                ? "linear-gradient(135deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)"
                : "linear-gradient(145deg, hsl(168,76%,30%) 0%, hsl(168,76%,42%) 55%, hsl(168,60%,36%) 100%)",
              boxShadow: isConnected
                ? "0 0 32px -4px hsla(168,76%,42%,0.65), 0 8px 28px -8px hsla(0,0%,0%,0.6), inset 0 1px 0 hsla(255,100%,100%,0.12)"
                : "0 0 22px -6px hsla(168,76%,42%,0.45), 0 8px 24px -8px hsla(0,0%,0%,0.55), inset 0 1px 0 hsla(255,100%,100%,0.1)",
            }}
          >
            {isOpen ? (
              <X size={18} className="text-white" />
            ) : isConnected ? (
              /* Waveform bars when active */
              <div className="flex items-center gap-[3px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[2.5px] rounded-full bg-white"
                    animate={isSpeaking
                      ? { height: [3, 13 + i * 2, 3] }
                      : { height: [3, 7, 3] }
                    }
                    transition={{
                      duration: isSpeaking ? 0.35 : 1.1,
                      repeat: Infinity,
                      delay: i * 0.09,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Premium idle — just mic icon, no text */
              <Mic size={18} className="text-white opacity-90" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Agent panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 right-6 z-50 w-[320px] rounded-2xl overflow-hidden shadow-2xl shadow-background/60"
            style={{ border: "1px solid hsl(var(--border))" }}
          >
            {/* Gradient accent bar */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)" }}
            />

            {/* Header */}
            <div
              className="px-5 py-4 border-b"
              style={{
                background: "hsla(var(--card), 0.98)",
                borderColor: "hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, hsl(168,76%,38%) 0%, hsl(168,76%,44%) 100%)", boxShadow: "0 2px 10px -3px hsla(168,76%,42%,0.45)" }}
                >
                  <Mic size={15} className="text-white opacity-90" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground tracking-tight">Ritual Advisor</p>
                  <p className="text-[11px] text-muted-foreground">
                    {isConnected
                      ? isSpeaking ? "Speaking..." : "Listening to you..."
                      : user ? `Personalized for ${profile?.full_name?.split(" ")[0] || "you"}` : "Voice assistant"}
                  </p>
                </div>
                {isConnected && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </div>

            {/* Body */}
            <div
              className="px-5 py-8 flex flex-col items-center gap-5"
              style={{ background: "hsla(var(--background), 0.97)" }}
            >
              {isConnected ? (
                <>
                  {/* Active orb visualization */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.12) 0%, transparent 70%)" }}
                      animate={{ scale: isSpeaking ? [1, 1.5, 1] : [1, 1.15, 1] }}
                      transition={{ duration: isSpeaking ? 0.5 : 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-3 rounded-full"
                      style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.1) 0%, transparent 70%)" }}
                      animate={{ scale: isSpeaking ? [1, 1.3, 1] : [1, 1.08, 1] }}
                      transition={{ duration: isSpeaking ? 0.4 : 2.5, repeat: Infinity, delay: 0.1 }}
                    />
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)" }}
                    >
                      <Mic size={22} className="text-white" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    {isSpeaking
                      ? "Your advisor is responding..."
                      : "Speak naturally — I'm here for you"}
                  </p>

                  <button
                    onClick={stopConversation}
                    className="px-7 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-lg transition-all duration-200 border"
                    style={{
                      background: "hsl(var(--secondary))",
                      color: "hsl(var(--foreground))",
                      borderColor: "hsl(var(--border))",
                    }}
                  >
                    End Session
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <MicOff size={26} className="text-muted-foreground" />
                  </div>

                  <div className="text-center space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {user ? "Talk to your advisor" : "Meet your ritual advisor"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {user && profile?.ritual_summary
                        ? profile.ritual_summary
                        : "Ask about protocols, products, or build your personalized ritual."}
                    </p>
                  </div>

                  <button
                    onClick={startConversation}
                    disabled={isConnecting}
                    className="w-full py-3.5 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, hsl(168,76%,42%) 0%, hsl(168,76%,36%) 100%)",
                      color: "hsl(var(--primary-foreground))",
                      boxShadow: "0 4px 20px -6px hsla(168,76%,42%,0.5)",
                    }}
                  >
                    {isConnecting ? "Connecting..." : "Start Conversation"}
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
