export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'appetizer' | 'dessert' | 'beverage';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  email?: string;
  image: string;
  accessToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface NewRecipe {
  name: string;
  cuisine: string;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  userId: number;
}

export interface ShoppingListEntry {
  recipeId: number;
  recipeName: string;
  items: { label: string; checked: boolean }[];
}