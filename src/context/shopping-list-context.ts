import { createContext } from 'react';
import type { Recipe, ShoppingListEntry } from '../types';

export interface ShoppingListContextValue {
  entries: ShoppingListEntry[];
  addRecipe: (recipe: Recipe) => void;
  toggleItem: (recipeId: number, itemIndex: number) => void;
  removeRecipe: (recipeId: number) => void;
  clearList: () => void;
}

export const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);