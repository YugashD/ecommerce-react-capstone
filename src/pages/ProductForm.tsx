import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getProductById, addProduct, updateProduct, getCategories } from '../services/api';
import Loader from '../components/Loader';

interface FormData {
  title: string;
  description: string;
  category: string;
  price: string;
  image: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  image?: string;
}

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({ title: '', description: '', category: '', price: '', image: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);

    if (isEdit) {
      getProductById(id!).then((data) => {
        setForm({ title: data.title, description: data.description, category: data.category, price: String(data.price), image: data.image });
        setLoading(false);
      });
    }
  }, [id]);

  const validate = () => {
    const e: FormErrors = {};
    if (form.title.length < 3) e.title = 'Min 3 characters';
    if (form.description.length < 10) e.description = 'Min 10 characters';
    if (!form.category) e.category = 'Select a category';
    if (!form.price || Number(form.price) <= 0) e.price = 'Must be greater than 0';
    if (!/^https?:\/\/.+/.test(form.image)) e.image = 'Must be a valid URL';
    return e;
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSaving(true);
    const payload = { ...form, price: Number(form.price) };

    if (isEdit) {
      await updateProduct(id!, payload);
    } else {
      await addProduct(payload);
    }

    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      navigate(isEdit ? `/products/${id}` : '/products');
    }, 1500);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-lg mx-auto">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-center px-4 py-3 rounded-xl mb-5 text-sm">
          {isEdit ? 'Changes saved' : 'Product added'} — Redirecting...
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{isEdit ? 'Edit' : 'New product'}</p>
        <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {([
            { name: 'title', label: 'Title' },
            { name: 'image', label: 'Image URL' },
          ] as { name: keyof FormData; label: string }[]).map(({ name, label }) => (
            <div key={name}>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`w-full mt-1.5 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors[name] ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`w-full mt-1.5 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className={`w-full mt-1.5 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-colors">
              {saving ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save changes' : 'Add product')}
            </button>
            <button type="button" onClick={() => navigate(isEdit ? `/products/${id}` : '/products')} className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
