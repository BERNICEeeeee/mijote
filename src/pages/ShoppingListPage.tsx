import { Link } from 'react-router';
import { useShoppingList } from '../hooks/useShoppingList';
import { EmptyState } from '../components/EmptyState';

export function ShoppingListPage() {
  const { entries, toggleItem, removeRecipe, clearList } = useShoppingList();
  const checked = entries.reduce((sum, entry) => sum + entry.items.filter((item) => item.checked).length, 0);
  const total = entries.reduce((sum, entry) => sum + entry.items.length, 0);
  return (
    <section className="shopping-page page-shell"><div className="page-heading"><div><p className="eyebrow">Tout ce qu’il vous faut</p><h2>Ma liste de courses</h2></div>{entries.length > 0 && <button className="button button-quiet" type="button" onClick={clearList}>Vider la liste</button>}</div>
      {entries.length === 0 ? <div className="shopping-empty"><EmptyState message="Votre liste est encore vide." /><Link className="button button-primary" to="/">Découvrir les recettes</Link></div> : <>
        <p className="shopping-summary"><strong>{entries.length} recette{entries.length > 1 ? 's' : ''}</strong><span>{checked} ingrédient{checked > 1 ? 's' : ''} coché{checked > 1 ? 's' : ''} sur {total}</span></p>
        <div className="shopping-groups">{entries.map((entry) => <section className="shopping-group" key={entry.recipeId}><div className="shopping-group-heading"><h3>{entry.recipeName}</h3><button className="text-button" type="button" onClick={() => removeRecipe(entry.recipeId)}>Retirer</button></div>
          <ul className="shopping-items">{entry.items.map((item, index) => <li key={`${entry.recipeId}-${index}`}><label className={item.checked ? 'shopping-item is-checked' : 'shopping-item'}><input type="checkbox" checked={item.checked} onChange={() => toggleItem(entry.recipeId, index)} /><span>{item.label}</span></label></li>)}</ul>
        </section>)}</div>
      </>}</section>
  );
}