import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  roles: string[];
  provider: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        setIsLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { accessToken, refreshToken, user: userData } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};