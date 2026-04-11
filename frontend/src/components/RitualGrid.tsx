import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Sunset, Moon, ArrowRight } from "lucide-react";
import { PRODUCTS, getProductsBySlot, type Product } from "@/data/products";

const slotMeta = {
  morning: { label: "Morning", icon: Sun, description: "Start your day with intent." },
  midday: { label: "Midday", icon: Sunset, description: "Sustain focus and balance." },
  evening: { label: "Evening", icon: Moon, description: "Recover, restore, rebuild." },
} as const;

const ProductCard = ({
  product,
  delay,
  saveMode,
}: {
  product: Product;
  delay: number;
  saveMode: boolean;
}) => {
  const color = product.color_tag.primary;
  const colorSecondary = product.color_tag.secondary;
  const dailyPrice = (product.price / 30).toFixed(2);
  const savedPrice = (product.price * 0.8).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block relative overflow-hidden rounded-2xl h-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl hover:border-white/[0.12] transition-all duration-500 hover:shadow-2xl"
        style={{
          boxShadow: `0 0 80px -30px ${color}12, 0 0 0 1px ${color}08`,
        }}
      >
        {/* Color glow accent */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-[0.07] blur-3xl pointer-events-none group-hover:opacity-[0.12] transition-opacity duration-700"
          style={{ background: color }}
        />

        {/* Product image — capped height on tablet, 1:1 on mobile/desktop */}
        <div className="relative aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 right-4 text-[9px] tracking-[0.2em] uppercase text-white/70 px-3 py-1 rounded-full backdrop-blur-md bg-white/[0.06] border border-white/[0.08]">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 -mt-8">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-3">
            {product.tagline}
          </p>

          {/* Hero ingredient */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[8px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full border"
              style={{
                color,
                borderColor: `${color}35`,
                background: `${color}08`,
              }}
            >
              {product.hero_ingredient}
            </span>
          </div>

          {/* Pricing — daily ritual focus */}
          <div className="mb-4">
            <p className="text-2xl font-bold text-foreground tracking-tight">
              ${dailyPrice}
              <span className="text-xs font-normal text-muted-foreground ml-1.5">
                / daily ritual
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {saveMode ? (
                <>
                  <span className="line-through opacity-50">${product.price}/mo</span>
                  <span className="text-accent font-semibold ml-1.5">
                    ${savedPrice}/mo with 20% off
                  </span>
                </>
              ) : (
                <>${product.price}/mo billed monthly</>
              )}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-primary group-hover:gap-3 transition-all duration-300">
            Explore Formula
            <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const RitualGrid = () => {
  const [saveMode, setSaveMode] = useState(false);

  return (
    <section id="ritual" className="py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
            The Ritual
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Your Daily Protocol
          </h2>
          <p className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed mb-8">
            Six precision formulas, three daily windows. Build the stack that fits your life.
          </p>

          {/* Subscribe & Save toggle */}
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-xs font-medium transition-colors ${
                !saveMode ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setSaveMode(!saveMode)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                saveMode
                  ? "bg-accent shadow-[0_0_12px_-2px] shadow-accent/40"
                  : "bg-secondary border border-border"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  saveMode ? "left-[calc(100%-1.375rem)]" : "left-0.5"
                }`}
              />
            </button>
            <span
              className={`text-xs font-medium transition-colors ${
                saveMode ? "text-accent" : "text-muted-foreground"
              }`}
            >
              Subscribe & Save 20%
            </span>
          </div>
        </motion.div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {(["morning", "midday", "evening"] as const).map((slot) => {
            const meta = slotMeta[slot];
            const slotProducts = getProductsBySlot(slot);

            return (
              <div key={slot}>
                {/* Slot header */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <meta.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-foreground">
                      {meta.label}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light">
                      {meta.description}
                    </p>
                  </div>
                </motion.div>

                {/* Product cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {slotProducts.map((product, i) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      delay={i * 0.08}
                      saveMode={saveMode}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RitualGrid;
