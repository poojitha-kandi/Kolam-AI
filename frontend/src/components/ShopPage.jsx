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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
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

      {/* Footer with Admin Panel Button */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showAdminPanel ? '🔧 Hide Admin Panel' : '🔧 Admin Panel'}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Admin tools for managing shop inventory
          </p>
        </div>
      </footer>
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
      style={{
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image - Standardized to 300px */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        height: '300px',
        flex: 'none'
      }}>
        {imageError ? (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #fed7aa, #fae8ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🎨</div>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Product Image</p>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {product.featured && (
            <span style={{
              background: 'linear-gradient(to right, #fbbf24, #f97316)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px'
            }}>
              ⭐ Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px'
            }}>
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info - Fixed structure */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        minHeight: '280px'
      }}>
        {/* Category */}
        <p style={{
          fontSize: '0.75rem',
          color: '#ea580c',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem',
          height: '1rem'
        }}>
          {product.category.replace('-', ' ')}
        </p>

        {/* Name - Fixed height */}
        <h3 style={{
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '0.75rem',
          height: '3rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.5rem'
        }}>
          {product.name}
        </h3>

        {/* Rating - Fixed height */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          marginBottom: '0.75rem',
          height: '1.5rem'
        }}>
          <div style={{display: 'flex'}}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                style={{
                  width: '1rem',
                  height: '1rem',
                  color: star <= Math.floor(product.rating) ? '#fbbf24' : '#d1d5db',
                  fill: star <= Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'
                }}
              />
            ))}
          </div>
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Description - Fixed height */}
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '1rem',
          height: '3rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.5rem'
        }}>
          {product.description}
        </p>

        {/* Price - Fixed height */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          height: '2rem'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              textDecoration: 'line-through'
            }}>
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Fixed at bottom */}
        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: '100%',
            background: 'linear-gradient(to right, #f97316, #9333ea)',
            color: 'white',
            fontWeight: '600',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            marginTop: 'auto'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(to right, #ea580c, #7c3aed)';
            e.target.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(to right, #f97316, #9333ea)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <ShoppingCart style={{width: '1.25rem', height: '1.25rem'}} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ShopPage;