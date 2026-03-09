import { Navigate, Routes, Route } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductsList from './pages/ProductsList';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Logged-in users */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductsList /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/products/new" element={<AdminRoute><ProductForm /></AdminRoute>} />
          <Route path="/products/:id/edit" element={<AdminRoute><ProductForm /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;