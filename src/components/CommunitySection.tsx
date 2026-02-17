import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

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
    <section id="community" className="py-24 md:py-32 px-6">
      <div className="container mx-auto">
        {/* Section header — identical to RitualGrid + ScienceSection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
            The Collective
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Join The Collective.
          </h2>
          <p className="text-sm text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
            AI-optimized rituals. A community of people doing the same.
          </p>
        </motion.div>

        {/* Card — same bg-card + border-border as RitualGrid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-8 md:p-12 max-w-2xl mx-auto text-center relative overflow-hidden"
        >
          {/* Ambient teal glow in background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 120%, hsla(168,76%,42%,0.06) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10">
            <p className="text-muted-foreground font-light mb-2 leading-relaxed">
              Get 20% off your first subscription.
            </p>
            <p className="text-xs text-muted-foreground/60 tracking-[0.15em] uppercase mb-10">
              Early access · Exclusive protocols
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                <p className="text-primary text-sm font-medium tracking-wide">
                  Welcome to the Collective.
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-xs rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ boxShadow: "0 4px 20px -5px hsla(168,76%,42%,0.45)" }}
                >
                  Create Your Account
                  <ArrowRight size={13} />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-3.5 bg-secondary/60 border border-border rounded-xl text-foreground placeholder:text-muted-foreground text-sm tracking-wide focus:outline-none focus:border-primary/40 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3.5 bg-primary text-primary-foreground font-semibold tracking-[0.18em] uppercase text-xs rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                    style={{ boxShadow: "0 4px 18px -5px hsla(168,76%,42%,0.45)" }}
                  >
                    {loading ? "..." : "Apply"}
                  </button>
                </form>

                <div className="flex items-center gap-3 justify-center">
                  <div className="h-px bg-border flex-1 max-w-[60px]" />
                  <span className="text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase">or</span>
                  <div className="h-px bg-border flex-1 max-w-[60px]" />
                </div>

                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-muted-foreground font-semibold tracking-[0.18em] uppercase text-xs rounded-xl hover:border-primary/25 hover:text-foreground transition-all duration-300"
                >
                  Create Your Account
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
