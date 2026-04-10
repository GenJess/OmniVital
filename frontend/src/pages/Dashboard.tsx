import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Star,
  LogOut,
  Plus,
  Flame,
  MessageCircle,
  ChevronRight,
  Leaf,
  Users,
  Send,
  Lock,
} from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import VoiceAgent from "@/components/VoiceAgent";


interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  image_url: string | null;
  slug: string;
}

interface UserRitual {
  id: string;
  product_id: string;
  added_at: string;
  products: Product;
}

interface RitualLog {
  id: string;
  product_id: string;
  logged_at: string;
  feeling_score: number;
}

const COLLECTIVE_TIPS = [
  {
    id: 1,
    tag: "Protocol",
    title: "The morning stack matters most.",
    body: "Your cortisol peak is within 30–45 minutes of waking. That's the window to take your adaptogens and cognitive support. Stack them before coffee.",
    author: "OmniaVital Protocol Team",
  },
  {
    id: 2,
    tag: "Insight",
    title: "Consistency beats optimization.",
    body: "A ritual taken daily at 70% optimization beats a perfect stack taken 3 days a week. Your body adapts to rhythms — honor them.",
    author: "From The Collective",
  },
  {
    id: 3,
    tag: "Science",
    title: "Bioavailability is everything.",
    body: "Most people take high-quality supplements and absorb 30% of them. Take fat-soluble compounds with food. Take water-soluble on an empty stomach.",
    author: "OmniaVital Research",
  },
];

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

const Dashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [rituals, setRituals] = useState<UserRitual[]>([]);
  const [todayLogs, setTodayLogs] = useState<RitualLog[]>([]);
  const [weekLogs, setWeekLogs] = useState<RitualLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [addingProduct, setAddingProduct] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const fetchData = async () => {
    if (!user) return;
    setDataLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const [ritualsRes, logsRes, weekLogsRes, productsRes] = await Promise.all([
      supabase
        .from("user_rituals")
        .select("*, products(*)")
        .eq("user_id", user.id),
      supabase
        .from("ritual_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_at", today.toISOString()),
      supabase
        .from("ritual_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_at", weekAgo.toISOString()),
      supabase.from("products").select("*"),
    ]);

    if (ritualsRes.data) setRituals(ritualsRes.data as unknown as UserRitual[]);
    if (logsRes.data) setTodayLogs(logsRes.data);
    if (weekLogsRes.data) setWeekLogs(weekLogsRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading]);

  const handleCheckIn = async (productId: string, score: number) => {
    if (!user) return;
    setCheckingIn(productId);
    const { error } = await supabase.from("ritual_logs").insert({
      user_id: user.id,
      product_id: productId,
      feeling_score: score,
    });
    if (error) {
      toast.error("Failed to log check-in.");
    } else {
      toast.success("Ritual logged ✓");
      await fetchData();
    }
    setCheckingIn(null);
  };

  const handleRemoveRitual = async (ritualId: string) => {
    const { error } = await supabase.from("user_rituals").delete().eq("id", ritualId);
    if (!error) {
      setRituals((prev) => prev.filter((r) => r.id !== ritualId));
      toast.success("Removed from your ritual.");
    }
  };

  const handleAddProduct = async (productId: string) => {
    if (!user) return;
    const alreadyAdded = rituals.some((r) => r.product_id === productId);
    if (alreadyAdded) {
      toast.info("Already in your ritual.");
      return;
    }
    setAddingProduct(productId);
    const { error } = await supabase.from("user_rituals").insert({
      user_id: user.id,
      product_id: productId,
    });
    if (error) {
      toast.error("Failed to add product.");
    } else {
      toast.success("Added to your ritual ✓");
      await fetchData();
      setShowAddPanel(false);
    }
    setAddingProduct(null);
  };

  const isLoggedToday = (productId: string) =>
    todayLogs.some((l) => l.product_id === productId);

  const getStreakDays = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);
      return weekLogs.some((l) => {
        const logDate = new Date(l.logged_at);
        return logDate >= d && logDate < nextD;
      });
    });
    return days;
  };

  const streakDays = getStreakDays();
  const currentStreak = [...streakDays].reverse().findIndex((d) => !d);
  const streakCount = currentStreak === -1 ? 7 : currentStreak;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient backdrop */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsla(168,76%,42%,0.06)_0%,_transparent_50%)] pointer-events-none" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoMark} alt="OmniaVital" className="w-8 h-8 rounded-lg" />
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-foreground hidden sm:block">
              OmniaVital
            </span>
          </Link>

          {/* Right row — all in one line */}
          <div className="flex items-center gap-2.5">
            {/* OVO G gold badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
              style={{
                background: "linear-gradient(135deg, hsla(42,80%,55%,0.12) 0%, hsla(42,80%,35%,0.06) 100%)",
                borderColor: "hsla(42,80%,55%,0.35)",
              }}
            >
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase"
                style={{ color: "hsl(42,80%,60%)" }}
              >
                OVO·G
              </span>
            </div>

            {/* Avatar + name */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-black text-accent-foreground">
                {firstName[0]?.toUpperCase()}
              </div>
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground hidden sm:block">
                {profile?.full_name?.split(" ")[0] || firstName}
              </span>
            </div>

            {/* Sign out as a styled button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-border"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl space-y-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-2">Your Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {greeting()}, {firstName}.
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.ritual_summary || "Your ritual is ready. Let's optimize."}
          </p>
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass rounded-2xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-accent" />
              <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                7-Day Streak
              </h2>
            </div>
            <span className="text-2xl font-bold text-foreground">{streakCount}<span className="text-sm font-normal text-muted-foreground ml-1">days</span></span>
          </div>
          <div className="flex gap-2">
            {streakDays.map((active, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-full h-8 rounded-md transition-all duration-300 ${
                    active
                      ? "bg-primary shadow-sm shadow-primary/20"
                      : "bg-secondary/50 border border-border"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground">{DAYS_OF_WEEK[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ritual Stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Leaf size={18} className="text-primary" />
              <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                Your Ritual Stack
              </h2>
            </div>
            <button
              onClick={() => setShowAddPanel(!showAddPanel)}
              className="flex items-center gap-1.5 text-xs font-medium tracking-[0.1em] uppercase text-primary hover:text-primary/80 transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* Add product panel */}
          {showAddPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 glass rounded-2xl border border-border p-4 space-y-2"
            >
              <p className="text-xs text-muted-foreground tracking-[0.1em] uppercase mb-3">Choose a product to add</p>
              {products
                .filter((p) => !rituals.some((r) => r.product_id === p.id))
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddProduct(product.id)}
                    disabled={addingProduct === product.id}
                    className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl border border-border transition-all text-left group"
                  >
                    <span className="text-sm text-foreground font-medium">{product.name}</span>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              {products.filter((p) => !rituals.some((r) => r.product_id === p.id)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">All products are in your ritual.</p>
              )}
            </motion.div>
          )}

          {rituals.length === 0 ? (
            <div className="glass rounded-2xl border border-border border-dashed p-10 text-center">
              <Sparkles size={28} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Your ritual stack is empty.</p>
              <p className="text-xs text-muted-foreground mt-1">Add products above or talk to your advisor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rituals.map((ritual, i) => {
                const logged = isLoggedToday(ritual.product_id);
                return (
                  <motion.div
                    key={ritual.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`glass rounded-2xl border transition-all duration-300 p-5 ${
                      logged ? "border-primary/30 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${logged ? "bg-primary/20" : "bg-secondary"}`}>
                          {logged
                            ? <CheckCircle2 size={20} className="text-primary" />
                            : <Circle size={20} className="text-muted-foreground" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{ritual.products.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{ritual.products.tagline}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRitual(ritual.id)}
                        className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>

                    {!logged && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mb-2.5">
                          Log today — How do you feel?
                        </p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleCheckIn(ritual.product_id, score)}
                              disabled={checkingIn === ritual.product_id}
                              className="flex-1 py-2 rounded-lg bg-secondary/50 border border-border hover:border-primary hover:bg-primary/10 text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-200 flex items-center justify-center gap-1"
                            >
                              <Star size={10} className={score >= 4 ? "text-accent" : ""} />
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {logged && (
                      <div className="mt-3 pt-3 border-t border-primary/10">
                        <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> Logged today
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* From The Collective */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
              From The Collective
            </h2>
          </div>
          <div className="space-y-4">
            {COLLECTIVE_TIPS.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="glass rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold px-2.5 py-1 rounded-full border border-accent/20 bg-accent/5">
                    {tip.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
                <p className="text-[10px] text-muted-foreground mt-4 tracking-[0.15em] uppercase">— {tip.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Chat Board */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Users size={18} className="text-primary" />
            <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
              The Collective — Chat
            </h2>
            <span
              className="ml-auto text-[9px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded-full border"
              style={{ color: "hsl(42,80%,60%)", borderColor: "hsla(42,80%,55%,0.3)", background: "hsla(42,80%,55%,0.08)" }}
            >
              OVO·G Members
            </span>
          </div>

          <div className="glass rounded-2xl border border-border overflow-hidden">
            {/* Chat messages area */}
            <div className="p-5 space-y-4 min-h-[240px]">
              {[
                { initials: "MR", name: "Marcus R.", time: "2h ago", msg: "Day 14 on the morning stack. Sleep quality has been noticeably better. Anyone else notice this?", badge: true },
                { initials: "SK", name: "Sofia K.", time: "1h ago", msg: "Yes! Especially stacking the adaptogens before coffee like the protocol says. Total game changer for cortisol.", badge: false },
                { initials: "JL", name: "James L.", time: "45m ago", msg: "How long before most people start feeling the cognitive stack working? I'm on day 5.", badge: true },
                { initials: "OV", name: "OmniaVital Team", time: "30m ago", msg: "Most members report noticing cognitive support around days 7–14 as the compounds build in your system. Consistency is everything 🌿", badge: false, isTeam: true },
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={msg.isTeam
                      ? { background: "linear-gradient(135deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)", color: "white" }
                      : { background: "hsl(var(--secondary))", color: "hsl(var(--foreground))" }
                    }
                  >
                    {msg.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-foreground">{msg.name}</span>
                      {msg.badge && (
                        <span
                          className="text-[8px] font-black tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-full border"
                          style={{ color: "hsl(42,80%,60%)", borderColor: "hsla(42,80%,55%,0.3)", background: "hsla(42,80%,55%,0.08)" }}
                        >
                          OVO·G
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{msg.time}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${msg.isTeam ? "text-primary" : "text-muted-foreground"}`}>
                      {msg.msg}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat input */}
            <div className="border-t border-border p-4 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-black text-accent-foreground flex-shrink-0">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl">
                <input
                  type="text"
                  placeholder="Share with The Collective..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* Coming soon overlay */}
            <div className="relative">
              <div className="absolute inset-x-0 -top-28 h-28 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/50 mt-3 tracking-wide flex items-center justify-center gap-1.5">
            <Lock size={9} />
            Live community coming soon — OVO·G members get early access
          </p>
        </motion.div>

        {/* Talk to Advisor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-8 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={20} className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Talk to Your Ritual Advisor</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Your AI advisor knows your stack, your goals, and your history. Ask anything — optimize, refine, or just check in.
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Tap the OV orb in the bottom right corner
          </p>
        </motion.div>
      </main>

      <VoiceAgent />
    </div>
  );
};

export default Dashboard;

