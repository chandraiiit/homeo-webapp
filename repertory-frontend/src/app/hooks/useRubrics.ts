import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './useDebounce';
import { api } from '../services/api';

export function useRubrics(
  chapterId?: number,
  search?: string,
  page = 1,
  limit = 20,
) {
  const debouncedSearch = useDebouncedValue(search ?? '', 300);

  return useQuery({
    queryKey: ['rubrics', chapterId, debouncedSearch, page, limit],
    queryFn: () =>
      api.rubrics.search({
        chapterId,
        search:    debouncedSearch || undefined,
        page,
        limit,
      }),
    placeholderData: (prev) => prev, // keeps old results visible while fetching new page
    enabled: chapterId !== undefined,
  });
}