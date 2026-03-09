import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { ok, data } = await loginUser(username, password);

      if (!ok) {
        setLoading(false);
        setError('Invalid username or password. Please try again.');
        return;
      }

      setLoading(false);

      if (data.token) {
        login(data.token, role);
        const savedRedirect = searchParams.get('reDirectTo') || '/home';
        // Admin cannot access the cart page — send them home instead
        const redirectTo = role === 'admin' && savedRedirect === '/cart' ? '/home' : savedRedirect;
        navigate(redirectTo, { replace: true });
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sign in as</label>
              <div className="flex gap-3 mt-1.5">
                {(['user', 'admin'] as const).map((r) => (
                  <label key={r} className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-xl cursor-pointer text-sm transition-colors ${role === r
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                    <input type="radio" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-colors text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          No account?{' '}
          <Link to="/auth/signup" className="text-slate-900 font-medium hover:underline underline-offset-2">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
