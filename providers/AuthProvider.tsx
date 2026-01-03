// src/providers/AuthProvider.tsx - Authentication context provider

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '../types';
import { api } from '../lib/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';

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
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle redirect in useEffect to avoid setState during render
  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/login');
    }
  }, [isLoading, user, isLoginPage, router]);

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

  // Show loader while checking auth or redirecting
  if (isLoading || (!user && !isLoginPage)) {
    return <PageLoader />;
  }

  // Show login page without layout
  if (isLoginPage) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  // Show main app with layout
  return (
    <AuthContext.Provider value={value}>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="pt-16 lg:pt-0">{children}</div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
