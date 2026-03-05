import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { ConnectRepositoryParams } from '@/types/repository';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function connectRepository(params: ConnectRepositoryParams) {
  const response = await fetch(`${API_BASE_URL}/api/repo/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to connect repository' }));
    throw new Error(error.error || 'Failed to connect repository');
  }

  return response.json();
}

export function useConnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast.success('Repository connected successfully');
    },
    onError: error => {
      toast.error('Failed to connect repository');
      console.log(error);
    },
  });
}
