import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, ArrowRight } from "lucide-react";

const CommunitySection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from("email_signups").insert({ email });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="community" className="py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(168,76%,42%,0.08)_0%,_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-2xl text-center relative z-10"
      >
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-accent font-medium mb-4 px-4 py-2 rounded-full border border-accent/20 bg-accent/5">
          <Sparkles size={14} />
          The Collective
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Join The Collective.
        </h2>
        <p className="text-muted-foreground font-light mb-2 text-lg">
          AI-optimized rituals, a community of people doing the same.
        </p>
        <p className="text-muted-foreground/70 text-sm mb-10">
          Get 20% off your first subscription. Early access. Exclusive protocols.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="text-primary text-lg font-medium flex items-center justify-center gap-2">
              <Sparkles size={18} />
              Welcome to the Collective.
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm rounded-lg hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
            >
              Create Your Account
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm rounded-lg hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "..." : "Apply"}
              </button>
            </form>

            <div className="flex items-center gap-3 justify-center">
              <div className="h-px bg-border flex-1 max-w-[80px]" />
              <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase">or</span>
              <div className="h-px bg-border flex-1 max-w-[80px]" />
            </div>

            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 border border-primary/30 text-primary font-semibold tracking-widest uppercase text-sm rounded-lg hover:bg-primary/10 transition-all duration-300"
            >
              <Sparkles size={14} />
              Create Your Account
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default CommunitySection;
