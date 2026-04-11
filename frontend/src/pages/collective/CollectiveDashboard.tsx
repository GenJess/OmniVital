import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, getProductById } from "@/data/products";
import VoiceAgent from "@/components/VoiceAgent";
import {
  Sparkles, CheckCircle2, Circle, Star, Flame, Send, Bot, User as UserIcon,
  Sun, Sunset, Moon, Plus, ChevronRight, Loader2, MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || "";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RitualLog {
  id: string;
  product_id: string;
  logged_at: string;
  feeling_score: number;
}

interface UserRitual {
  id: string;
  product_id: string;
  schedule_slot: string | null;
  is_paused: boolean;
}

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

const slotMeta = {
  morning: { label: "Morning", icon: Sun },
  midday: { label: "Midday", icon: Sunset },
  evening: { label: "Evening", icon: Moon },
} as const;

const CollectiveDashboard = () => {
  const { user, profile } = useAuth();
  const [rituals, setRituals] = useState<UserRitual[]>([]);
  const [todayLogs, setTodayLogs] = useState<RitualLog[]>([]);
  const [weekLogs, setWeekLogs] = useState<RitualLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const sessionId = user ? `ov-advisor-${user.id}` : "anon";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const fetchData = async () => {
    if (!user) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 6);

    const [ritualsRes, logsRes, weekLogsRes] = await Promise.all([
      supabase.from("user_rituals").select("*").eq("user_id", user.id),
      supabase.from("ritual_logs").select("*").eq("user_id", user.id).gte("logged_at", today.toISOString()),
      supabase.from("ritual_logs").select("*").eq("user_id", user.id).gte("logged_at", weekAgo.toISOString()),
    ]);

    if (ritualsRes.data) setRituals(ritualsRes.data as UserRitual[]);
    if (logsRes.data) setTodayLogs(logsRes.data);
    if (weekLogsRes.data) setWeekLogs(weekLogsRes.data);
    setLoading(false);
  };

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/advisor/history/${sessionId}`);
        if (res.ok) { const data = await res.json(); setMessages(data); }
      } catch (e) { /* silent */ }
    };
    loadHistory();
  }, [sessionId]);

  useEffect(() => { if (user) fetchData(); }, [user]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleCheckIn = async (productId: string, score: number) => {
    if (!user) return;
    setCheckingIn(productId);
    const { error } = await supabase.from("ritual_logs").insert({ user_id: user.id, product_id: productId, feeling_score: score });
    if (!error) { toast.success("Logged"); await fetchData(); }
    setCheckingIn(null);
  };

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const ritualNames = rituals.map(r => getProductById(r.product_id)?.name).filter(Boolean);
      const res = await fetch(`${BACKEND_URL}/api/advisor/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text, ritual_context: ritualNames.length > 0 ? `Active ritual: ${ritualNames.join(", ")}` : "No products yet." }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setChatLoading(false);
      inputRef.current?.focus();
    }
  };

  const isLoggedToday = (pid: string) => todayLogs.some(l => l.product_id === pid);
  const activeRituals = rituals.filter(r => !r.is_paused);
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0);
    const nd = new Date(d); nd.setDate(nd.getDate() + 1);
    return weekLogs.some(l => { const ld = new Date(l.logged_at); return ld >= d && ld < nd; });
  });
  const streakCount = [...streakDays].reverse().findIndex(d => !d);
  const streak = streakCount === -1 ? 7 : streakCount;
  const completion = activeRituals.length > 0 ? Math.round((todayLogs.length / activeRituals.length) * 100) || 0 : 0;

  // Group rituals by slot
  const grouped = {
    morning: activeRituals.filter(r => (r.schedule_slot || getProductById(r.product_id)?.schedule_slot) === "morning"),
    midday: activeRituals.filter(r => (r.schedule_slot || getProductById(r.product_id)?.schedule_slot) === "midday"),
    evening: activeRituals.filter(r => (r.schedule_slot || getProductById(r.product_id)?.schedule_slot) === "evening"),
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-1">Dashboard</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{greeting()}, {firstName}.</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeRituals.length > 0 ? `${activeRituals.length} active formula${activeRituals.length !== 1 ? "s" : ""}. ${completion}% complete today.` : "Add formulas to build your protocol."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Protocol tracking */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[{ val: streak, label: "Day Streak", cls: "text-foreground" }, { val: `${completion}%`, label: "Today", cls: "text-primary" }, { val: activeRituals.length, label: "Active", cls: "text-accent" }].map(s => (
              <div key={s.label} className="glass-card rounded-xl border border-border p-4 text-center">
                <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div className="glass-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Flame size={16} className="text-accent" /><span className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">7-Day Streak</span></div>
              <span className="text-lg font-bold text-foreground">{streak}<span className="text-xs font-normal text-muted-foreground ml-1">days</span></span>
            </div>
            <div className="flex gap-2">
              {streakDays.map((active, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-7 rounded-md transition-all ${active ? "bg-primary shadow-sm shadow-primary/20" : "bg-secondary/50 border border-border"}`} />
                  <span className="text-[9px] text-muted-foreground">{DAYS_OF_WEEK[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ritual stack */}
          {activeRituals.length === 0 ? (
            <div className="glass-card rounded-xl border border-border border-dashed p-10 text-center">
              <Sparkles size={24} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Your protocol is empty.</p>
              <Link to="/collective/protocol" className="inline-flex items-center gap-2 mt-3 text-xs font-medium text-primary hover:text-primary/80 tracking-[0.1em] uppercase">
                Add Formulas <ChevronRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {(["morning", "midday", "evening"] as const).map(slot => {
                const items = grouped[slot];
                if (items.length === 0) return null;
                const meta = slotMeta[slot];
                return (
                  <div key={slot}>
                    <div className="flex items-center gap-2 mb-2">
                      <meta.icon size={13} className="text-primary/70" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">{meta.label}</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(ritual => {
                        const product = getProductById(ritual.product_id);
                        if (!product) return null;
                        const logged = isLoggedToday(ritual.product_id);
                        const color = product.color_tag.primary;
                        return (
                          <div key={ritual.id} className={`glass-card rounded-xl border p-4 transition-all ${logged ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={logged ? { background: `${color}20` } : { background: "hsl(var(--secondary))", borderLeft: `3px solid ${color}` }}>
                                {logged ? <CheckCircle2 size={16} className="text-primary" /> : <Circle size={16} className="text-muted-foreground" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">{product.name}</p>
                                <p className="text-[10px] text-muted-foreground">{product.tagline}</p>
                              </div>
                              {logged ? (
                                <span className="text-[10px] text-primary font-medium flex items-center gap-1"><CheckCircle2 size={10} /> Done</span>
                              ) : (
                                <div className="flex gap-1">
                                  {[1,2,3,4,5].map(s => (
                                    <button key={s} onClick={() => handleCheckIn(ritual.product_id, s)} disabled={checkingIn === ritual.product_id}
                                      className="w-7 h-7 rounded-md bg-secondary/50 border border-border hover:border-primary hover:bg-primary/10 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-all flex items-center justify-center">
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: AI Advisor */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-xl border border-border overflow-hidden flex flex-col h-[600px] sticky top-6">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles size={14} className="text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">OV Ritual Advisor</p>
                <p className="text-[10px] text-muted-foreground">AI-powered protocol expert</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <MessageCircle size={24} className="text-primary/40 mb-3" />
                  <p className="text-xs text-muted-foreground mb-4">Ask about your protocol, products, or wellness goals.</p>
                  {["How should I optimize my morning stack?", "What pairs well with OV Bright?"].map((q, i) => (
                    <button key={i} onClick={() => { setChatInput(q); inputRef.current?.focus(); }}
                      className="w-full text-left text-[11px] text-muted-foreground px-3 py-2 rounded-lg bg-secondary/30 border border-border hover:border-primary/20 transition-all mb-2">{q}</button>
                  ))}
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5"><Bot size={12} className="text-accent-foreground" /></div>}
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center"><Bot size={12} className="text-accent-foreground" /></div>
                  <div className="bg-secondary px-3 py-2 rounded-xl rounded-bl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border flex items-center gap-2">
              <input ref={inputRef} type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Ask your advisor..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-3 py-2 rounded-lg bg-secondary/30 border border-border focus:border-primary/30 transition-colors"
                disabled={chatLoading} />
              <button onClick={sendChat} disabled={!chatInput.trim() || chatLoading}
                className="text-primary hover:text-primary/80 disabled:text-muted-foreground transition-colors p-2">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <VoiceAgent />
    </div>
  );
};

export default CollectiveDashboard;
