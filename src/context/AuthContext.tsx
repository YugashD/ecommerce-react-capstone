import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  role: string;
  login: (token: string, role: string) => void;
  logout: (clearCart?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');

  const isLoggedIn = !!token;

  const login = (receivedToken: string, chosenRole: string) => {
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('role', chosenRole);
    setToken(receivedToken);
    setRole(chosenRole);
  };

  const logout = (clearCart?: () => void) => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('easybuy_cart');
    setToken(null);
    setRole('user');
    if (clearCart) clearCart();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
