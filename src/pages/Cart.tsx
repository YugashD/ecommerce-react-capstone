import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { items, total, removeFromCart, changeQty, clearCart } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleClearConfirm = () => {
    clearCart();
    setShowClearModal(false);
  };

  const handleCheckoutConfirm = () => {
    clearCart();
    setShowCheckoutModal(false);
    setOrderPlaced(true);
  };

  // Thank-you screen
  if (orderPlaced) {
    return (
      <div className="text-center py-24">
        <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5 text-xl">✓</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order placed!</h2>
        <p className="text-slate-400 mb-8 text-sm">Thank you for shopping with us.</p>
        <Link to="/home">
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">Continue shopping</button>
        </Link>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Your cart is empty</h2>
        <p className="text-slate-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products">
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">Browse products</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Clear cart modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-[90%] shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 mb-1">Clear cart?</h3>
            <p className="text-slate-500 text-sm">This will remove all items from your cart.</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowClearModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleClearConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 cursor-pointer">Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-[90%] shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 mb-1">Confirm order</h3>
            <p className="text-slate-500 text-sm mb-1">You're about to place an order for</p>
            <p className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowCheckoutModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleCheckoutConfirm} className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-700 cursor-pointer">Place order</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Your cart</p>
        <h2 className="text-2xl font-bold text-slate-900">Shopping Cart</h2>
      </div>

      <div className="flex gap-6 flex-wrap items-start">
        {/* Items list */}
        <div className="flex-[2] min-w-[280px] bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 px-5 py-4 items-center">
              <Link to={`/products/${item.id}`}>
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-10 h-10 object-contain" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800 truncate">{item.title}</p>
                <p className="text-slate-400 text-xs">${item.price} each</p>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    if (item.qty <= 1) removeFromCart(item.id);
                    else changeQty(item.id, item.qty - 1);
                  }}
                  className="w-7 h-7 text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-center text-sm"
                >−</button>
                <span className="w-7 text-center text-xs font-medium text-slate-700">{item.qty}</span>
                <button onClick={() => changeQty(item.id, item.qty + 1)} className="w-7 h-7 text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-center text-sm">+</button>
              </div>
              <p className="font-semibold text-sm text-slate-900 min-w-[56px] text-right">${(item.price * item.qty).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-400 text-lg bg-transparent border-none cursor-pointer leading-none ml-1 transition-colors">×</button>
            </div>
          ))}
          <div className="px-5 py-3">
            <button onClick={() => setShowClearModal(true)} className="text-xs text-slate-400 hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors">
              Clear all items
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="flex-1 min-w-[220px] bg-white rounded-2xl border border-slate-100 p-5 sticky top-20">
          <h3 className="font-semibold text-sm text-slate-900 mb-4">Order summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-slate-500 mb-2">
              <span className="truncate max-w-[120px]">{item.title.substring(0, 18)}… ×{item.qty}</span>
              <span className="font-medium text-slate-700">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 mt-3 pt-3 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => setShowCheckoutModal(true)} className="w-full mt-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">
            Checkout
          </button>
          <Link to="/products" className="block text-center text-xs text-slate-400 hover:text-slate-700 mt-3 transition-colors">← Continue shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
