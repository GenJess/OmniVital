import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getProductBySlug, type Product } from "@/data/products";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShieldCheck, Leaf, FlaskConical, Check, Sun, Sunset, Moon } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const slotIcons: Record<string, typeof Sun> = {
  morning: Sun,
  midday: Sunset,
  evening: Moon,
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [addingToRitual, setAddingToRitual] = useState(false);
  const [alreadyInRitual, setAlreadyInRitual] = useState(false);
  const [saveMode, setSaveMode] = useState(false);

  const product = slug ? getProductBySlug(slug) : undefined;

  // Check if product is already in user's ritual
  useEffect(() => {
    if (!user || !product) return;
    const checkRitual = async () => {
      const { data } = await supabase
        .from("user_rituals")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();
      setAlreadyInRitual(!!data);
    };
    checkRitual();
  }, [user, product]);

  const handleAddToRitual = async () => {
    if (!user) {
      toast.info("Sign in to add products to your ritual.");
      return;
    }
    if (!product) return;
    setAddingToRitual(true);

    const { error } = await supabase.from("user_rituals").insert({
      user_id: user.id,
      product_id: product.id,
      schedule_slot: product.schedule_slot,
    });

    if (error) {
      if (error.code === "23505") {
        toast.info("Already in your ritual.");
        setAlreadyInRitual(true);
      } else {
        toast.error("Failed to add to ritual.");
      }
    } else {
      toast.success(`${product.name} added to your ritual`);
      setAlreadyInRitual(true);
    }
    setAddingToRitual(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/" className="text-sm text-primary hover:underline">&larr; Back to rituals</Link>
      </div>
    );
  }

  const colorPrimary = product.color_tag.primary;
  const colorSecondary = product.color_tag.secondary;
  const SlotIcon = slotIcons[product.schedule_slot] || Sun;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-24">
        {/* Back link */}
        <div className="container mx-auto px-6 py-4">
          <Link
            to="/#ritual"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            data-testid="pdp-back-link"
          >
            <ArrowLeft size={14} />
            Back to Rituals
          </Link>
        </div>

        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-card border border-border"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay with product color */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${colorPrimary}15, transparent 50%)`,
                }}
              />
            </motion.div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center py-4"
            >
              {/* Category + schedule */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase font-medium px-3 py-1 rounded-full border"
                  style={{
                    color: colorPrimary,
                    borderColor: `${colorPrimary}40`,
                    background: `${colorPrimary}10`,
                  }}
                >
                  {product.category}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  <SlotIcon size={12} />
                  {product.schedule_slot}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground font-light text-base md:text-lg mb-4">
                {product.tagline}
              </p>

              {/* Hero ingredient */}
              <p className="text-xs text-muted-foreground/60 tracking-[0.15em] uppercase mb-4">
                Hero Ingredient:{" "}
                <span className="text-foreground font-medium">{product.hero_ingredient}</span>
              </p>

              <p className="text-3xl font-bold text-foreground mb-1">
                ${(product.price / 30).toFixed(2)}
                <span className="text-sm text-muted-foreground font-normal ml-1.5">/ daily ritual</span>
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                {saveMode ? (
                  <>
                    <span className="line-through opacity-50">${product.price}/mo</span>
                    <span className="text-accent font-semibold ml-1.5">${(product.price * 0.8).toFixed(0)}/mo with 20% off</span>
                  </>
                ) : (
                  <>${product.price}/mo billed monthly</>
                )}
              </p>

              {/* Subscribe & Save toggle */}
              <button
                onClick={() => setSaveMode(!saveMode)}
                className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 mb-4 ${
                  saveMode
                    ? "bg-accent/10 text-accent border border-accent/30"
                    : "bg-secondary/50 text-muted-foreground border border-border hover:border-primary/20"
                }`}
                data-testid="pdp-subscribe-save-toggle"
              >
                <span>Subscribe & Save 20%</span>
                <div className={`relative w-8 h-4 rounded-full transition-all duration-300 ${saveMode ? "bg-accent" : "bg-secondary"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${saveMode ? "left-[calc(100%-0.875rem)]" : "left-0.5"}`} />
                </div>
              </button>

              {/* Dosage */}
              <p className="text-xs text-muted-foreground mb-6">{product.dosage_text}</p>

              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Benefits */}
              <div className="space-y-2.5 mb-8">
                {product.benefit_bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${colorPrimary}15`, border: `1px solid ${colorPrimary}30` }}
                    >
                      <Check size={10} style={{ color: colorPrimary }} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>

              {/* Add to Ritual CTA */}
              <button
                onClick={handleAddToRitual}
                disabled={addingToRitual || alreadyInRitual}
                className="w-full px-10 py-4 font-semibold tracking-widest uppercase text-sm rounded-lg transition-all duration-300 mb-6 disabled:opacity-60"
                style={{
                  background: alreadyInRitual
                    ? "hsl(var(--secondary))"
                    : `linear-gradient(135deg, ${colorPrimary}, ${colorSecondary})`,
                  color: alreadyInRitual ? "hsl(var(--muted-foreground))" : "white",
                  boxShadow: alreadyInRitual ? "none" : `0 4px 24px -6px ${colorPrimary}55`,
                }}
              >
                {alreadyInRitual ? "In Your Ritual" : addingToRitual ? "Adding..." : "Add to Ritual"}
              </button>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: FlaskConical, label: "Clinically Dosed" },
                  { icon: ShieldCheck, label: "3rd-Party Tested" },
                  { icon: Leaf, label: "Clean Sourced" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <badge.icon size={14} className="text-primary/70" />
                    {badge.label}
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="bio" className="w-full">
                <TabsList className="w-full bg-secondary rounded-lg p-1 h-auto">
                  <TabsTrigger
                    value="bio"
                    className="flex-1 rounded-md text-[11px] tracking-[0.12em] uppercase py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Bio-Availability
                  </TabsTrigger>
                  <TabsTrigger
                    value="sourcing"
                    className="flex-1 rounded-md text-[11px] tracking-[0.12em] uppercase py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Sourcing
                  </TabsTrigger>
                  <TabsTrigger
                    value="ritual"
                    className="flex-1 rounded-md text-[11px] tracking-[0.12em] uppercase py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Daily Ritual
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="bio" className="pt-5 text-sm text-muted-foreground leading-relaxed">
                  {product.bio_availability_text}
                </TabsContent>
                <TabsContent value="sourcing" className="pt-5 text-sm text-muted-foreground leading-relaxed">
                  {product.sourcing_text}
                </TabsContent>
                <TabsContent value="ritual" className="pt-5 text-sm text-muted-foreground leading-relaxed">
                  {product.daily_ritual_text}
                </TabsContent>
              </Tabs>

              {/* Directions */}
              <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium mb-2">
                  Directions
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.directions_text}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
