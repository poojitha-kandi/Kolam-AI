import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { PRODUCTS, PRODUCT_CATEGORIES, getDiscountPercentage } from '../data/products';
import { ShoppingCart, Star, Filter, Search, Heart, Eye } from 'lucide-react';

const ShopPage = () => {
  const { addToCart, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: null,
    description: '',
    category: PRODUCT_CATEGORIES.TOOLS
  });
  const [tempProducts, setTempProducts] = useState([]); // Session-only products

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...PRODUCTS, ...tempProducts]; // Include session products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        // Featured first, then by rating
        return filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [selectedCategory, searchTerm, sortBy, tempProducts]);

  // Admin functions
  const handleAdminUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.image) {
      const product = {
        id: Date.now(), // Simple ID for session
        name: newProduct.name,
        price: parseInt(newProduct.price),
        originalPrice: parseInt(newProduct.price) + 50, // Add some markup
        category: newProduct.category,
        image: newProduct.image,
        description: newProduct.description || 'New product added by admin',
        features: ['New Product', 'Session Only'],
        inStock: true,
        rating: 4.5,
        reviews: 0
      };
      
      setTempProducts(prev => [...prev, product]);
      setNewProduct({ name: '', price: '', image: null, description: '', category: PRODUCT_CATEGORIES.TOOLS });
      alert('Product added successfully! (Session only)');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show success toast/notification
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="shop-page min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      {/* Header */}
      <div className="shop-header bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🛍️ Kolam Shop
              </h1>
              <p className="text-gray-600">
                Everything you need for beautiful Kolam art
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} products
              </p>
              <p className="text-lg font-semibold text-orange-600">
                Free shipping on orders ₹500+
              </p>
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showAdminPanel ? 'Hide Admin' : 'Admin Panel'}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              <option value={PRODUCT_CATEGORIES.STENCILS}>Stencils</option>
              <option value={PRODUCT_CATEGORIES.TOOLS}>Tools</option>
              <option value={PRODUCT_CATEGORIES.ACCESSORIES}>Accessories</option>
              <option value={PRODUCT_CATEGORIES.MATERIALS}>Materials</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-full"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="admin-panel bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔧 Admin Panel - Add New Product
            </h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={PRODUCT_CATEGORIES.TOOLS}>Tools</option>
                    <option value={PRODUCT_CATEGORIES.STENCILS}>Stencils</option>
                    <option value={PRODUCT_CATEGORIES.MATERIALS}>Materials</option>
                    <option value={PRODUCT_CATEGORIES.ACCESSORIES}>Accessories</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdminUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {newProduct.image && (
                    <img
                      src={newProduct.image}
                      alt="Preview"
                      className="mt-2 w-20 h-20 object-cover rounded-md"
                    />
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddProduct}
                className="mt-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all duration-300"
              >
                Add Product (Session Only)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">{showAdminPanel && <div className="mb-8" />}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);

  return (
    <div 
      className="product-card bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        {imageError ? (
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-sm text-gray-500">Product Image</p>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">
          {product.category.replace('-', ' ')}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-800">
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:from-orange-600 hover:to-purple-700 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ShopPage;