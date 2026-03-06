import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  RepositoriesResponse,
  RepositoriesQueryParams,
  ConnectedRepositoriesResponse,
  ConnectedRepository,
  DisconnectRepositoryResponse,
  DisconnectAllRepositoriesResponse,
  ConnectRepositoryParams,
} from '../types/repository';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

//* Connect Repository function
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

//* Fetch repositories function
async function fetchRepositories({
  page = 1,
  perPage = 10,
}: RepositoriesQueryParams): Promise<RepositoriesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });
  const response = await fetch(`${API_BASE_URL}/api/repo/?${params}`, {
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

//* Fetch connected repositories function
async function fetchConnectedRepositories(): Promise<ConnectedRepositoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/settings/repositories`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to fetch connected repositories' }));
    throw new Error(error.error || 'Failed to fetch connected repositories');
  }

  return response.json();
}

//* Disconnect a single repository function
async function disconnectRepository(repositoryId: string): Promise<DisconnectRepositoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/settings/repositories/${repositoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to disconnect repository' }));
    throw new Error(error.error || 'Failed to disconnect repository');
  }

  return response.json();
}

//* Disconnect all repositories function
async function disconnectAllRepositories(): Promise<DisconnectAllRepositoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/settings/repositories`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Failed to disconnect all repositories' }));
    throw new Error(error.error || 'Failed to disconnect all repositories');
  }

  return response.json();
}

//* Hook to connect repositories
export function useConnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['connected-repositories'] });
      toast.success('Repository connected successfully');
    },
    onError: error => {
      toast.error('Failed to connect repository');
      console.log(error);
    },
  });
}

//* Hook to fetch repositories
export function useRepositories(initialPerPage: number = 10) {
  return useInfiniteQuery({
    queryKey: ['repositories'],
    queryFn: ({ pageParam = 1 }) => fetchRepositories({ page: pageParam, perPage: initialPerPage }),
    getNextPageParam: lastPage => {
      if (lastPage.data.length < initialPerPage) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
  });
}

//* Hook to fetch connected repositories
export function useConnectedRepositories() {
  return useQuery({
    queryKey: ['connected-repositories'],
    queryFn: fetchConnectedRepositories,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    select: (data): ConnectedRepository[] => data.data,
  });
}

//* Hook to disconnect a single repository
export function useDisconnectRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectRepository,
    onSuccess: data => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ['connected-repositories'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        toast.success('Repository disconnected successfully');
      } else {
        toast.error('Failed to disconnect repository');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to disconnect repository');
    },
  });
}

//* Hook to disconnect all repositories
export function useDisconnectAllRepositories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectAllRepositories,
    onSuccess: data => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ['connected-repositories'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        toast.success(data.message || 'All repositories disconnected successfully');
      } else {
        toast.error('Failed to disconnect repositories');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to disconnect repositories');
    },
  });
}
