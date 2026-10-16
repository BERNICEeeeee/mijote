import type { Recipe, RecipeSearchResponse, LoginCredentials, AuthUser, NewRecipe } from '../types';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: unknown = await response.json().catch(() => ({}));
    const message = typeof errorData === 'object' && errorData !== null && 'message' in errorData
      ? String(errorData.message)
      : `Erreur HTTP ${response.status}`;
    throw new ApiError(
      response.status,
      message,
    );
  }
  return response.json() as Promise<T>;
}

export const searchRecipes = async (query: string, signal?: AbortSignal): Promise<RecipeSearchResponse> => {
  const response = await fetch(`${BASE_URL}/recipes/search?q=${encodeURIComponent(query)}&limit=0`, { signal });
  return handleResponse<RecipeSearchResponse>(response);
};

export const getRecipeById = async (id: string | number, signal?: AbortSignal): Promise<Recipe> => {
  const response = await fetch(`${BASE_URL}/recipes/${id}`, { signal });
  return handleResponse<Recipe>(response);
};

export const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse<AuthUser>(response);
};

export const createRecipe = async (payload: NewRecipe): Promise<Recipe> => {
  const response = await fetch(`${BASE_URL}/recipes/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Recipe>(response);
};