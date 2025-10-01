import React from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

const CartBadge = ({ onClick, className = '' }) => {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartBadge;