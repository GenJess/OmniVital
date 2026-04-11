import { motion } from "framer-motion";
import { MessageCircle, BarChart3, Users, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";

const steps = [
  {
    icon: MessageCircle,
    title: "Meet OV",
    subtitle: "Your Personal Advisor",
    description:
      "A voice-first AI consultant that understands your goals, pain points, and lifestyle. Not a chatbot — a personalized expert synthesizing clinical research, tailored to you.",
    accent: "hsl(168,76%,42%)",
  },
  {
    icon: Zap,
    title: "Build Your Ritual",
    subtitle: "Morning · Midday · Evening",
    description:
      "Six precision formulas mapped to three daily windows. OV helps you build the right stack — then guides you through checkout with subscription savings.",
    accent: "hsl(42,80%,55%)",
  },
  {
    icon: BarChart3,
    title: "Track & Quantify",
    subtitle: "Data-Driven Wellness",
    description:
      "Log intake, track how you feel, see trends over time. Move beyond guesswork — know what's working and optimize your protocol with real data.",
    accent: "hsl(168,76%,42%)",
  },
  {
    icon: Users,
    title: "Find Your People",
    subtitle: "Color-Matched Community",
    description:
      "Your routine generates a unique color signature. Find peers on similar paths without exposing anyone's stack. Real connections, real privacy.",
    accent: "hsl(42,80%,55%)",
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(0,0%,100%,0.1) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
            The Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            More Than Supplements.
            <br />
            <span className="text-gradient">A Wellness Operating System.</span>
          </h2>
          <p className="text-sm text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            AI-guided, quantitatively tracked, community-enriched.
            Here's what happens when you join The Collective.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-sm overflow-hidden"
              style={{
                background: "hsla(0,0%,100%,0.02)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid hsla(0,0%,100%,0.08)",
              }}
            >
              {/* Left accent line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ background: step.accent }}
              />

              <div className="flex items-start gap-5 p-6 md:p-8">
                {/* Step number + icon */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: step.accent }}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className="w-11 h-11 rounded-sm flex items-center justify-center"
                    style={{
                      background: `${step.accent}12`,
                      border: `1px solid ${step.accent}25`,
                    }}
                  >
                    <step.icon size={18} style={{ color: step.accent }} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground mb-0.5">
                    {step.title}
                  </h3>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase font-medium mb-2"
                    style={{ color: step.accent }}
                  >
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/auth"
            className="inline-flex items-center gap-2.5 px-10 py-3.5 font-semibold tracking-[0.2em] uppercase text-[11px] rounded-sm transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,34%))",
              color: "white",
              boxShadow:
                "0 0 0 1px hsla(168,76%,42%,0.3), 0 6px 28px -6px hsla(168,76%,42%,0.5)",
            }}
            data-testid="experience-cta"
          >
            Join The Collective
            <ArrowRight size={14} />
          </Link>
          <p className="text-[10px] text-muted-foreground/40 mt-3 tracking-wide">
            Free to explore. Subscribe when you're ready.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
