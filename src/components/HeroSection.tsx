import { motion } from "framer-motion";
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
        transition={{ duration: 2.8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Deep matte overlay — much heavier to kill background competition */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(0,0%,4%) 0%, hsla(0,0%,3%,0.72) 25%, hsla(0,0%,3%,0.82) 55%, hsl(0,0%,4%) 100%)",
        }}
      />
      {/* Radial spotlight — creates depth, keeps center readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 0%, hsla(0,0%,2%,0.55) 100%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl w-full">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[10px] tracking-[0.5em] uppercase text-primary font-semibold mb-8"
        >
          AI-Personalized Wellness
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-foreground leading-[0.92] mb-5"
        >
          Your Ritual,
          <br />
          <span className="text-gradient">Intelligent</span> by Design.
        </motion.h1>

        {/* Short, punchy subtitle — max two lines */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="text-sm md:text-base text-muted-foreground font-light tracking-wide max-w-sm mx-auto leading-relaxed mb-14"
        >
          Protocols built around you.
          <br />
          Refined through every conversation.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.78 }}
          className="flex flex-col sm:flex-row items-center gap-3 justify-center"
        >
          <a
            href="#ritual"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-primary text-primary-foreground font-semibold tracking-[0.2em] uppercase text-[11px] rounded-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.025] active:scale-[0.98]"
            style={{
              boxShadow:
                "0 0 0 1px hsla(168,76%,42%,0.3), 0 6px 28px -6px hsla(168,76%,42%,0.55), 0 2px 8px -2px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(255,100%,100%,0.1)",
            }}
          >
            Explore The Ritual
          </a>
          <a
            href="#community"
            className="inline-flex items-center gap-2 px-9 py-3.5 text-muted-foreground font-semibold tracking-[0.2em] uppercase text-[11px] rounded-xl transition-all duration-300 hover:text-foreground hover:scale-[1.025] active:scale-[0.98]"
            style={{
              background: "hsla(0,0%,100%,0.05)",
              border: "1px solid hsla(0,0%,100%,0.1)",
              boxShadow: "0 2px 12px -4px hsla(0,0%,0%,0.5), inset 0 1px 0 hsla(255,100%,100%,0.06)",
            }}
          >
            Join The Collective
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToRitual}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group focus:outline-none"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        aria-label="Scroll to products"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-medium text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors duration-300">
          Explore
        </span>
        {/* Custom minimal arrow */}
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors duration-300">
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </section>
  );
};

export default HeroSection;
