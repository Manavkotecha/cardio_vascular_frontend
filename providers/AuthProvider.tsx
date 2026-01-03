// src/providers/AuthProvider.tsx - Authentication context provider

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types';
import { api } from '../lib/api';
import { PageLoader } from '../components/ui/LoadingSpinner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      if (pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    localStorage.setItem('token', result.token);
    setUser(result.user);
    router.push('/');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  if (isLoading) {
    return <PageLoader />;
  }

  // Redirect to login if not authenticated (except on login page)
  if (!user && pathname !== '/login' && !isLoading) {
    router.push('/login');
    return <PageLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}