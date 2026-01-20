import { createAuthClient } from 'better-auth/react';

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  parsist: true,
});
