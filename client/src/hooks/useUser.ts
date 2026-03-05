import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  UserProfileResponse,
  UpdateUserProfileParams,
  UpdateUserProfileResponse,
} from '@/types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/api/settings/profile`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch user profile' }));
    throw new Error(error.error || 'Failed to fetch user profile');
  }

  return response.json();
}

async function updateUserProfile(
  params: UpdateUserProfileParams
): Promise<UpdateUserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/api/settings/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update user profile' }));
    throw new Error(error.error || 'Failed to update user profile');
  }

  return response.json();
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    select: data => data.data,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: data => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      }
    },
  });
}
