import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import api from '../api/client';

interface User {
  id: number;
  username: string;
  role: string;
  employee_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!stored) {
      setLoading(false);
      return;
    }
    setToken(stored);
    api.defaults.headers.common.Authorization = `Bearer ${stored}`;
    api
      .get<{ user: User }>('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>('/api/auth/login', { username, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data && typeof (e.response.data as { error?: string }).error === 'string') {
        throw new Error((e.response.data as { error: string }).error);
      }
      throw new Error('Login failed');
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
