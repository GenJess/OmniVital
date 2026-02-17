import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image with subtle zoom */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-primary font-medium px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
            AI-Personalized Wellness
          </span>
          <span
            className="text-[9px] font-black tracking-[0.25em] uppercase px-2.5 py-1 rounded-full border"
            style={{
              color: "hsl(42,80%,60%)",
              background: "linear-gradient(135deg, hsla(42,80%,55%,0.1) 0%, hsla(42,80%,35%,0.06) 100%)",
              borderColor: "hsla(42,80%,55%,0.3)",
            }}
          >
            OVO·G
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95]"
        >
          Your Ritual,
          <br />
          <span className="text-gradient">Intelligent</span> by Design.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground font-light tracking-wide max-w-2xl mx-auto"
        >
          Meet your AI Ritual Advisor. Personalized protocols built around your biology,
          goals, and lifestyle — refined through every conversation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 justify-center"
        >
          <a
            href="#ritual"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm rounded-lg hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
          >
            Explore The Ritual
          </a>
          <a
            href="#community"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-muted-foreground font-semibold tracking-widest uppercase text-sm rounded-lg hover:border-primary/40 hover:text-foreground transition-all duration-300"
          >
            Join The Collective
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
