import { useContext } from 'react';
import { ShoppingListContext } from '../context/shopping-list-context';

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) throw new Error('useShoppingList doit être utilisé dans ShoppingListProvider');
  return context;
}