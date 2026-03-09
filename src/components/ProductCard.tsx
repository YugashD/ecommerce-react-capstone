import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id: product.id, title: product.title, price: product.price, image: product.image, qty: 1 });
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      {/* Invisible overlay link */}
      <Link to={`/products/${product.id}`} className="absolute inset-0 rounded-2xl" aria-label={product.title} />

      {/* Image area */}
      <div className="bg-slate-50 rounded-xl h-40 flex items-center justify-center p-3">
        <img src={product.image} alt={product.title} className="h-32 object-contain" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] uppercase text-slate-400 tracking-widest font-medium">{product.category}</p>
        <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">{product.title}</h3>
        <p className="text-xs text-slate-400">&#9733; {product.rating?.rate} <span className="text-slate-300">({product.rating?.count})</span></p>
      </div>

      {/* Price + action */}
      <div className="relative z-10 flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
        <p className="text-base font-bold text-slate-900">${product.price}</p>

        {role === 'admin' && (
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer font-medium"
          >
            Edit
          </button>
        )}

        {role === 'user' && (
          <button
            onClick={handleAddToCart}
            className="text-xs px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer font-medium"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
