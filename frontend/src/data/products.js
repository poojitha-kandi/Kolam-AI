// Product catalog for Kolam shopping
export const PRODUCT_CATEGORIES = {
  STENCILS: 'stencils',
  TOOLS: 'tools',
  ACCESSORIES: 'accessories',
  MATERIALS: 'materials'
};

export const PRODUCTS = [
  {
    id: 1,
    name: "Traditional Kolam Stencils",
    price: 199,
    originalPrice: 249,
    category: PRODUCT_CATEGORIES.STENCILS,
    image: "/shop/stencils.jpg",
    description: "Set of 12 traditional Kolam design stencils made from durable plastic. Perfect for beginners and experts alike.",
    features: [
      "12 different traditional designs",
      "Durable plastic material",
      "Easy to clean and reuse",
      "Suitable for all powder types"
    ],
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: "Powder Rollers Set",
    price: 249,
    originalPrice: 299,
    category: PRODUCT_CATEGORIES.TOOLS,
    image: "/shop/powder-rollers.jpg",
    description: "Professional-grade powder rollers for smooth and even Kolam creation. Includes 3 different sizes.",
    features: [
      "3 different roller sizes",
      "Non-stick surface",
      "Ergonomic handle",
      "Easy to fill and use"
    ],
    inStock: true,
    rating: 4.7,
    reviews: 96
  },
  {
    id: 3,
    name: "Precision Outliner Pen",
    price: 99,
    originalPrice: 129,
    category: PRODUCT_CATEGORIES.TOOLS,
    image: "/shop/outliner-pen.jpg",
    description: "Fine-tip outliner pen for creating precise Kolam borders and intricate details.",
    features: [
      "Fine 0.5mm tip",
      "Refillable design",
      "Comfortable grip",
      "Fade-resistant ink"
    ],
    inStock: true,
    rating: 4.3,
    reviews: 74
  },
  {
    id: 4,
    name: "Natural Color Fillers",
    price: 149,
    originalPrice: 179,
    category: PRODUCT_CATEGORIES.MATERIALS,
    image: "/shop/color-fillers.jpg",
    description: "Set of 8 natural color powders made from turmeric, vermillion, and other traditional materials.",
    features: [
      "8 vibrant natural colors",
      "Non-toxic ingredients",
      "Long-lasting colors",
      "Traditional formulation"
    ],
    inStock: true,
    rating: 4.6,
    reviews: 142
  },
  {
    id: 5,
    name: "Premium Template Trays",
    price: 299,
    originalPrice: 349,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "/shop/template-trays.jpg",
    description: "Set of 6 premium template trays with intricate Kolam patterns. Made from high-quality brass.",
    features: [
      "6 different brass templates",
      "Intricate traditional patterns",
      "Durable brass construction",
      "Easy to clean"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: 6,
    name: "Multi-Pattern Sprinklers",
    price: 199,
    originalPrice: 229,
    category: PRODUCT_CATEGORIES.TOOLS,
    image: "/shop/sprinklers.jpg",
    description: "Adjustable sprinklers for creating dots and patterns. Perfect for geometric Kolam designs.",
    features: [
      "3 adjustable nozzle sizes",
      "Easy-grip handle",
      "Uniform dot patterns",
      "Quick refill design"
    ],
    inStock: true,
    rating: 4.4,
    reviews: 67
  },
  {
    id: 7,
    name: "Kolam Design Book",
    price: 179,
    originalPrice: 199,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "/shop/design-book.jpg",
    description: "Comprehensive guide with 100+ traditional and modern Kolam designs with step-by-step instructions.",
    features: [
      "100+ unique designs",
      "Step-by-step tutorials",
      "Cultural significance explained",
      "High-quality illustrations"
    ],
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: 8,
    name: "Eco-Friendly Rice Flour",
    price: 89,
    originalPrice: 109,
    category: PRODUCT_CATEGORIES.MATERIALS,
    image: "/shop/rice-flour.jpg",
    description: "Premium quality rice flour specially ground for Kolam making. 100% organic and eco-friendly.",
    features: [
      "100% organic rice flour",
      "Fine powder texture",
      "1kg pack",
      "Eco-friendly packaging"
    ],
    inStock: true,
    rating: 4.5,
    reviews: 156
  },
  {
    id: 9,
    name: "Professional Kolam Kit",
    price: 799,
    originalPrice: 999,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "/shop/professional-kit.jpg",
    description: "Complete professional kit with all essential tools for serious Kolam artists. Perfect gift for enthusiasts.",
    features: [
      "Complete tool collection",
      "Premium carrying case",
      "Instruction manual included",
      "Professional-grade quality"
    ],
    inStock: true,
    rating: 4.9,
    reviews: 45,
    featured: true
  }
];

// Helper functions
export const getProductById = (id) => {
  return PRODUCTS.find(product => product.id === id);
};

export const getProductsByCategory = (category) => {
  return PRODUCTS.filter(product => product.category === category);
};

export const getFeaturedProducts = () => {
  return PRODUCTS.filter(product => product.featured);
};

export const getDiscountPercentage = (price, originalPrice) => {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};