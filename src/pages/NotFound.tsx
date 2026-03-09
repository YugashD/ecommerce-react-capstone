import { Link } from 'react-router';

export const NotFound = () => {
  return (
    <div className="text-center py-24">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Error 404</p>
      <h2 className="text-6xl font-bold text-slate-900 mb-3">Page not found</h2>
      <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">Sorry, the page you're looking for doesn't exist or has been moved.</p>
      <Link to="/home">
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">
          Back to home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
