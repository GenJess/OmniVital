import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, getProductById, type Product } from "@/data/products";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CreditCard,
  Trash2,
  Plus,
  Minus,
  Package,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "quarterly">("monthly");

  // Load user's ritual stack as cart
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchCart = async () => {
      const { data } = await supabase
        .from("user_rituals")
        .select("product_id")
        .eq("user_id", user.id)
        .eq("is_paused", false);

      if (data) {
        const items: CartItem[] = data
          .map((r: { product_id: string }) => {
            const product = getProductById(r.product_id);
            return product ? { product, quantity: 1 } : null;
          })
          .filter(Boolean) as CartItem[];
        setCartItems(items);
      }
      setLoading(false);
    };
    fetchCart();
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = billingInterval === "quarterly" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    toast.info("Stripe checkout will be connected here. Your ritual stack is ready!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="py-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Your Ritual Subscription
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your ritual stack and start your subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Billing toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <button
                  onClick={() => setBillingInterval("monthly")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-[0.1em] uppercase transition-all ${
                    billingInterval === "monthly"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval("quarterly")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-[0.1em] uppercase transition-all relative ${
                    billingInterval === "quarterly"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Quarterly
                  <span className="absolute -top-2 right-2 text-[8px] font-black tracking-wider text-accent bg-accent/20 px-1.5 py-0.5 rounded-full">
                    -10%
                  </span>
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="rounded-2xl border border-border border-dashed p-12 text-center">
                  <Package size={32} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Your ritual is empty.</p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Add products to your ritual from the product pages.
                  </p>
                  <Link
                    to="/"
                    className="text-xs font-medium text-primary hover:text-primary/80 tracking-[0.1em] uppercase"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                cartItems.map((item, i) => {
                  const colorPrimary = item.product.color_tag.primary;
                  return (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-xl border border-border bg-card p-5 flex items-center gap-5"
                    >
                      <div
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary"
                      >
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: colorPrimary }}
                          />
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {item.product.name}
                          </h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                          {item.product.schedule_slot} \u00b7 {item.product.dosage_text}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">
                          ${item.product.price.toFixed(2)}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            /{billingInterval === "monthly" ? "mo" : "qtr"}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  );
                })
              )}

              {cartItems.length > 0 && (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 tracking-[0.1em] uppercase mt-2"
                >
                  <Plus size={12} /> Add more products
                </Link>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-5">
                <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Quarterly discount (-10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span>
                      ${total.toFixed(2)}
                      <span className="text-xs font-normal text-muted-foreground">
                        /{billingInterval === "monthly" ? "mo" : "qtr"}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full py-4 rounded-lg text-sm font-semibold tracking-widest uppercase transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, hsl(168,76%,42%), hsl(168,76%,36%))",
                    color: "white",
                    boxShadow: cartItems.length > 0 ? "0 4px 20px -6px hsla(168,76%,42%,0.4)" : "none",
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard size={16} />
                    {cartItems.length > 0 ? "Subscribe Now" : "Add Products First"}
                  </span>
                </button>

                <p className="text-[10px] text-center text-muted-foreground/50">
                  Stripe checkout will be connected here.
                </p>

                {/* Trust badges */}
                <div className="space-y-2 pt-3 border-t border-border">
                  {[
                    { icon: Lock, text: "Secure 256-bit SSL encryption" },
                    { icon: ShieldCheck, text: "Cancel or pause anytime" },
                    { icon: Package, text: "Free shipping on all orders" },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <badge.icon size={12} className="text-primary/60 flex-shrink-0" />
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
