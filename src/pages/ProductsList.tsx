import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { getProducts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import type { Product } from '../types';

const slugToCategory: { [key: string]: string } = { 'mens-clothing': "men's clothing", 'womens-clothing': "women's clothing" };
const categoryToSlug: { [key: string]: string } = { "men's clothing": 'mens-clothing', "women's clothing": 'womens-clothing' };

export const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useAuth();
  const { addToast } = useToast();

  const activeSlug = searchParams.get('category') || 'all';
  const activeCategory = slugToCategory[activeSlug] || activeSlug;

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryToSlug[cat] || cat });
    }
  };

  const handleAddToCart = (product: Product) => {
    addToast(`${product.title} added to cart!`, 'success');
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Catalog</p>
          <h2 className="text-2xl font-bold text-slate-900">Products</h2>
        </div>
        {role === 'admin' && (
          <Link to="/products/new">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">+ Add product</button>
          </Link>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => {
          const slug = categoryToSlug[cat] || cat;
          const isActive = cat === 'all' ? activeSlug === 'all' : activeSlug === slug;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${isActive
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          );
        })}
      </div>

      <p className="mb-5 text-xs text-slate-400">{filtered.length} products</p>

      {filtered.length === 0 ? (
        <p className="text-slate-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;