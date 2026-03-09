import { createContext, useContext, useReducer } from 'react';
import type { CartItem } from '../types';

const STORAGE_KEY = 'easybuy_cart';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number | string }
  | { type: 'CHANGE_QTY'; payload: { id: number | string; qty: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  changeQty: (id: number | string, qty: number) => void;
  clearCart: () => void;
}

const loadCart = (): CartState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { items: JSON.parse(saved) } : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// 1. Create the context
const CartContext = createContext<CartContextType | null>(null);

// 2. Reducer — handles all cart actions
function cartReducer(state: CartState, action: CartAction): CartState {
  let updatedItems;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (exists) {
        updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty + action.payload.qty } : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload }];
      }
      saveCart(updatedItems);
      return { items: updatedItems };
    }

    case 'REMOVE_FROM_CART':
      updatedItems = state.items.filter((item) => item.id !== action.payload);
      saveCart(updatedItems);
      return { items: updatedItems };

    case 'CHANGE_QTY':
      updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, qty: action.payload.qty } : item
      );
      saveCart(updatedItems);
      return { items: updatedItems };

    case 'CLEAR_CART':
      saveCart([]);
      return { items: [] };

    default:
      return state;
  }
}

// 3. Provider — wraps the app and exposes cart state + helpers
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (id: number | string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  const changeQty = (id: number | string, qty: number) => dispatch({ type: 'CHANGE_QTY', payload: { id, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ items: state.items, total, addToCart, removeFromCart, changeQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom hook — use this in any component to access the cart
export const useCart = () => useContext(CartContext)!;