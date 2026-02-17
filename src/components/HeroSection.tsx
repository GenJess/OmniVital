import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToRitual = () => {
    document.getElementById("ritual")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image with subtle zoom */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Deep matte overlay — heavy at bottom and top, light in center-top for image breathing room */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, hsla(0,0%,4%,0.72) 0%, hsla(0,0%,4%,0.55) 35%, hsla(0,0%,4%,0.78) 70%, hsl(0,0%,4%) 100%)"
      }} />
      {/* Side vignette */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(90deg, hsla(0,0%,4%,0.5) 0%, transparent 30%, transparent 70%, hsla(0,0%,4%,0.5) 100%)"
      }} />
      {/* Frosted text-area backdrop for subtitle legibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-3xl h-[360px] rounded-3xl" style={{
          background: "radial-gradient(ellipse at center, hsla(0,0%,4%,0.45) 0%, transparent 70%)"
        }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 flex items-center justify-center"
        >
          <span className="text-[10px] tracking-[0.45em] uppercase font-semibold px-5 py-2 rounded-full"
            style={{
              color: "hsl(168,76%,52%)",
              background: "hsla(168,76%,42%,0.08)",
              border: "1px solid hsla(168,76%,42%,0.22)",
              letterSpacing: "0.4em",
            }}
          >
            AI-Personalized Wellness
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.02em] text-foreground leading-[0.93]"
        >
          Your Ritual,
          <br />
          <span className="text-gradient">Intelligent</span> by Design.
        </motion.h1>

        {/* Subtitle with its own matte pill for guaranteed legibility */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-7 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed"
          style={{ color: "hsl(0,0%,82%)" }}
        >
          Meet your AI Ritual Advisor — personalized protocols built around your biology,
          goals, and lifestyle, refined through every conversation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.92 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 mt-10 justify-center"
        >
          <a
            href="#ritual"
            className="inline-flex items-center gap-2 px-9 py-3.5 font-semibold tracking-[0.18em] uppercase text-xs rounded-xl transition-all duration-300 hover:scale-[1.025]"
            style={{
              background: "hsl(168,76%,42%)",
              color: "hsl(0,0%,98%)",
              boxShadow: "0 4px 24px -6px hsla(168,76%,42%,0.55), 0 1px 3px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(255,100%,100%,0.08)",
            }}
          >
            Explore The Ritual
          </a>
          <a
            href="#community"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold tracking-[0.18em] uppercase text-xs rounded-xl transition-all duration-300 hover:scale-[1.025]"
            style={{
              color: "hsl(0,0%,88%)",
              background: "hsla(0,0%,100%,0.05)",
              border: "1px solid hsla(0,0%,100%,0.12)",
              boxShadow: "0 2px 12px -4px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(255,100%,100%,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            Join The Collective
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — functional */}
      <motion.button
        onClick={scrollToRitual}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 group cursor-pointer"
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        aria-label="Scroll to products"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase font-medium" style={{ color: "hsla(0,0%,60%,0.7)" }}>
          Explore
        </span>
        <ChevronDown size={16} style={{ color: "hsla(0,0%,60%,0.6)" }} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
