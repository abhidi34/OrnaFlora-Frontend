import React, { createContext, useReducer } from 'react';

export const CartContext = createContext();

const initialState = { items: [], currency: localStorage.getItem('currency') || 'INR' };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + (action.payload.qty || 1) } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: Math.max(1, action.payload.qty) } : i) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  return <CartContext.Provider value={{ cart, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
