import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import VoiceAgent from "@/components/VoiceAgent";
import {
  Users,
  Lock,
  Shield,
  Palette,
  MessageSquare,
  Heart,
  Zap,
  Moon,
  Brain,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  EyeOff,
  BadgeCheck,
} from "lucide-react";

// Color tags for community matching
const COLOR_TAGS = [
  { name: "Teal Focus", color: "#0D9488", description: "Energy & cognitive performance", icon: Zap },
  { name: "Gold Resilience", color: "#F59E0B", description: "Stress adaptation & endurance", icon: Shield },
  { name: "Rose Balance", color: "#F472B6", description: "Mood stability & emotional wellness", icon: Heart },
  { name: "Indigo Depth", color: "#818CF8", description: "Deep focus & creative flow", icon: Brain },
  { name: "Violet Recovery", color: "#7C3AED", description: "Sleep quality & neural repair", icon: Moon },
  { name: "Red Executive", color: "#DC2626", description: "High-pressure performance", icon: Target },
];

// Sample community threads
const THREADS = [
  {
    id: 1,
    author: { initials: "MR", badge: "Teal Focus", badgeColor: "#0D9488" },
    title: "Two weeks into the morning stack — here's what changed",
    preview: "Started OV Drive + OV Adapt together. First week was subtle, but by day 10 my afternoon energy dip basically disappeared...",
    replies: 14,
    likes: 38,
    time: "2h ago",
    tags: ["Morning Protocol", "OV Drive", "OV Adapt"],
  },
  {
    id: 2,
    author: { initials: "SK", badge: "Rose Balance", badgeColor: "#F472B6" },
    title: "OV Bright + meditation — a game-changing combo",
    preview: "For anyone who meditates: taking OV Bright 30 minutes before your session creates this beautiful calm baseline...",
    replies: 9,
    likes: 27,
    time: "4h ago",
    tags: ["Midday Protocol", "OV Bright", "Meditation"],
  },
  {
    id: 3,
    author: { initials: "JL", badge: "Indigo Depth", badgeColor: "#818CF8" },
    title: "Quiet Focus for coding sessions — my protocol",
    preview: "As a software engineer, I need 4-5 hour deep focus blocks. OV Quiet Focus at 11am with a light meal, then...",
    replies: 22,
    likes: 56,
    time: "6h ago",
    tags: ["OV Quiet Focus", "Deep Work", "Protocol"],
  },
  {
    id: 4,
    author: { initials: "OV", badge: "Team", badgeColor: "#0D9488", isTeam: true },
    title: "The science of stacking: why timing matters more than dosage",
    preview: "We get this question a lot: 'Can I take everything at once?' Here's why we designed the morning/midday/evening protocol...",
    replies: 31,
    likes: 89,
    time: "1d ago",
    tags: ["Science", "Protocol Design", "Official"],
  },
];

const Community = () => {
  const { user } = useAuth();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-24">
        {/* Hero */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
                The Collective
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Your People.
                <br />
                <span className="text-gradient">Your Privacy.</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-light max-w-lg mx-auto leading-relaxed mb-8">
                Connect with like-minded individuals pursuing similar wellness goals.
                No follower counts. No vanity metrics. Just real conversations between
                people who take their performance seriously.
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Lock size={14} className="text-primary" />
                  Privacy-first
                </span>
                <span className="flex items-center gap-2">
                  <Palette size={14} className="text-accent" />
                  Color-matched
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={14} className="text-primary" />
                  No personal data shared
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Color Tag Matching */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Palette size={18} className="text-accent" />
                <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                  Your Wellness Color
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-6 max-w-lg">
                Your color tag is derived from your ritual stack — it represents your wellness
                focus without revealing what you take. Find others who share your color.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COLOR_TAGS.map((tag, i) => (
                  <motion.button
                    key={tag.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    className={`group relative p-4 rounded-xl border text-left transition-all duration-300 ${
                      selectedTag === tag.name
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-primary/20 bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: tag.color, boxShadow: `0 0 10px ${tag.color}40` }}
                      />
                      <span className="text-xs font-semibold text-foreground">{tag.name}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{tag.description}</p>
                    <tag.icon
                      size={14}
                      className="absolute top-4 right-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card/50 p-8 md:p-10"
            >
              <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-foreground mb-6">
                How The Collective Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: EyeOff,
                    title: "Privacy by Design",
                    text: "Your ritual stack generates a color tag — others see your wellness focus, never your specific products. No names required.",
                  },
                  {
                    icon: Palette,
                    title: "Color-Matched Groups",
                    text: "Connect with members who share your wellness color. Similar goals, similar journeys — without exposing personal details.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Learn & Grow Together",
                    text: "Share insights, protocols, and wins. Real conversations between people who take their health seriously.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <item.icon size={20} className="text-primary mb-3" />
                    <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Discussion Threads */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                  Recent Conversations
                </h2>
              </div>
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase px-2.5 py-1 rounded-full border"
                style={{
                  color: "hsl(42,80%,60%)",
                  borderColor: "hsla(42,80%,55%,0.3)",
                  background: "hsla(42,80%,55%,0.08)",
                }}
              >
                OVO\u00b7G Members
              </span>
            </div>

            <div className="space-y-3">
              {THREADS.map((thread, i) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group rounded-2xl border border-border bg-card hover:border-primary/20 transition-all duration-300 p-5 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0"
                      style={
                        thread.author.isTeam
                          ? {
                              background: "linear-gradient(135deg, hsl(168,76%,42%) 0%, hsl(42,80%,55%) 100%)",
                              color: "white",
                            }
                          : { background: "hsl(var(--secondary))", color: "hsl(var(--foreground))" }
                      }
                    >
                      {thread.author.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[9px] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 rounded-full border"
                          style={{
                            color: thread.author.badgeColor,
                            borderColor: `${thread.author.badgeColor}40`,
                            background: `${thread.author.badgeColor}10`,
                          }}
                        >
                          {thread.author.badge}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{thread.time}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1 truncate">
                        {thread.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {thread.preview}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MessageSquare size={10} /> {thread.replies} replies
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Heart size={10} /> {thread.likes}
                        </span>
                        <div className="flex gap-1.5 ml-auto">
                          {thread.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/60 px-2 py-0.5 rounded-full bg-secondary/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA to join */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-8 text-center"
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Join The Collective
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your account to participate in discussions, connect with
                  your color-matched community, and share your wellness journey.
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold tracking-widest uppercase rounded-lg text-accent-foreground"
                  style={{
                    background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))",
                    boxShadow: "0 4px 20px -6px hsla(168,76%,42%,0.4)",
                  }}
                >
                  Get Started <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 rounded-2xl border border-border bg-card/50 p-6 text-center"
              >
                <Lock size={20} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Full community features — threaded discussions, color-matched groups,
                  and direct messaging — launching soon for OVO\u00b7G members.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <VoiceAgent />
    </div>
  );
};

export default Community;
