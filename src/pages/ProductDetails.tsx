import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getProductById, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import type { Product } from '../types';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const { role } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    getProductById(id!).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id: product.id, title: product.title, price: product.price, image: product.image, qty });
    addToast(`${product.title} added to cart!`, 'success');
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(id!);
      setShowDeleteModal(false);
      addToast('Product deleted successfully!', 'success');
      navigate('/products');
    } catch {
      setDeleteError('Failed to delete product. Please try again.');
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-[90%] shadow-xl">
            <h3 className="text-base font-semibold text-slate-900 mb-1">Delete product?</h3>
            <p className="text-slate-500 text-sm mb-1">This will permanently remove <span className="font-medium text-slate-700">{product.title}</span>.</p>
            {deleteError && <p className="text-red-500 text-xs mt-2">{deleteError}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <span>←</span> Back to products
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
        <div className="flex gap-8 flex-wrap">
          {/* Image */}
          <div className="bg-slate-50 rounded-xl w-56 h-56 flex items-center justify-center p-4 flex-shrink-0">
            <img src={product.image} alt={product.title} className="h-44 object-contain" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-[200px]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{product.category}</p>
            <h2 className="text-xl font-bold text-slate-900 mb-1 leading-snug">{product.title}</h2>
            <p className="text-xs text-slate-400 mb-3">&#9733; {product.rating?.rate} &nbsp;<span className="text-slate-300">({product.rating?.count} reviews)</span></p>
            <p className="text-2xl font-bold text-slate-900 mb-4">${product.price}</p>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description}</p>

            {role === 'user' && (
              <div className="flex gap-3 items-center">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 text-lg text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-center">−</button>
                  <span className="w-8 text-center text-sm font-medium text-slate-800">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-9 h-9 text-lg text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center justify-center">+</button>
                </div>
                <button onClick={handleAddToCart} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">
                  Add to cart
                </button>
              </div>
            )}

            {role === 'admin' && (
              <div className="flex gap-2">
                <Link to={`/products/${product.id}/edit`}>
                  <button className="px-5 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer">Edit</button>
                </Link>
                <button onClick={() => setShowDeleteModal(true)} className="px-5 py-2 border border-red-200 bg-red-50 text-red-600 rounded-xl text-sm hover:bg-red-100 cursor-pointer">Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

