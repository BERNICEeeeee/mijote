import type { ReactNode } from 'react';
import { login as loginRequest } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AuthContext } from './auth-context';
import type { AuthUser, LoginCredentials } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<AuthUser | null>('mijote-user', null);

  const login = async (credentials: LoginCredentials) => {
    const authenticatedUser = await loginRequest(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}