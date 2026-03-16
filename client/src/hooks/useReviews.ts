import { useQuery } from '@tanstack/react-query';
import type { Review } from '../types/review';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function fetchReviews() {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch reviews' }));
    throw new Error(error.error || 'Failed to fetch reviews');
  }

  return response.json();
}

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    select: (data): Review[] => data.data,
  });
}
