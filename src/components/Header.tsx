import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Header = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    logout(clearCart);
    navigate('/auth/login');
  };

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40">
      {/* Logo */}
      <Link to="/home" className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight hover:opacity-75 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        EasyBuy
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        <Link to="/home" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">Home</Link>
        <Link to="/products" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">Products</Link>

        {/* Cart only for users */}
        {isLoggedIn && role === 'user' && (
          <Link to="/cart" className="relative text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        <div className="w-px h-4 bg-slate-200 mx-1" />

        {/* Role badge */}
        {isLoggedIn && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${role === 'admin'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-600'
            }`}>
            {role === 'admin' ? 'Admin' : 'User'}
          </span>
        )}

        {/* Auth links */}
        {!isLoggedIn && (
          <Link to="/auth/login" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">Sign in</Link>
        )}

        {/* Logout */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="ml-1 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
