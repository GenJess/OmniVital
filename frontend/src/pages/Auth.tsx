import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, ArrowLeft, Eye, EyeOff } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";

type Mode = "signin" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setVerificationSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
            <Sparkles size={28} className="text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Check your inbox</h2>
          <p className="text-muted-foreground mb-6">
            We've sent a verification link to <span className="text-foreground font-medium">{email}</span>. Click it to activate your account and access your Ritual Dashboard.
          </p>
          <button
            onClick={() => { setMode("signin"); setVerificationSent(false); }}
            className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            Back to sign in
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subtle gradient backdrop */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(168,76%,42%,0.06)_0%,_transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsla(42,80%,55%,0.04)_0%,_transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoMark} alt="OmniVital" className="w-8 h-8 rounded-lg" />
          <span className="text-sm font-bold tracking-[0.15em] uppercase text-foreground">OmniVital</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.15em] uppercase">
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-accent font-medium mb-5 px-4 py-2 rounded-full border border-accent/20 bg-accent/5">
              <Sparkles size={12} />
              The Collective
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {mode === "signin" ? "Welcome back." : "Join the ritual."}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Your advisor is waiting."
                : "AI-optimized wellness, personalized for you."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-secondary/50 rounded-lg p-1 mb-8 border border-border">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-xs font-semibold tracking-[0.15em] uppercase rounded-md transition-all duration-200 ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  key="fullname"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-5 py-4 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm rounded-lg hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:scale-100 mt-2"
            >
              {loading
                ? "..."
                : mode === "signin"
                ? "Enter the Collective"
                : "Create My Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {mode === "signin" ? "New to OmniVital?" : "Already a member?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
