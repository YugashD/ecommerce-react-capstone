import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { signupUser } from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup = () => {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (form.firstName.length < 2) newErrors.firstName = 'Min 2 characters';
    if (form.lastName.length < 2) newErrors.lastName = 'Min 2 characters';
    if (form.username.length < 3) newErrors.username = 'Min 3 characters';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (form.password.length < 6) newErrors.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    const data = await signupUser({
      name: { firstname: form.firstName, lastname: form.lastName },
      username: form.username,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (data.id) {
      navigate('/auth/login');
    } else {
      setServerError('Signup failed. Please try again.');
    }
  };

  const field = (name: keyof FormData, label: string, type = 'text') => (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        className={`w-full mt-1.5 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors[name] ? 'border-red-300 bg-red-50' : 'border-slate-200'
          }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const isInvalid = Object.values(form).some((v) => v === '');

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create an account</h2>
          <p className="text-slate-400 text-sm mt-1">Fill in your details to get started</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg mb-4">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field('firstName', 'First Name')}
              {field('lastName', 'Last Name')}
            </div>
            {field('username', 'Username')}
            {field('email', 'Email', 'email')}
            {field('password', 'Password', 'password')}
            {field('confirmPassword', 'Confirm Password', 'password')}

            <button
              type="submit"
              disabled={loading || isInvalid}
              className="w-full py-2.5 mt-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-colors text-sm"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-slate-900 font-medium hover:underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
