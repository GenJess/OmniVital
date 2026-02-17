import { motion } from "framer-motion";
import { FlaskConical, ShieldCheck, Leaf, Zap } from "lucide-react";

const pillars = [
  {
    icon: FlaskConical,
    label: "Precision Dosing",
    title: "Research-Backed Formulas",
    description: "Every ingredient formulated at research-informed levels to promote optimal results. No fairy-dusting, no proprietary blends — full-label transparency always.",
    stat: "100%",
    statLabel: "Label Transparency",
  },
  {
    icon: ShieldCheck,
    label: "Verified Purity",
    title: "Third-Party Tested",
    description: "Independent lab verification promotes confidence in purity and potency. Every batch tested for heavy metals, contaminants, and ingredient accuracy.",
    stat: "3rd Party",
    statLabel: "Lab Certified",
  },
  {
    icon: Leaf,
    label: "Clean Origin",
    title: "Traceable Sourcing",
    description: "From ethical harvest to final capsule — our supply chain promotes sustainability and accountability. Zero fillers, binders, or artificial additives.",
    stat: "Zero",
    statLabel: "Fillers or Additives",
  },
  {
    icon: Zap,
    label: "Bioavailability",
    title: "Optimized Absorption",
    description: "Advanced delivery systems designed to promote maximum nutrient uptake. Because even the best formula needs to reach your cells to make a difference.",
    stat: "Advanced",
    statLabel: "Delivery Systems",
  },
];

const ScienceSection = () => {
  return (
    <section id="science" className="py-24 md:py-36 px-6 relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(168,76%,42%,0.06)_0%,_transparent_60%)]" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
            The Science
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[0.95]">
            Built to{" "}
            <span className="text-gradient">Perform.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-lg max-w-xl mx-auto">
            Every formula designed to promote maximum bioavailability and support your performance goals.
            {" "}These statements have not been evaluated by the FDA. Our products are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </motion.div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-light rounded-2xl p-8 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
            >
              {/* Subtle corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, hsla(168,76%,42%,0.08) 0%, transparent 70%)", transform: "translate(40%, -40%)" }}
              />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                  <pillar.icon size={22} className="text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-foreground">{pillar.stat}</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{pillar.statLabel}</p>
                </div>
              </div>

              <span className="text-[9px] tracking-[0.25em] uppercase text-accent font-bold px-2.5 py-1 rounded-full border border-accent/20 bg-accent/5">
                {pillar.label}
              </span>

              <h3 className="text-lg font-bold text-foreground mt-3 mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-[10px] text-muted-foreground/50 mt-12 max-w-2xl mx-auto leading-relaxed tracking-wide"
        >
          * These statements have not been evaluated by the Food and Drug Administration. Our products are not intended to diagnose, treat, cure, or prevent any disease.
        </motion.p>
      </div>
    </section>
  );
};

export default ScienceSection;
