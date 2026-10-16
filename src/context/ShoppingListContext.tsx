import { useEffect, useReducer, type ReactNode } from 'react';
import { readStoredValue } from '../hooks/useLocalStorage';
import type { Recipe, ShoppingListEntry } from '../types';
import { ShoppingListContext, type ShoppingListContextValue } from './shopping-list-context';

type ShoppingAction =
  | { type: 'add'; recipe: Recipe }
  | { type: 'toggle'; recipeId: number; itemIndex: number }
  | { type: 'remove'; recipeId: number }
  | { type: 'clear' };

function shoppingReducer(state: ShoppingListEntry[], action: ShoppingAction): ShoppingListEntry[] {
  switch (action.type) {
    case 'add': {
      if (state.some((entry) => entry.recipeId === action.recipe.id)) return state;
      return [...state, {
        recipeId: action.recipe.id,
        recipeName: action.recipe.name,
        items: action.recipe.ingredients.map((label) => ({ label, checked: false })),
      }];
    }
    case 'toggle':
      return state.map((entry) => entry.recipeId !== action.recipeId ? entry : {
        ...entry,
        items: entry.items.map((item, index) => index === action.itemIndex
          ? { ...item, checked: !item.checked }
          : item),
      });
    case 'remove':
      return state.filter((entry) => entry.recipeId !== action.recipeId);
    case 'clear':
      return [];
  }
}

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [entries, dispatch] = useReducer(
    shoppingReducer,
    undefined,
    () => readStoredValue<ShoppingListEntry[]>('mijote-shopping-list', []),
  );

  useEffect(() => {
    localStorage.setItem('mijote-shopping-list', JSON.stringify(entries));
  }, [entries]);

  const value: ShoppingListContextValue = {
    entries,
    addRecipe: (recipe) => dispatch({ type: 'add', recipe }),
    toggleItem: (recipeId, itemIndex) => dispatch({ type: 'toggle', recipeId, itemIndex }),
    removeRecipe: (recipeId) => dispatch({ type: 'remove', recipeId }),
    clearList: () => dispatch({ type: 'clear' }),
  };

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
}
