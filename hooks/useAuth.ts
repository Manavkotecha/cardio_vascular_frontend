// src/hooks/useAuth.ts - Authentication hook

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => api.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
      toast.success('Login successful!');
      router.push('/');
    },
    // onError: (error: any) => {
    //   toast.error(error.message || 'Login failed');
    // },
    onError: (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("Login failed");
  }
}

  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      localStorage.removeItem('token');
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      // Force logout even if API call fails
      localStorage.removeItem('token');
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      router.push('/login');
    },
  });

  const login = (email: string, password: string) => {
    return loginMutation.mutate({ email, password });
  };

  const logout = () => {
    return logoutMutation.mutate();
  };

  const isAuthenticated = !!user && !!localStorage.getItem('token');

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error,
  };
}