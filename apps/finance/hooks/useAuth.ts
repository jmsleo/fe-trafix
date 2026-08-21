'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMe, login as loginRequest, logout as logoutRequest } from '@/lib/api/auth';
import { tokenStorage } from '@/lib/api/client';
import type { LoginRequest, UserRead } from '@/lib/api/types';

export const authKeys = {
  all: ['auth'] as const,
  me: ['auth', 'me'] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginRequest(data),
    onSuccess: (tokens) => {
      tokenStorage.setTokens(tokens);
      queryClient.setQueryData<UserRead | undefined>(authKeys.me, undefined);
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = tokenStorage.getRefreshToken();
      const accessToken = tokenStorage.getAccessToken();
      if (!refreshToken) return Promise.resolve();
      return logoutRequest({
        refresh_token: refreshToken,
        access_token: accessToken,
      });
    },
    onSettled: () => {
      tokenStorage.clearTokens();
      queryClient.clear();
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    enabled: typeof window !== 'undefined' && !!tokenStorage.getAccessToken(),
    retry: false,
  });
}

export function useAuthEvents(onUnauthorized: () => void) {
  useEffect(() => {
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, [onUnauthorized]);
}
