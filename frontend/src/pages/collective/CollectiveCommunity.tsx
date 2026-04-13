import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, getProductById } from "@/data/products";
import {
  Users, Lock, Shield, Palette, MessageSquare, Heart, Zap, Moon, Brain, Target,
  TrendingUp, EyeOff, ArrowRight, Send, X, Plus, ChevronLeft, Loader2,
} from "lucide-react";
import { toast } from "sonner";

const COLOR_TAGS = [
  { name: "Teal Focus", color: "#0D9488", description: "Energy & cognitive performance", icon: Zap },
  { name: "Gold Resilience", color: "#F59E0B", description: "Stress adaptation & endurance", icon: Shield },
  { name: "Rose Balance", color: "#F472B6", description: "Mood stability & emotional wellness", icon: Heart },
  { name: "Indigo Depth", color: "#818CF8", description: "Deep focus & creative flow", icon: Brain },
  { name: "Violet Recovery", color: "#7C3AED", description: "Sleep quality & neural repair", icon: Moon },
  { name: "Red Executive", color: "#DC2626", description: "High-pressure performance", icon: Target },
];

interface Thread {
  id: string;
  author_id: string;
  title: string;
  body: string;
  color_tag: string;
  color_hex: string;
  product_tags: string[];
  reply_count: number;
  like_count: number;
  pinned: boolean;
  is_team_post: boolean;
  created_at: string;
  // local state
  userLiked?: boolean;
  authorInitials?: string;
}

interface Reply {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  like_count: number;
  created_at: string;
  authorInitials?: string;
  userLiked?: boolean;
}

