
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Define types
interface Admin {
  username: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  admin: Admin;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const initialAdmin: Admin = {
  username: '',
  isLoggedIn: false
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin>(() => {
    const saved = localStorage.getItem('admin');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing stored admin data', err);
        return initialAdmin;
      }
    }
    return initialAdmin;
  });

  const isAuthenticated = admin.isLoggedIn;

  // Save admin state to localStorage
  useEffect(() => {
    localStorage.setItem('admin', JSON.stringify(admin));
  }, [admin]);

  // This would usually validate against a backend
  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes, hardcode the admin credentials
    // In a real app, this would validate against a backend
    if (username === 'admin' && password === 'password') {
      setAdmin({ username, isLoggedIn: true });
      toast.success('Logged in successfully!');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setAdmin(initialAdmin);
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
