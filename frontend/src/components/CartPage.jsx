import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';

const CartPage = ({ onBackToShop }) => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const proceedToCheckout = () => {
    if (items.length > 0) {
      setShowCheckout(true);
    }
  };

  if (showCheckout) {
    return <CheckoutPage items={items} totalPrice={totalPrice} onBack={() => setShowCheckout(false)} />;
  }

  return (
    <div className="cart-page min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBackToShop}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              🛒 Shopping Cart
            </h1>
            <p className="text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={onBackToShop}
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Cart Items</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {totalPrice >= 500 ? 'Free' : '₹50'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{Math.round(totalPrice * 0.18)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalPrice + Math.round(totalPrice * 0.18) + (totalPrice >= 500 ? 0 : 50)}</span>
                  </div>
                </div>

                {totalPrice >= 500 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <p className="text-green-700 text-sm font-medium">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-6 flex gap-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {imageError ? (
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
        <p className="text-lg font-bold text-gray-800">₹{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-3">
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm font-semibold text-gray-700">
          ₹{item.price * item.quantity}
        </p>
      </div>
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = ({ items, totalPrice, onBack }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const { clearCart } = useCart();

  const finalTotal = totalPrice + Math.round(totalPrice * 0.18) + (totalPrice >= 500 ? 0 : 50);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = () => {
    return Object.values(customerInfo).every(value => value.trim() !== '');
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    setIsProcessing(true);

    // Razorpay integration
    const options = {
      key: 'rzp_test_1234567890', // Replace with your Razorpay test key
      amount: finalTotal * 100, // Amount in paise
      currency: 'INR',
      name: 'Kolam Art Shop',
      description: 'Kolam Art Supplies',
      image: '/logo.png',
      handler: function (response) {
        console.log('Payment successful:', response);
        setOrderStatus('success');
        clearCart();
        setIsProcessing(false);
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone
      },
      notes: {
        address: customerInfo.address,
        city: customerInfo.city,
        pincode: customerInfo.pincode
      },
      theme: {
        color: '#f97316'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setOrderStatus('failed');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('Payment gateway not available. Please try again later.');
      setIsProcessing(false);
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We'll send you a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Payment Failed</h2>
          <p className="text-gray-600 mb-6">
            There was an issue processing your payment. Please try again.
          </p>
          <button
            onClick={() => setOrderStatus(null)}
            className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={customerInfo.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              
              <hr />
              
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {totalPrice >= 500 ? 'Free' : '₹50'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-semibold">₹{Math.round(totalPrice * 0.18)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!isFormValid() || isProcessing}
              className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{finalTotal}
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;