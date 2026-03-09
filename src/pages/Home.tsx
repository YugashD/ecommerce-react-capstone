import { Link } from 'react-router';

export const Home = () => {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="text-center py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Welcome to EasyBuy</p>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight">Shop smarter.<br />Live better.</h1>
        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
          Discover thousands of products at unbeatable prices.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/products">
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">
              Browse products
            </button>
          </Link>
          <Link to="/cart">
            <button className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-sm font-medium">
              View cart
            </button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Shop by category</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Electronics', icon: '💻', slug: 'electronics' },
            { label: 'Jewelry', icon: '💍', slug: 'jewelery' },
            { label: "Men's Clothing", icon: '👔', slug: 'mens-clothing' },
            { label: "Women's Clothing", icon: '👗', slug: 'womens-clothing' },
          ].map((cat) => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`}>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <p className="text-2xl mb-2">{cat.icon}</p>
                <p className="text-sm font-medium text-slate-700">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Why EasyBuy</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On all orders over $50' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'Your data is always safe' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-slate-100 rounded-2xl p-6">
              <p className="text-2xl mb-3">{f.icon}</p>
              <h3 className="text-sm font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;