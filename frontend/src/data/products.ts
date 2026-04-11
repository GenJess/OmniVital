// Static product catalog — sourced from Supabase, served locally for instant load.
// Product IDs match the Supabase products table exactly.

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  schedule_slot: "morning" | "midday" | "evening";
  description: string;
  short_description: string;
  price: number;
  image_url: string;
  hero_ingredient: string;
  dosage_text: string;
  directions_text: string;
  benefit_bullets: string[];
  bio_availability_text: string;
  sourcing_text: string;
  daily_ritual_text: string;
  color_tag: { primary: string; secondary: string; hue: number };
  display_order: number;
  active: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "261a25b6-73d0-4f9b-be01-b0ed4c751492",
    name: "OV Drive",
    slug: "ov-drive",
    tagline: "Caffeine-free alertness and clean drive.",
    category: "Energy",
    schedule_slot: "morning",
    description:
      "OV Drive is engineered for people who want sustained energy without the crash. Built around clinically studied adaptogens and B-vitamin cofactors, Drive supports mitochondrial function and natural ATP production \u2014 giving you clean, caffeine-free alertness that lasts from morning through midday without jitters or dependency.",
    short_description: "Clean energy and sustained alertness without caffeine.",
    price: 64,
    image_url: "https://images.unsplash.com/photo-1704018731170-f30899f60917?w=800&h=800&fit=crop&crop=center&q=80",
    hero_ingredient: "Cordyceps Militaris",
    dosage_text: "2 capsules daily",
    directions_text:
      "Take 2 capsules with breakfast. Best paired with your morning routine for sustained energy throughout the day.",
    benefit_bullets: [
      "Supports natural ATP production and mitochondrial health",
      "Promotes sustained alertness without caffeine dependency",
      "Helps maintain steady energy levels from morning to midday",
      "Supports physical and mental stamina under daily demands",
    ],
    bio_availability_text:
      "OV Drive uses a patented hot-water extraction of Cordyceps militaris standardized to 0.3% cordycepin, paired with methylated B-vitamins (methylcobalamin + methylfolate) for superior cofactor bioavailability. The capsule matrix is designed for gradual gastric release over 2\u20133 hours.",
    sourcing_text:
      "Cordyceps sourced from USDA-certified organic vertical farms. B-vitamins produced via fermentation, not synthetic reduction. Third-party tested for heavy metals, pesticides, and microbial contamination. GMP-certified facility.",
    daily_ritual_text:
      "Morning slot. Take with or after breakfast. Pairs well with OV Adapt for a complete morning protocol. Avoid taking after 2 PM if sensitive to energy supplements.",
    color_tag: { primary: "#0D9488", secondary: "#14B8A6", hue: 168 },
    display_order: 1,
    active: true,
  },
  {
    id: "0f2d087d-89ff-4cc0-915b-45d4bb5606eb",
    name: "OV Adapt",
    slug: "ov-adapt",
    tagline: "Resilient performance under load.",
    category: "Energy / Stress Resilience",
    schedule_slot: "morning",
    description:
      "OV Adapt is designed for the high-performer navigating sustained cognitive and physical load. Combining KSM-66 Ashwagandha with Rhodiola rosea and Eleuthero, Adapt modulates the HPA axis to support your stress response while maintaining energy output \u2014 helping you stay sharp and composed when demands increase.",
    short_description: "Stress resilience and sustained performance when it matters.",
    price: 68,
    image_url: "https://images.unsplash.com/photo-1596177827808-4d338c4145f7?w=800&h=800&fit=crop&crop=center&q=80",
    hero_ingredient: "KSM-66 Ashwagandha",
    dosage_text: "2 capsules daily",
    directions_text:
      "Take 2 capsules with your morning meal. Can also be taken at midday during high-demand periods. Consistent daily use supports cumulative adaptogenic benefit.",
    benefit_bullets: [
      "Supports HPA-axis regulation for healthier stress response",
      "Promotes sustained cognitive and physical performance",
      "Helps maintain composure and energy under high load",
      "Supports long-term resilience and recovery from daily stress",
    ],
    bio_availability_text:
      "Features KSM-66\u00ae full-spectrum ashwagandha root extract (standardized to 5% withanolides) with clinically validated bioavailability. Rhodiola rosea standardized to 3% rosavins and 1% salidroside. Eleuthero at efficacious dosing for synergistic adaptogenic effect.",
    sourcing_text:
      "KSM-66 sourced from Ixoreal Biomed (India) with full chain-of-custody documentation. Rhodiola wild-harvested from Altai mountain regions under sustainable protocols. All ingredients third-party verified. Non-GMO, gluten-free, vegan.",
    daily_ritual_text:
      "Morning or midday slot. Take daily for at least 4\u20136 weeks for full adaptogenic benefit. Stack with OV Drive for a performance-oriented morning, or with OV Cortex on high-stress days.",
    color_tag: { primary: "#F59E0B", secondary: "#FBBF24", hue: 42 },
    display_order: 2,
    active: true,
  },
  {
    id: "b947d896-15fe-4413-8872-3ea71cd4db3c",
    name: "OV Bright",
    slug: "ov-bright",
    tagline: "Steadier mood and calmer baseline.",
    category: "Stress / Mood",
    schedule_slot: "midday",
    description:
      "OV Bright targets the neurochemical foundations of emotional balance. With clinically relevant doses of saffron extract (affron\u00ae), magnesium L-threonate, and L-theanine, Bright supports serotonergic and GABAergic pathways \u2014 promoting a calmer, more stable emotional baseline without sedation or cognitive dulling.",
    short_description: "Balanced mood and emotional steadiness throughout the day.",
    price: 72,
    image_url: "https://images.unsplash.com/photo-1596177582967-a5d143a41237?w=800&h=800&fit=crop&crop=center&q=80",
    hero_ingredient: "affron\u00ae Saffron Extract",
    dosage_text: "2 capsules daily",
    directions_text:
      "Take 2 capsules at midday with food. Best taken consistently for cumulative mood-support benefits. Can be taken in the morning if preferred.",
    benefit_bullets: [
      "Supports serotonergic pathways for natural mood balance",
      "Promotes calm emotional baseline without sedation",
      "Helps maintain focus and clarity alongside mood support",
      "Supports resilience to daily emotional fluctuations",
    ],
    bio_availability_text:
      "affron\u00ae saffron extract standardized to 3.5% Lepticrosalides\u00ae \u2014 the most clinically studied saffron extract for mood support. Magnesium L-threonate (Magtein\u00ae) crosses the blood-brain barrier for targeted neural support. L-theanine from green tea for complementary GABAergic modulation.",
    sourcing_text:
      "affron\u00ae sourced from Pharmactive Biotech (Spain), produced under patented extraction. Magtein\u00ae licensed from MIT research. L-theanine derived from Camellia sinensis via enzymatic synthesis. All ingredients non-GMO, vegan, heavy-metal tested.",
    daily_ritual_text:
      "Midday slot. Pairs naturally with OV Quiet Focus for a balanced midday protocol. Take consistently \u2014 mood support compounds typically reach full effect in 2\u20134 weeks of daily use.",
    color_tag: { primary: "#F472B6", secondary: "#EC4899", hue: 330 },
    display_order: 3,
    active: true,
  },
  {
    id: "48d6990d-377c-4d55-a84b-c4d8aa6d8c8a",
    name: "OV Quiet Focus",
    slug: "ov-quiet-focus",
    tagline: "Calm concentration without sedation.",
    category: "Stress / Focus",
    schedule_slot: "midday",
    description:
      "OV Quiet Focus is built for the thinker who needs depth without distraction. Combining lion\u2019s mane mushroom with CDP-choline (Cognizin\u00ae) and L-theanine, Quiet Focus supports acetylcholine synthesis and NGF production \u2014 enabling calm, sustained concentration without the overstimulation of traditional nootropics.",
    short_description: "Deep, calm focus and sustained cognitive clarity.",
    price: 66,
    image_url: "https://images.unsplash.com/photo-1704018731115-cdec06f3f067?w=800&h=800&fit=crop&crop=center&q=80",
    hero_ingredient: "Cognizin\u00ae CDP-Choline",
    dosage_text: "2 capsules daily",
    directions_text:
      "Take 2 capsules at midday, ideally before deep work sessions. Can be taken morning or afternoon depending on your focus needs.",
    benefit_bullets: [
      "Supports acetylcholine production for sharper focus",
      "Promotes NGF synthesis for long-term neural health",
      "Helps sustain deep concentration without jitters or overstimulation",
      "Supports creative thinking and cognitive flexibility",
    ],
    bio_availability_text:
      "Cognizin\u00ae citicoline is the most clinically studied form of CDP-choline, shown to support brain energy metabolism and phospholipid synthesis. Lion\u2019s mane uses dual hot-water and ethanol extraction for both hericenones and erinacines \u2014 the compounds responsible for NGF stimulation.",
    sourcing_text:
      "Cognizin\u00ae produced by Kyowa Hakko (Japan) via fermentation. Lion\u2019s mane from certified organic fruiting bodies \u2014 no mycelium-on-grain. L-theanine enzymatically produced for >98% purity. Third-party tested, GMP certified.",
    daily_ritual_text:
      "Midday slot. Take before your most demanding cognitive work. Pairs well with OV Bright for a calm-and-focused midday stack. Consistent use supports cumulative neural benefits.",
    color_tag: { primary: "#818CF8", secondary: "#6366F1", hue: 240 },
    display_order: 4,
    active: true,
  },
  {
    id: "dab466a4-f3a3-4821-8e19-8849cc5e4059",
    name: "OV Neuro Night",
    slug: "ov-neuro-night",
    tagline: "Premium brain-first night recovery.",
    category: "Sleep / Recovery",
    schedule_slot: "evening",
    description:
      "OV Neuro Night goes beyond basic sleep support. Combining magnesium glycinate, phosphatidylserine, and tart cherry extract, Neuro Night targets both sleep architecture and overnight neural recovery \u2014 supporting deeper slow-wave sleep, cortisol clearance, and the glymphatic processes that restore cognitive function overnight.",
    short_description: "Deep sleep and overnight neural restoration.",
    price: 74,
    image_url: "https://images.unsplash.com/photo-1704018731280-6617b0ca1dbe?w=800&h=800&fit=crop&crop=center&q=80",
    hero_ingredient: "Magnesium Glycinate",
    dosage_text: "2 capsules daily",
    directions_text:
      "Take 2 capsules 30\u201360 minutes before bed. Best taken on a consistent schedule to support circadian rhythm reinforcement.",
    benefit_bullets: [
      "Supports deeper slow-wave sleep architecture",
      "Promotes overnight cortisol clearance and HPA recovery",
      "Supports glymphatic brain-cleaning processes during sleep",
      "Helps you wake restored with clearer cognitive baseline",
    ],
    bio_availability_text:
      "Magnesium glycinate chelate provides superior absorption versus oxide or citrate forms, with minimal GI impact. Phosphatidylserine (Sharp-PS\u00ae) is clinically shown to reduce evening cortisol. Tart cherry (CherryPURE\u00ae) provides natural melatonin precursors and anthocyanins for antioxidant recovery.",
    sourcing_text:
      "Magnesium glycinate from Albion Minerals (USA). Sharp-PS\u00ae phosphatidylserine from Enzymotec. CherryPURE\u00ae from Shoreline Fruit. All ingredients third-party tested for purity, potency, and heavy metals. Vegan, non-GMO.",
    daily_ritual_text:
      "Evening slot. Take 30\u201360 minutes before your target bedtime. Pairs with OV Cortex on high-stress days when evening wind-down is harder. Avoid screens for 30 minutes after taking for best results.",
    color_tag: { primary: "#7C3AED", secondary: "#8B5CF6", hue: 270 },
    display_order: 5,
    active: true,
  },
  {
    id: "02610627-aef2-4c1b-a55b-f14171c55335",
    name: "OV Cortex",
    slug: "ov-cortex",
    tagline: "Composure under pressure and cognitive clarity.",
    category: "Stress / Cognition",
    schedule_slot: "evening",
    description:
      "OV Cortex is the executive-grade supplement for high-stakes days. Combining Bacopa monnieri, alpha-GPC, and phosphatidylserine, Cortex supports working memory, executive function, and cortisol modulation \u2014 helping you maintain composure and cognitive clarity when pressure is highest.",
    short_description: "Executive-level cognitive support for high-pressure moments.",
    price: 78,
    image_url: "https://images.unsplash.com/photo-1704018731195-f202bbeac8a7?w=800&h=800&fit=crop&crop=center&q=80",
    hero_ingredient: "Bacopa Monnieri",
    dosage_text: "2 capsules daily",
    directions_text:
      "Take 2 capsules in the evening or during high-stress periods. Can be taken midday on particularly demanding days.",
    benefit_bullets: [
      "Supports working memory and executive function under pressure",
      "Promotes cortisol modulation for sustained composure",
      "Helps maintain cognitive clarity during high-stakes situations",
      "Supports long-term neuroprotective and memory benefits",
    ],
    bio_availability_text:
      "Bacopa monnieri standardized to 50% bacosides (BaCognize\u00ae) \u2014 the most studied form for memory and cognitive performance. Alpha-GPC at 50% concentration for efficient choline delivery across the blood-brain barrier. Phosphatidylserine (Sharp-PS\u00ae) for cortisol management and cell membrane integrity.",
    sourcing_text:
      "BaCognize\u00ae Bacopa from Verdure Sciences (USA/India). Alpha-GPC from enzymatic soy phospholipid processing (allergen-free final product). Sharp-PS\u00ae from Enzymotec. Full traceability, third-party COAs available. GMP, non-GMO, vegan.",
    daily_ritual_text:
      "Evening slot or high-stress days. Take in the evening for next-day cognitive preparation, or midday when facing acute high-pressure situations. Pairs with OV Neuro Night for a comprehensive evening recovery protocol.",
    color_tag: { primary: "#DC2626", secondary: "#EF4444", hue: 0 },
    display_order: 6,
    active: true,
  },
];

// Helper lookups
export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const getProductsBySlot = (slot: "morning" | "midday" | "evening"): Product[] =>
  PRODUCTS.filter((p) => p.schedule_slot === slot);
