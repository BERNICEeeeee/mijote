import { createContext } from 'react';
import type { AuthUser, LoginCredentials } from '../types';

export interface AuthContextValue {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);