import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Sunset, Moon } from "lucide-react";
import { PRODUCTS, getProductsBySlot, type Product } from "@/data/products";

const slotMeta = {
  morning: { label: "Morning", icon: Sun, description: "Start your day with intent." },
  midday: { label: "Midday", icon: Sunset, description: "Sustain focus and balance." },
  evening: { label: "Evening", icon: Moon, description: "Recover, restore, rebuild." },
} as const;

const ProductCard = ({ product, delay }: { product: Product; delay: number }) => {
  const colorPrimary = product.color_tag.primary;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block relative overflow-hidden bg-card border border-border rounded-xl h-full hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Product image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground px-3 py-1 rounded-full glass-light">
            {product.category}
          </div>

          {/* Price badge */}
          <div className="absolute bottom-4 right-4 text-sm font-bold text-foreground">
            ${product.price}<span className="text-[10px] text-muted-foreground font-normal">/mo</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
            {product.tagline}
          </p>
          {product.hero_ingredient && (
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-0.5 rounded-full border"
                style={{
                  color: colorPrimary,
                  borderColor: `${colorPrimary}40`,
                  background: `${colorPrimary}10`,
                }}
              >
                {product.hero_ingredient}
              </span>
            </div>
          )}
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary flex items-center gap-2">
            Explore
            <motion.span className="inline-block" whileHover={{ x: 4 }}>
              &rarr;
            </motion.span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const RitualGrid = () => {
  return (
    <section id="ritual" className="py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-medium mb-4">
            The Ritual
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Your Daily Protocol
          </h2>
          <p className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
            Six precision formulas, three daily windows. Build the stack that fits your life.
          </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {slotProducts.map((product, i) => (
                    <ProductCard key={product.slug} product={product} delay={i * 0.1} />
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
