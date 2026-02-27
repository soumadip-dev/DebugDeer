import { useInfiniteQuery } from '@tanstack/react-query';
import type { RepositoriesResponse, RepositoriesQueryParams } from '../types/repository';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function fetchRepositories({
  page = 1,
  perPage = 10,
}: RepositoriesQueryParams): Promise<RepositoriesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });
  const response = await fetch(`${API_BASE_URL}/api/repo/repositories?${params}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch repositories' }));
    throw new Error(error.error || 'Failed to fetch repositories');
  }
  return response.json();
}

export function useRepositories(initialPerPage: number = 10) {
  return useInfiniteQuery({
    queryKey: ['repositories'],
    queryFn: ({ pageParam = 1 }) => fetchRepositories({ page: pageParam, perPage: initialPerPage }),
    getNextPageParam: lastPage => {
      // Check if we have less items than requested, meaning no more pages
      if (lastPage.data.length < initialPerPage) {
        return undefined;
      }
      // Next page is current page + 1
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
  });
}