const getInitials = (id: string) =>
  id.substring(0, 2).toUpperCase();

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const CollectiveCommunity = () => {
  const { user, profile } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [showNewThread, setShowNewThread] = useState(false);
  const [likedThreadIds, setLikedThreadIds] = useState<Set<string>>(new Set());

  // New thread form
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newColorTag, setNewColorTag] = useState(COLOR_TAGS[0]);
  const [submitting, setSubmitting] = useState(false);

  // Reply input
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // User's color tag — derived from their ritual stack
  const userColorTag = (() => {
    if (profile?.avatar_color) {
      return COLOR_TAGS.find(t => t.color === profile.avatar_color) || COLOR_TAGS[0];
    }
    return COLOR_TAGS[0];
  })();

  const fetchThreads = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("ov_community_threads")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) { toast.error("Failed to load threads"); return; }

    // Fetch user's likes
    const { data: likesData } = await supabase
      .from("ov_community_likes")
      .select("thread_id")
      .eq("user_id", user.id)
      .not("thread_id", "is", null);

    const likedIds = new Set((likesData || []).map(l => l.thread_id as string));
    setLikedThreadIds(likedIds);

    setThreads((data || []).map(t => ({
      ...t,
      product_tags: t.product_tags || [],
      userLiked: likedIds.has(t.id),
      authorInitials: t.is_team_post ? "OV" : getInitials(t.author_id),
    })));
    setLoading(false);
  };

  const fetchReplies = async (threadId: string) => {
    setRepliesLoading(true);
    const { data } = await supabase
      .from("ov_community_replies")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    const { data: likedReplies } = await supabase
      .from("ov_community_likes")
      .select("reply_id")
      .eq("user_id", user!.id)
      .not("reply_id", "is", null);

    const likedReplyIds = new Set((likedReplies || []).map(l => l.reply_id as string));

    setReplies((data || []).map(r => ({
      ...r,
      authorInitials: getInitials(r.author_id),
      userLiked: likedReplyIds.has(r.id),
    })));
    setRepliesLoading(false);
  };

  useEffect(() => { fetchThreads(); }, [user]);

  // Realtime subscription for new replies
  useEffect(() => {
    if (!selectedThread) return;
    const channel = supabase
      .channel(`replies:${selectedThread.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "ov_community_replies",
        filter: `thread_id=eq.${selectedThread.id}`,
      }, payload => {
        const r = payload.new as Reply;
        setReplies(prev => [...prev, {
          ...r,
          authorInitials: getInitials(r.author_id),
          userLiked: false,
        }]);
        setSelectedThread(prev => prev ? { ...prev, reply_count: prev.reply_count + 1 } : prev);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedThread?.id]);

  const openThread = (thread: Thread) => {
    setSelectedThread(thread);
    fetchReplies(thread.id);
  };

  const closeThread = () => {
    setSelectedThread(null);
    setReplies([]);
    setReplyText("");
  };

  const toggleThreadLike = async (thread: Thread) => {
    if (!user) return;
    if (thread.userLiked) {
      await supabase.from("ov_community_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("thread_id", thread.id);
      setThreads(prev => prev.map(t => t.id === thread.id
        ? { ...t, like_count: Math.max(0, t.like_count - 1), userLiked: false }
        : t));
      if (selectedThread?.id === thread.id) {
        setSelectedThread(prev => prev ? { ...prev, like_count: Math.max(0, prev.like_count - 1), userLiked: false } : prev);
      }
    } else {
      await supabase.from("ov_community_likes")
        .insert({ user_id: user.id, thread_id: thread.id });
      setThreads(prev => prev.map(t => t.id === thread.id
        ? { ...t, like_count: t.like_count + 1, userLiked: true }
        : t));
      if (selectedThread?.id === thread.id) {
        setSelectedThread(prev => prev ? { ...prev, like_count: prev.like_count + 1, userLiked: true } : prev);
      }
    }
  };

  const sendReply = async () => {
    const text = replyText.trim();
    if (!text || !selectedThread || !user || sendingReply) return;
    setSendingReply(true);
    const { error } = await supabase.from("ov_community_replies").insert({
      thread_id: selectedThread.id,
      author_id: user.id,
      body: text,
    });
    if (!error) {
      setReplyText("");
    } else {
      toast.error("Failed to post reply");
    }
    setSendingReply(false);
  };

  const createThread = async () => {
    const title = newTitle.trim();
    const body = newBody.trim();
    if (!title || !body || !user || submitting) return;
    setSubmitting(true);
    const { data, error } = await supabase.from("ov_community_threads").insert({
      author_id: user.id,
      title,
      body,
      color_tag: newColorTag.name,
      color_hex: newColorTag.color,
      product_tags: [],
    }).select().single();

    if (error) {
      toast.error("Failed to create thread");
    } else if (data) {
      toast.success("Thread posted");
      setShowNewThread(false);
      setNewTitle("");
      setNewBody("");
      await fetchThreads();
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-1">The Collective</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Your People. <span className="text-gradient">Your Privacy.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg">
          Connect with members pursuing similar wellness goals. No follower counts. Real conversations.
        </p>
        <div className="flex items-center gap-5 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Lock size={13} className="text-primary" /> Privacy-first</span>
          <span className="flex items-center gap-1.5"><Palette size={13} className="text-accent" /> Color-matched</span>
          <span className="flex items-center gap-1.5"><Shield size={13} className="text-primary" /> No personal data shared</span>
        </div>
      </motion.div>

      {/* Color Tags */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette size={16} className="text-accent" />
          <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">Wellness Colors</h2>
          <span className="ml-auto text-[10px] text-muted-foreground">Your badge:
            <span className="ml-1 font-semibold" style={{ color: userColorTag.color }}>{userColorTag.name}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {COLOR_TAGS.map((tag, i) => (
            <motion.div key={tag.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`group relative p-3 rounded-xl border text-left transition-all duration-200 ${
                userColorTag.name === tag.name
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card/50"
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tag.color, boxShadow: `0 0 8px ${tag.color}40` }} />
                <span className="text-[11px] font-semibold text-foreground">{tag.name}</span>
                {userColorTag.name === tag.name && (
                  <span className="ml-auto text-[8px] tracking-[0.1em] uppercase font-bold px-1.5 py-0.5 rounded-full border"
                    style={{ color: tag.color, borderColor: `${tag.color}40`, background: `${tag.color}10` }}>You</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">{tag.description}</p>
              <tag.icon size={12} className="absolute top-3 right-3 text-muted-foreground/20" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Threads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">
              Conversations
              <span className="ml-2 text-muted-foreground font-normal">{threads.length}</span>
            </h2>
          </div>
          <button onClick={() => setShowNewThread(true)}
            className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all">
            <Plus size={11} /> New Thread
          </button>
        </div>

        {threads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <MessageSquare size={20} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No threads yet. Start the conversation.</p>
            <button onClick={() => setShowNewThread(true)}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 mx-auto">
              <Plus size={12} /> Post the first thread
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map((thread, i) => (
              <motion.div key={thread.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => openThread(thread)}
                className="group rounded-xl border border-border bg-card/50 hover:border-primary/20 transition-all p-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={thread.is_team_post
                      ? { background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(42,80%,55%))", color: "white" }
                      : { background: `${thread.color_hex}18`, color: thread.color_hex }}>
                    {thread.authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] tracking-[0.1em] uppercase font-semibold px-1.5 py-0.5 rounded-full border"
                        style={{ color: thread.color_hex, borderColor: `${thread.color_hex}40`, background: `${thread.color_hex}10` }}>
                        {thread.color_tag}
                      </span>
                      {thread.pinned && (
                        <span className="text-[9px] tracking-[0.1em] uppercase font-bold text-accent px-1.5 py-0.5 rounded-full border border-accent/30 bg-accent/10">
                          Pinned
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(thread.created_at)}</span>
                    </div>
                    <h3 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors mb-0.5 truncate">
                      {thread.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{thread.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MessageSquare size={10} /> {thread.reply_count}
                      </span>
                      <button onClick={e => { e.stopPropagation(); toggleThreadLike(thread); }}
                        className={`text-[10px] flex items-center gap-1 transition-colors ${thread.userLiked ? "text-accent" : "text-muted-foreground hover:text-accent"}`}>
                        <Heart size={10} fill={thread.userLiked ? "currentColor" : "none"} /> {thread.like_count}
                      </button>
                      {thread.product_tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[8px] tracking-[0.1em] uppercase text-muted-foreground/50 px-1.5 py-0.5 rounded-full bg-secondary/40 ml-auto first:ml-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Thread detail panel */}
      <AnimatePresence>
        {selectedThread && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed inset-0 z-50 flex items-stretch justify-end"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeThread} />
            <div className="relative w-full max-w-xl bg-background border-l border-border flex flex-col shadow-2xl h-full overflow-hidden">
              {/* Thread header */}
              <div className="p-5 border-b border-border flex-shrink-0">
                <div className="flex items-start gap-3">
                  <button onClick={closeThread}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all flex-shrink-0 mt-0.5">
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] tracking-[0.1em] uppercase font-semibold px-1.5 py-0.5 rounded-full border"
                        style={{ color: selectedThread.color_hex, borderColor: `${selectedThread.color_hex}40`, background: `${selectedThread.color_hex}10` }}>
                        {selectedThread.color_tag}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(selectedThread.created_at)}</span>
                    </div>
                    <h2 className="text-[15px] font-bold text-foreground leading-tight">{selectedThread.title}</h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed ml-10">{selectedThread.body}</p>
                <div className="flex items-center gap-4 mt-3 ml-10">
                  <button onClick={() => toggleThreadLike(selectedThread)}
                    className={`text-xs flex items-center gap-1.5 transition-colors ${selectedThread.userLiked ? "text-accent" : "text-muted-foreground hover:text-accent"}`}>
                    <Heart size={13} fill={selectedThread.userLiked ? "currentColor" : "none"} />
                    {selectedThread.like_count} {selectedThread.userLiked ? "Liked" : "Like"}
                  </button>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare size={13} /> {selectedThread.reply_count} replies
                  </span>
                </div>
              </div>

              {/* Replies */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {repliesLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 size={18} className="text-muted-foreground animate-spin" />
                  </div>
                ) : replies.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xs text-muted-foreground">No replies yet. Start the conversation.</p>
                  </div>
                ) : (
                  replies.map((reply, i) => (
                    <motion.div key={reply.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                        style={{ background: "hsl(var(--secondary))", color: "hsl(var(--foreground))" }}>
                        {reply.authorInitials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-foreground">Member</span>
                          <span className="text-[10px] text-muted-foreground">{timeAgo(reply.created_at)}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{reply.body}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-border flex-shrink-0">
                <div className="flex items-end gap-2">
                  <div className="flex-1 rounded-xl border border-border bg-secondary/30 px-3 py-2">
                    <textarea
                      ref={replyRef}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
                    />
                  </div>
                  <button onClick={sendReply} disabled={!replyText.trim() || sendingReply}
                    className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-all flex-shrink-0">
                    {sendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showNewThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowNewThread(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${newColorTag.color}, ${newColorTag.color}88)` }} />
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground">New Thread</h2>
                  <button onClick={() => setShowNewThread(false)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                </div>

                {/* Color tag picker */}
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Your wellness color</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_TAGS.map(tag => (
                      <button key={tag.name} onClick={() => setNewColorTag(tag)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                          newColorTag.name === tag.name
                            ? "border-current shadow-sm"
                            : "border-transparent bg-secondary/30"
                        }`}
                        style={newColorTag.name === tag.name
                          ? { color: tag.color, borderColor: `${tag.color}60`, background: `${tag.color}12` }
                          : { color: "hsl(var(--muted-foreground))" }}>
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Title</p>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="What's on your mind?"
                    maxLength={120}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>

                {/* Body */}
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Share your experience</p>
                  <textarea
                    value={newBody}
                    onChange={e => setNewBody(e.target.value)}
                    placeholder="Share your protocol insights, questions, or results..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <button onClick={() => setShowNewThread(false)}
                    className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border transition-all">
                    Cancel
                  </button>
                  <button onClick={createThread}
                    disabled={!newTitle.trim() || !newBody.trim() || submitting}
                    className="px-5 py-2 rounded-lg text-xs font-semibold tracking-[0.1em] uppercase transition-all disabled:opacity-40"
                    style={{
                      background: `linear-gradient(135deg, ${newColorTag.color}, ${newColorTag.color}cc)`,
                      color: "white",
                      boxShadow: `0 4px 16px -4px ${newColorTag.color}50`,
                    }}>
                    {submitting ? "Posting..." : "Post Thread"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectiveCommunity;
