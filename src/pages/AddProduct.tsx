import { Link } from 'react-router';

export const AddProduct = () => {
  return (
    <div>
      <Link to="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="bg-white p-6 rounded shadow-md max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">Add New Product</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Product Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded" placeholder="Enter product name" />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea className="w-full px-4 py-2 border rounded" placeholder="Enter product description"></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Price</label>
            <input type="number" className="w-full px-4 py-2 border rounded" placeholder="Enter price" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Add Product
            </button>
            <Link to="/" className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
