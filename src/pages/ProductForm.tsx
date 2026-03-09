import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getProductById, addProduct, updateProduct, getCategories } from '../services/api';
import { useToast } from '../context/ToastContext';
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
  const { addToast } = useToast();

  const [form, setForm] = useState<FormData>({ title: '', description: '', category: '', price: '', image: '' });
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

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
      addToast('Product updated successfully!', 'success');
    } else {
      await addProduct(payload);
      addToast('Product added successfully!', 'success');
    }

    setSaving(false);
    navigate(isEdit ? `/products/${id}` : '/products');
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{isEdit ? 'Edit' : 'New product'}</p>
        <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              { name: 'title', label: 'Title' },
              { name: 'category', label: 'Category', type: 'select' },
            ] as { name: keyof FormData; label: string; type?: string }[]).map(({ name, label, type }) => (
              <div key={name}>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">{label}</label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors[name] ? 'border-red-300 bg-red-50' : 'border-slate-200'
                      }`}
                  />
                )}
                {errors[name] && <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Price (USD)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${errors.image ? 'border-red-300 bg-red-50' : 'border-slate-200'
                  }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && <p className="text-red-500 text-xs mt-1.5">{errors.image}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'
                }`}
              placeholder="Enter a detailed product description..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-colors shadow-sm">
              {saving ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save changes' : 'Add product')}
            </button>
            <button type="button" onClick={() => navigate(isEdit ? `/products/${id}` : '/products')} className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 cursor-pointer transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
