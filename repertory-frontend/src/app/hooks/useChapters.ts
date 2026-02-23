import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useChapters() {
  return useQuery({
    queryKey: ['chapters'],
    queryFn:  api.chapters.list,
    staleTime: Infinity, // chapters never change at runtime
  });
}