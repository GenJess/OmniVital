import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Lock, Shield, Palette, MessageSquare, Heart, Zap, Moon, Brain, Target,
  TrendingUp, EyeOff, ArrowRight,
} from "lucide-react";

const COLOR_TAGS = [
  { name: "Teal Focus", color: "#0D9488", description: "Energy & cognitive performance", icon: Zap },
  { name: "Gold Resilience", color: "#F59E0B", description: "Stress adaptation & endurance", icon: Shield },
  { name: "Rose Balance", color: "#F472B6", description: "Mood stability & emotional wellness", icon: Heart },
  { name: "Indigo Depth", color: "#818CF8", description: "Deep focus & creative flow", icon: Brain },
  { name: "Violet Recovery", color: "#7C3AED", description: "Sleep quality & neural repair", icon: Moon },
  { name: "Red Executive", color: "#DC2626", description: "High-pressure performance", icon: Target },
];

const THREADS = [
  { id: 1, author: { initials: "MR", badge: "Teal Focus", badgeColor: "#0D9488" }, title: "Two weeks into the morning stack \u2014 here\u2019s what changed", preview: "Started OV Drive + OV Adapt together. First week was subtle, but by day 10 my afternoon energy dip basically disappeared...", replies: 14, likes: 38, time: "2h ago", tags: ["Morning Protocol", "OV Drive"] },
  { id: 2, author: { initials: "SK", badge: "Rose Balance", badgeColor: "#F472B6" }, title: "OV Bright + meditation \u2014 a game-changing combo", preview: "For anyone who meditates: taking OV Bright 30 minutes before your session creates this beautiful calm baseline...", replies: 9, likes: 27, time: "4h ago", tags: ["Midday Protocol", "OV Bright"] },
  { id: 3, author: { initials: "JL", badge: "Indigo Depth", badgeColor: "#818CF8" }, title: "Quiet Focus for coding sessions \u2014 my protocol", preview: "As a software engineer, I need 4-5 hour deep focus blocks. OV Quiet Focus at 11am with a light meal, then...", replies: 22, likes: 56, time: "6h ago", tags: ["OV Quiet Focus", "Deep Work"] },
  { id: 4, author: { initials: "OV", badge: "Team", badgeColor: "#0D9488", isTeam: true }, title: "The science of stacking: why timing matters more than dosage", preview: "We get this question a lot: \u2018Can I take everything at once?\u2019 Here\u2019s why we designed the morning/midday/evening protocol...", replies: 31, likes: 89, time: "1d ago", tags: ["Science", "Official"] },
  { id: 5, author: { initials: "AW", badge: "Violet Recovery", badgeColor: "#7C3AED" }, title: "Neuro Night changed my sleep architecture", preview: "I\u2019ve been wearing a sleep tracker for 6 months. After 3 weeks on OV Neuro Night, my deep sleep went from 45min to 1h20min...", replies: 18, likes: 63, time: "8h ago", tags: ["OV Neuro Night", "Sleep Data"] },
];

const CollectiveCommunity = () => {
  const { user } = useAuth();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-1">The Collective</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Your People. <span className="text-gradient">Your Privacy.</span></h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg">
          Connect with like-minded individuals pursuing similar wellness goals. No follower counts. No vanity metrics. Just real conversations.
        </p>
        <div className="flex items-center gap-5 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Lock size={13} className="text-primary" /> Privacy-first</span>
          <span className="flex items-center gap-1.5"><Palette size={13} className="text-accent" /> Color-matched</span>
          <span className="flex items-center gap-1.5"><Shield size={13} className="text-primary" /> No personal data shared</span>
        </div>
      </motion.div>

      {/* Color Tags */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-accent" />
          <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">Wellness Colors</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {COLOR_TAGS.map((tag, i) => (
            <motion.button key={tag.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
              className={`group relative p-3 rounded-xl border text-left transition-all duration-200 ${selectedTag === tag.name ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20 bg-card/50"}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tag.color, boxShadow: `0 0 8px ${tag.color}40` }} />
                <span className="text-[11px] font-semibold text-foreground">{tag.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{tag.description}</p>
              <tag.icon size={12} className="absolute top-3 right-3 text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border bg-card/30 p-6">
        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: EyeOff, title: "Privacy by Design", text: "Your ritual generates a color tag. Others see your wellness focus, never your specific products." },
            { icon: Palette, title: "Color-Matched Groups", text: "Connect with members who share your color. Similar goals, similar journeys." },
            { icon: TrendingUp, title: "Learn Together", text: "Share insights, protocols, and wins. Real conversations between serious people." },
          ].map((item, i) => (
            <div key={item.title}>
              <item.icon size={16} className="text-primary mb-2" />
              <h4 className="text-[13px] font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Threads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">Conversations</h2>
          </div>
          <span className="text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border" style={{ color: "hsl(42,80%,60%)", borderColor: "hsla(42,80%,55%,0.3)", background: "hsla(42,80%,55%,0.08)" }}>OVO\u00b7G</span>
        </div>

        <div className="space-y-2">
          {THREADS.map((thread, i) => (
            <motion.div key={thread.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="group rounded-xl border border-border bg-card/50 hover:border-primary/20 transition-all p-4 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={thread.author.isTeam ? { background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(42,80%,55%))", color: "white" } : { background: "hsl(var(--secondary))", color: "hsl(var(--foreground))" }}>
                  {thread.author.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] tracking-[0.1em] uppercase font-semibold px-1.5 py-0.5 rounded-full border"
                      style={{ color: thread.author.badgeColor, borderColor: `${thread.author.badgeColor}40`, background: `${thread.author.badgeColor}10` }}>
                      {thread.author.badge}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{thread.time}</span>
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors mb-0.5 truncate">{thread.title}</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{thread.preview}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><MessageSquare size={10} /> {thread.replies}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Heart size={10} /> {thread.likes}</span>
                    <div className="flex gap-1 ml-auto">
                      {thread.tags.slice(0, 2).map(tag => <span key={tag} className="text-[8px] tracking-[0.1em] uppercase text-muted-foreground/50 px-1.5 py-0.5 rounded-full bg-secondary/40">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card/30 p-5 text-center">
          <Lock size={16} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Full threaded discussions, color-matched groups, and direct messaging launching soon for OVO\u00b7G members.</p>
        </div>
      </div>
    </div>
  );
};

export default CollectiveCommunity;
