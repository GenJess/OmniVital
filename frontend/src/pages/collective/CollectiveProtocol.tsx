import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, getProductById, getProductsBySlot, type Product } from "@/data/products";
import {
  Sun, Sunset, Moon, Plus, Check, Minus, FlaskConical, ShieldCheck, Leaf, Pause, Play,
  CreditCard, Lock, Package, Trash2, ChevronRight, CheckCircle2, Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface UserRitual {
  id: string;
  product_id: string;
  schedule_slot: string | null;
  is_paused: boolean;
  display_order: number;
}

interface Order {
  id: string;
  status: string;
  billing_interval: string;
  product_ids: string[];
  total: number;
  created_at: string;
}

const slotMeta = {
  morning: { label: "Morning", icon: Sun, desc: "Start with intent" },
  midday: { label: "Midday", icon: Sunset, desc: "Sustain & balance" },
  evening: { label: "Evening", icon: Moon, desc: "Recover & restore" },
} as const;

const CollectiveProtocol = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rituals, setRituals] = useState<UserRitual[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "quarterly">("monthly");
  const [saveToggle, setSaveToggle] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const [ritualsRes, ordersRes] = await Promise.all([
      supabase.from("ov_user_rituals").select("*").eq("user_id", user.id).order("display_order"),
      supabase.from("ov_orders").select("*").eq("user_id", user.id).eq("status", "active").limit(1).single(),
    ]);
    if (ritualsRes.data) setRituals(ritualsRes.data as UserRitual[]);
    if (ordersRes.data) setActiveOrder(ordersRes.data as Order);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const isInRitual = (pid: string) => rituals.some(r => r.product_id === pid);
  const activeRituals = rituals.filter(r => !r.is_paused);

  const addToRitual = async (product: Product) => {
    if (!user) return;
    setAdding(product.id);
    const nextOrder = rituals.filter(r => r.schedule_slot === product.schedule_slot).length;
    const { error } = await supabase.from("ov_user_rituals").insert({
      user_id: user.id,
      product_id: product.id,
      schedule_slot: product.schedule_slot,
      display_order: nextOrder,
    });
    if (error?.code === "23505") { toast.info("Already in your protocol."); }
    else if (error) { toast.error("Failed to add."); }
    else { toast.success(`${product.name} added to protocol`); await fetchData(); }
    setAdding(null);
  };

  const removeFromRitual = async (productId: string) => {
    const ritual = rituals.find(r => r.product_id === productId);
    if (!ritual) return;
    const { error } = await supabase.from("ov_user_rituals").delete().eq("id", ritual.id);
    if (!error) {
      setRituals(prev => prev.filter(r => r.id !== ritual.id));
      toast.success("Removed from protocol");
    }
  };

  const togglePause = async (productId: string) => {
    const ritual = rituals.find(r => r.product_id === productId);
    if (!ritual) return;
    const { error } = await supabase.from("ov_user_rituals").update({ is_paused: !ritual.is_paused }).eq("id", ritual.id);
    if (!error) {
      setRituals(prev => prev.map(r => r.id === ritual.id ? { ...r, is_paused: !r.is_paused } : r));
    }
  };

  const handleSubscribe = async () => {
    if (!user || activeRituals.length === 0) return;
    setSubscribing(true);

    // If active order exists, update it; otherwise create new
    const productIds = activeRituals.map(r => r.product_id);
    const subtotal = activeRituals.reduce((sum, r) => sum + (getProductById(r.product_id)?.price || 0), 0);
    const discountPct = saveToggle ? 20 : 0;
    const total = subtotal * (1 - discountPct / 100);

    try {
      if (activeOrder) {
        // Update existing order
        const { error } = await supabase.from("ov_orders").update({
          product_ids: productIds,
          billing_interval: saveToggle ? "quarterly" : "monthly",
          subtotal,
          discount_pct: discountPct,
          total,
        }).eq("id", activeOrder.id);
        if (error) throw error;
        toast.success("Protocol subscription updated");
      } else {
        // Create new order
        const { error } = await supabase.from("ov_orders").insert({
          user_id: user.id,
          status: "active",
          billing_interval: saveToggle ? "quarterly" : "monthly",
          product_ids: productIds,
          subtotal,
          discount_pct: discountPct,
          total,
          notes: "Pending Stripe integration",
        });
        if (error) throw error;
        toast.success("Protocol subscribed! Stripe checkout coming soon.");
      }
      await fetchData();
      // Navigate to dashboard to see the active protocol
      setTimeout(() => navigate("/collective"), 1200);
    } catch (e) {
      toast.error("Failed to save subscription");
    } finally {
      setSubscribing(false);
    }
  };

  const subtotal = activeRituals.reduce((sum, r) => sum + (getProductById(r.product_id)?.price || 0), 0);
  const discount = saveToggle ? subtotal * 0.2 : 0;
  const total = subtotal - discount;

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs tracking-[0.3em] uppercase text-primary font-medium mb-1">My Protocol</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Build Your Daily Ritual</h1>
        <p className="text-sm text-muted-foreground mt-1">Six precision formulas. Choose what fits your goals.</p>
        {activeOrder && (
          <div className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
            <CheckCircle2 size={12} />
            Active subscription · {activeOrder.billing_interval} · ${activeOrder.total.toFixed(2)}/mo
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product catalog */}
        <div className="lg:col-span-2 space-y-8">
          {(["morning", "midday", "evening"] as const).map(slot => {
            const meta = slotMeta[slot];
            const products = getProductsBySlot(slot);
            return (
              <div key={slot}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <meta.icon size={14} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">{meta.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{meta.desc}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product, i) => {
                    const inRitual = isInRitual(product.id);
                    const ritual = rituals.find(r => r.product_id === product.id);
                    const isPaused = ritual?.is_paused || false;
                    const color = product.color_tag.primary;
                    const dailyPrice = (product.price / 30).toFixed(2);

                    return (
                      <motion.div key={product.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="group relative rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-all">
                        {/* Color glow */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                          style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />

                        {/* Image */}
                        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden">
                          <img src={product.image_url} alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                          <div className="absolute top-3 right-3 text-[9px] tracking-[0.15em] uppercase text-muted-foreground px-2 py-0.5 rounded-full backdrop-blur-md bg-background/40 border border-border/50">
                            {product.category}
                          </div>
                          {inRitual && (
                            <div className="absolute top-3 left-3 text-[9px] tracking-[0.1em] uppercase font-bold text-primary px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-md">
                              {isPaused ? "Paused" : "In Protocol"}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-1">
                            <Link to={`/product/${product.slug}`}
                              className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              {product.name}
                            </Link>
                          </div>
                          <p className="text-[11px] text-muted-foreground mb-2">{product.tagline}</p>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] tracking-[0.1em] uppercase font-medium px-2 py-0.5 rounded-full border"
                              style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                              {product.hero_ingredient}
                            </span>
                          </div>

                          {/* Pricing */}
                          <div className="mb-3">
                            <p className="text-lg font-bold text-foreground">
                              ${dailyPrice}<span className="text-xs font-normal text-muted-foreground ml-1">/ daily ritual</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              ${product.price}/mo
                              {saveToggle && (
                                <span className="text-accent ml-1">
                                  (${(product.price * 0.8).toFixed(0)}/mo with 20% off)
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Action buttons */}
                          {inRitual ? (
                            <div className="flex gap-2">
                              <button onClick={() => togglePause(product.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold tracking-[0.1em] uppercase border border-border bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                                {isPaused ? <><Play size={10} /> Resume</> : <><Pause size={10} /> Pause</>}
                              </button>
                              <button onClick={() => removeFromRitual(product.id)}
                                className="flex items-center justify-center px-3 py-2 rounded-lg text-[10px] font-semibold border border-border bg-secondary/50 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all">
                                <Trash2 size={10} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => addToRitual(product)} disabled={adding === product.id}
                              className="w-full py-2.5 rounded-lg text-[10px] font-semibold tracking-[0.15em] uppercase transition-all disabled:opacity-50"
                              style={{
                                background: `linear-gradient(135deg, ${color}, ${product.color_tag.secondary})`,
                                color: "white",
                                boxShadow: `0 4px 16px -4px ${color}40`,
                              }}>
                              {adding === product.id ? "Adding..." : "Add to Protocol"}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-4">
            <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground">Your Protocol</h2>

            {activeRituals.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Add formulas to build your protocol.
              </p>
            ) : (
              <div className="space-y-2">
                {activeRituals.map(r => {
                  const p = getProductById(r.product_id);
                  if (!p) return null;
                  return (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color_tag.primary }} />
                        <span className="text-xs text-foreground">{p.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">${p.price}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Subscribe & Save toggle */}
            <button onClick={() => setSaveToggle(!saveToggle)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                saveToggle
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}>
              <span>Subscribe & Save 20%</span>
              <div className={`w-8 h-4.5 rounded-full transition-all relative ${saveToggle ? "bg-accent" : "bg-secondary"}`}>
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all shadow-sm ${saveToggle ? "left-[calc(100%-1rem)]" : "left-0.5"}`} />
              </div>
            </button>

            {/* Totals */}
            <div className="space-y-2 pt-2 border-t border-border text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({activeRituals.length})</span>
                <span>${subtotal.toFixed(2)}/mo</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Save 20%</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}/mo</span>
              </div>
            </div>

            <button
              disabled={activeRituals.length === 0 || subscribing}
              onClick={handleSubscribe}
              className="w-full py-3 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                background: activeRituals.length > 0
                  ? "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))"
                  : "hsl(var(--secondary))",
                color: activeRituals.length > 0 ? "white" : "hsl(var(--muted-foreground))",
                boxShadow: activeRituals.length > 0 ? "0 4px 20px -6px hsla(168,76%,42%,0.4)" : "none",
              }}>
              {subscribing
                ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                : <><CreditCard size={14} /> {activeOrder ? "Update Subscription" : "Subscribe Now"}</>}
            </button>

            {activeOrder ? (
              <p className="text-[10px] text-center text-primary/60">
                Your protocol is active. Stripe billing will be connected soon.
              </p>
            ) : (
              <p className="text-[10px] text-center text-muted-foreground/40">
                Secures your formula stack · Stripe billing coming soon
              </p>
            )}

            <div className="space-y-1.5 pt-2 border-t border-border">
              {[
                { icon: Lock, text: "Secure 256-bit SSL" },
                { icon: ShieldCheck, text: "Cancel or pause anytime" },
                { icon: Package, text: "Free shipping always" },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <b.icon size={11} className="text-primary/50" />{b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectiveProtocol;
