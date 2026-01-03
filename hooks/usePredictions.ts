// src/hooks/usePredictions.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { PredictionInput, HistoryFilters } from '../types';
import toast from 'react-hot-toast';

export function usePredictions(filters?: HistoryFilters) {
  const queryClient = useQueryClient();

  const {
    data: predictions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['predictions', filters],
    queryFn: () => api.getPredictionHistory(filters),
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (input: PredictionInput) => api.createPrediction(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Risk assessment completed!');
      return data;
    },
    // onError: (error: any) => {
    //   toast.error(error.message || 'Failed to create prediction');
    // },
    onError: (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Failed to create prediction');
  }
}

  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePrediction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Prediction deleted successfully');
    },
    // onError: (error: any) => {
    //   toast.error(error.message || 'Failed to delete prediction');
    // },
    onError: (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Failed to delete prediction');
  }
}

  });

  const useGetPrediction = (id: string) => {
    return useQuery({
      queryKey: ['prediction', id],
      queryFn: () => api.getPrediction(id),
      enabled: !!id,
    });
  };

  const createPrediction = (input: PredictionInput) => {
    return createMutation.mutateAsync(input);
  };

  const deletePrediction = (id: string) => {
    return deleteMutation.mutate(id);
  };

  return {
    predictions,
    isLoading,
    error,
    createPrediction,
    deletePrediction,
    useGetPrediction,
    refetch,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}