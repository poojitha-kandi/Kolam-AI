import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial cart state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
};

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      let updatedItems;
      if (existingItem) {
        // Update quantity if item already exists
        updatedItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        updatedItems = [...state.items, { ...product, quantity: 1 }];
      }
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      const updatedItems = state.items.filter(item => item.id !== productId);
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { 
          type: CART_ACTIONS.REMOVE_ITEM, 
          payload: { productId } 
        });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen
      };
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kolam-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // Restore cart from localStorage
          parsedCart.items.forEach(item => {
            dispatch({
              type: CART_ACTIONS.ADD_ITEM,
              payload: { product: { ...item, quantity: item.quantity - 1 } }
            });
          });
        }
      } catch (error) {
        console.warn('Error loading cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('kolam-cart', JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice
    }));
  }, [state.items, state.totalItems, state.totalPrice]);
  
  // Cart actions
  const addToCart = (product) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product }
    });
  };
  
  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };
  
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };
  
  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART });
  };
  
  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CART_ACTIONS };