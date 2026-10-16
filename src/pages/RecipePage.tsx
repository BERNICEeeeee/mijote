import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { ApiError, getRecipeById } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useShoppingList } from '../hooks/useShoppingList';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loader } from '../components/Loader';

export function RecipePage() {
  const { id = '' } = useParams<{ id: string }>();
  const loadRecipe = useCallback((signal: AbortSignal) => getRecipeById(id, signal), [id]);
  const { data: recipe, loading, error, reload } = useFetch(loadRecipe, [id]);
  const { entries, addRecipe } = useShoppingList();
  const alreadyAdded = entries.some((entry) => entry.recipeId === recipe?.id);

  if (loading) return <section className="page-shell"><Loader /></section>;
  if (error instanceof ApiError && error.status === 404) return <section className="page-shell"><EmptyState message="Recette introuvable." /><Link className="text-link" to="/">Retour au catalogue</Link></section>;
  if (error) return <section className="page-shell"><ErrorMessage message="Impossible de charger cette recette." onRetry={reload} /></section>;
  if (!recipe) return null;

  return (
    <article className="recipe-detail page-shell">
      <Link className="back-link" to="/">← Retour au catalogue</Link>
      <div className="recipe-detail-hero"><img src={recipe.image} alt={recipe.name} /><div className="recipe-detail-intro">
        <p className="eyebrow">{recipe.cuisine} · {recipe.difficulty}</p><h2>{recipe.name}</h2>
        <p className="recipe-rating"><span aria-label={`${recipe.rating} sur 5`}>★ {recipe.rating.toFixed(1)}</span> · {recipe.reviewCount} avis</p>
        <div className="recipe-stats"><div><strong>{recipe.prepTimeMinutes} min</strong><span>Préparation</span></div><div><strong>{recipe.cookTimeMinutes} min</strong><span>Cuisson</span></div><div><strong>{recipe.servings}</strong><span>Portions</span></div></div>
        <button className="button button-primary add-to-list" type="button" onClick={() => addRecipe(recipe)} disabled={alreadyAdded}>{alreadyAdded ? '✓ Déjà dans ma liste' : '＋ Ajouter les ingrédients à ma liste'}</button>
      </div></div>
      <div className="recipe-content-grid"><section className="recipe-section"><p className="eyebrow">À préparer</p><h3>Ingrédients</h3><ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul></section>
        <section className="recipe-section"><p className="eyebrow">Pas à pas</p><h3>Instructions</h3><ol className="instruction-list">{recipe.instructions.map((instruction, index) => <li key={`${instruction}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{instruction}</li>)}</ol></section></div>
    </article>
  );
}