import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToRitual = () => {
    document.getElementById("ritual")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image — slow zoom in */}
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Heavy dark overlay matching the card background darkness */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(0,0%,4%) 0%, hsla(0,0%,4%,0.6) 30%, hsla(0,0%,4%,0.7) 60%, hsl(0,0%,4%) 100%)",
        }}
      />
      {/* Side vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, hsla(0,0%,4%,0.55) 0%, transparent 28%, transparent 72%, hsla(0,0%,4%,0.55) 100%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl w-full">
        {/* Eyebrow — same style as RitualGrid's "THE RITUAL" label */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-6"
        >
          AI-Personalized Wellness
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight text-foreground leading-[0.93] mb-6"
        >
          Your Ritual,
          <br />
          <span className="text-gradient">Intelligent</span> by Design.
        </motion.h1>

        {/* Subtitle — same muted-foreground font-light as cards */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.68 }}
          className="text-base md:text-lg text-muted-foreground font-light tracking-wide max-w-xl mx-auto leading-relaxed mb-10"
        >
          Meet your AI Ritual Advisor — personalized protocols built around your biology,
          goals, and lifestyle, refined through every conversation.
        </motion.p>

        {/* CTAs — same corner radius + sizing language as RitualGrid cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.84 }}
          className="flex flex-col sm:flex-row items-center gap-3 justify-center"
        >
          <a
            href="#ritual"
            className="inline-flex items-center gap-2 px-9 py-3.5 bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-xs rounded-xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              boxShadow:
                "0 4px 20px -5px hsla(168,76%,42%,0.5), 0 1px 3px hsla(0,0%,0%,0.35)",
            }}
          >
            Explore The Ritual
          </a>
          <a
            href="#community"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-muted-foreground font-semibold tracking-[0.18em] uppercase text-xs rounded-xl hover:border-primary/30 hover:text-foreground transition-all duration-300 hover:scale-[1.02]"
          >
            Join The Collective
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToRitual}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer group"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
        aria-label="Scroll to products"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase font-medium text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
          Explore
        </span>
        <ChevronDown size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
