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
    image: "/Traditional kolam stencils.jpg",
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
    name: "Decorative Mandala Serving Tray",
    price: 799,
    originalPrice: 1199,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "/Decorative Mandala Serving Tray.jpeg",
    description: "A beautiful and durable serving tray featuring an intricate mosaic of Mandala patterns. Perfect for festivals and home decor.",
    features: [
      "Intricate mosaic Mandala patterns",
      "Durable construction",
      "Perfect for festivals and decor",
      "Beautiful serving tray design"
    ],
    inStock: true,
    rating: 4.9,
    reviews: 340
  },
  {
    id: 3,
    name: "Precision Outliner Pen",
    price: 99,
    originalPrice: 129,
    category: PRODUCT_CATEGORIES.TOOLS,
    image: "/test-precision.jpg",
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
    image: "/Natural colour filters.jpg",
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
    image: "/Premium template trays.jpg",
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
    image: "/Multi pattern sprinkler.jpg",
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
    image: "/kolam design book.jpg",
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
    image: "/Eco friendly rice flour.jpg",
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
    image: "/test-professional.jpg",
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
  },
  {
    id: 10,
    name: "Rangoli Color Squeeze Bottles (Set of 10)",
    price: 499,
    originalPrice: 799,
    category: PRODUCT_CATEGORIES.TOOLS,
    image: "IMG-20251003-WA0016.jpg",
    description: "A complete set of 10 easy-to-use squeeze bottles for creating precise and vibrant floor decorations. Perfect for both beginners and experts.",
    features: [
      "10 vibrant color squeeze bottles",
      "Easy-grip design for precision",
      "Non-toxic water-based colors",
      "Perfect for detailed work"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 1250
  },
  {
    id: 11,
    name: "Beginner's Kolam & Rangoli Toolkit",
    price: 699,
    originalPrice: 999,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "IMG-20251003-WA0016 (3).jpg",
    description: "Everything you need to get started! This kit includes color bottles, rollers, and pattern makers to help you create beautiful designs effortlessly.",
    features: [
      "Complete beginner toolkit",
      "Color bottles and rollers included",
      "Pattern makers for guidance",
      "Step-by-step instruction guide"
    ],
    inStock: true,
    rating: 4.7,
    reviews: 980
  },
  {
    id: 12,
    name: "Mindful Art Therapy: 7 Dots Kolam Designs",
    price: 349,
    originalPrice: 499,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "IMG-20251003-WA0016 (4).jpg",
    description: "A step-by-step book by Anusha Rajendran for stress relief and creativity, focusing on beautiful 7-dot Kolam patterns.",
    features: [
      "50+ 7-dot Kolam designs",
      "Step-by-step instructions",
      "Stress relief techniques",
      "By expert Anusha Rajendran"
    ],
    inStock: true,
    rating: 4.9,
    reviews: 2150
  },
  {
    id: 13,
    name: "Ascension Rangoli Colors & Stencil Kit",
    price: 899,
    originalPrice: 1299,
    category: PRODUCT_CATEGORIES.MATERIALS,
    image: "IMG-20251003-WA0016 (5).jpg",
    description: "A premium kit with bright, assorted rangoli colors and a variety of traditional stencils, including 'Om' and lotus feet designs.",
    features: [
      "Premium assorted rangoli colors",
      "Traditional stencil collection",
      "Om and lotus feet designs",
      "High-quality materials"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 1800
  },
  {
    id: 14,
    name: "Hand-Painted Wooden Mandala Art Piece",
    price: 1499,
    originalPrice: 2199,
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    image: "IMG-20251003-WA0016 (2).jpg",
    description: "A beautiful, laser-cut wooden Mandala, hand-painted with vibrant colors. Perfect as a decorative centerpiece or for meditation.",
    features: [
      "Laser-cut wooden construction",
      "Hand-painted vibrant colors",
      "Perfect for meditation",
      "Decorative centerpiece"
    ],
    inStock: true,
    rating: 5.0,
    reviews: 750,
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

// Community Gallery Posts
export const COMMUNITY_POSTS = [
  {
    id: 1,
    title: "Majestic Margazhi Kolam",
    author: "S. Vidya",
    location: "Chennai, Tamil Nadu",
    image: "WhatsApp Image 2025-10-04 at 09.30.06_b460c095.jpg",
    description: "Waking up early to draw this detailed Kolam for the auspicious month of Margazhi. A blend of geometric patterns and floral motifs.",
    hashtags: ["#Margazhi", "#Kolam", "#FloorArt", "#SouthIndia", "#GeometricDesign"],
    likes: 215,
    comments: 18,
    shares: 7,
    timeAgo: "2 hours ago",
    featured: true
  },
  {
    id: 2,
    title: "Onam Pookalam Splendor",
    author: "Anjali Menon",
    location: "Kochi, Kerala",
    image: "WhatsApp Image 2025-10-04 at 09.31.02_2486015d.jpg",
    description: "Celebrating the spirit of Onam with this vibrant Pookalam, made with fresh flowers from our garden. A tradition that brings so much joy!",
    hashtags: ["#Onam", "#Pookalam", "#KeralaTradition", "#FlowerArt", "#FestivalVibes"],
    likes: 350,
    comments: 25,
    shares: 11,
    timeAgo: "8 hours ago",
    featured: true
  },
  {
    id: 3,
    title: "Intricate Sikku Kolam",
    author: "Meenakshi Iyer",
    location: "Madurai, Tamil Nadu",
    image: "WhatsApp Image 2025-10-04 at 09.32.06_174671ed.jpg",
    description: "My attempt at a classic 'Sikku' or 'Chikku' Kolam, known for its intricate, continuous looping lines drawn with rice flour. A meditative and beautiful art form.",
    hashtags: ["#SikkuKolam", "#ChikkuKolam", "#TamilNadu", "#LineArt", "#Traditional"],
    likes: 198,
    comments: 12,
    shares: 5,
    timeAgo: "1 day ago",
    featured: false
  },
  {
    id: 4,
    title: "Diwali Glow Rangoli",
    author: "Rohan Gupta",
    location: "Jaipur, Rajasthan",
    image: "WhatsApp Image 2025-10-04 at 10.03.37_c45e6b1c.jpg",
    description: "A traditional rangoli for the festival of lights. The combination of red and white with glowing diyas to welcome prosperity and happiness. Happy Diwali!",
    hashtags: ["#Diwali", "#Rangoli", "#FestivalOfLights", "#Diya", "#TraditionalArt"],
    likes: 412,
    comments: 31,
    shares: 15,
    timeAgo: "2 days ago",
    featured: true
  }
];

// Community Gallery Helper Functions
export const getCommunityPostById = (id) => {
  return COMMUNITY_POSTS.find(post => post.id === id);
};

export const getFeaturedPosts = () => {
  return COMMUNITY_POSTS.filter(post => post.featured);
};

export const getPostsByAuthor = (author) => {
  return COMMUNITY_POSTS.filter(post => post.author === author);
};

export const getMostLikedPosts = (limit = 10) => {
  return COMMUNITY_POSTS
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
};

export const getRecentPosts = (limit = 10) => {
  return COMMUNITY_POSTS.slice(0, limit);
};

// Featured community posts for main page display
export const FEATURED_COMMUNITY_HIGHLIGHTS = [
  {
    id: 'highlight-1',
    title: 'Community Gallery',
    subtitle: 'Discover and share beautiful Kolam creations from artists around the world.',
    description: 'Existing posts from your video would appear here first...',
    posts: COMMUNITY_POSTS.filter(post => post.featured),
    totalPosts: COMMUNITY_POSTS.length,
    totalLikes: COMMUNITY_POSTS.reduce((sum, post) => sum + post.likes, 0)
  }
];