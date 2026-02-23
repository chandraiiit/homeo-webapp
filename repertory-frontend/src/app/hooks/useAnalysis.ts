import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useAnalysis(rubricIds: number[], enabled: boolean) {
  return useQuery({
    queryKey: ['analysis', rubricIds],
    queryFn:  () => api.analysis.repertorize(rubricIds),
    enabled:  enabled && rubricIds.length > 0,
    staleTime: 0, // always refetch — case changes mean results must be fresh
  });
}