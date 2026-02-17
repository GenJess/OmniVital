import { motion } from "framer-motion";
import { FlaskConical, ShieldCheck, Leaf, Zap } from "lucide-react";

const pillars = [
  {
    icon: FlaskConical,
    label: "Precision Dosing",
    title: "Research-Backed Formulas",
    description:
      "Every ingredient formulated at research-informed levels to promote optimal results. No fairy-dusting, no proprietary blends — full-label transparency always.",
    stat: "100%",
    statLabel: "Label Transparency",
  },
  {
    icon: ShieldCheck,
    label: "Verified Purity",
    title: "Third-Party Tested",
    description:
      "Independent lab verification promotes confidence in purity and potency. Every batch tested for heavy metals, contaminants, and ingredient accuracy.",
    stat: "3rd Party",
    statLabel: "Lab Certified",
  },
  {
    icon: Leaf,
    label: "Clean Origin",
    title: "Traceable Sourcing",
    description:
      "From ethical harvest to final capsule — our supply chain promotes sustainability and accountability. Zero fillers, binders, or artificial additives.",
    stat: "Zero",
    statLabel: "Fillers or Additives",
  },
  {
    icon: Zap,
    label: "Bioavailability",
    title: "Optimized Absorption",
    description:
      "Advanced delivery systems designed to promote maximum nutrient uptake. Because even the best formula needs to reach your cells to make a difference.",
    stat: "Advanced",
    statLabel: "Delivery Systems",
  },
];

const ScienceSection = () => {
  return (
    <section id="science" className="py-24 md:py-32 px-6">
      <div className="container mx-auto">
        {/* Section header — identical pattern to RitualGrid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
            The Science
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Built to <span className="text-gradient">Perform.</span>
          </h2>
          <p className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
            Every formula designed to promote maximum bioavailability and support your performance goals.
          </p>
        </motion.div>

        {/* 2×2 grid — same card style as RitualGrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group bg-card border border-border rounded-xl p-7 hover:border-primary/25 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden"
            >
              {/* Subtle corner glow on hover */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, hsla(168,76%,42%,0.07) 0%, transparent 70%)",
                  transform: "translate(50%, -50%)",
                }}
              />

              {/* Icon + stat row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center group-hover:bg-primary/12 transition-colors duration-300">
                  <pillar.icon size={20} className="text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-foreground leading-none">{pillar.stat}</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-0.5">
                    {pillar.statLabel}
                  </p>
                </div>
              </div>

              {/* Category tag — matches RitualGrid's category pill */}
              <span className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground px-2.5 py-1 rounded-full border border-border bg-secondary/50 font-medium">
                {pillar.label}
              </span>

              <h3 className="text-base font-semibold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors duration-300">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FDA disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-[10px] text-muted-foreground/40 mt-12 max-w-2xl mx-auto leading-relaxed tracking-wide"
        >
          * These statements have not been evaluated by the Food and Drug Administration.
          Our products are not intended to diagnose, treat, cure, or prevent any disease.
        </motion.p>
      </div>
    </section>
  );
};

export default ScienceSection;
