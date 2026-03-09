import { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const addToast = (message: string, type: ToastType = 'success') => {
    if (type === 'error') toast.error(message);
    else if (type === 'info') toast.info(message);
    else toast.success(message);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer position="bottom-right" hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext)!;
