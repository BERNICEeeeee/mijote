import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loader } from '../components/Loader';
import { RecipeCard } from '../components/RecipeCard';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { searchRecipes } from '../services/api';
import type { MealType } from '../types';

const mealTypes: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Petit-déjeuner' }, { value: 'lunch', label: 'Déjeuner' },
  { value: 'dinner', label: 'Dîner' }, { value: 'appetizer', label: 'Entrée' },
  { value: 'dessert', label: 'Dessert' }, { value: 'beverage', label: 'Boisson' },
];
type SortOption = 'relevance' | 'rating' | 'time' | 'name';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [meal, setMeal] = useState(searchParams.get('repas') ?? '');
  const [sort, setSort] = useState<SortOption>((searchParams.get('tri') as SortOption) ?? 'relevance');
  const debouncedQuery = useDebounce(query, 400);
  const loadRecipes = useCallback((signal: AbortSignal) => searchRecipes(debouncedQuery, signal), [debouncedQuery]);
  const { data, loading, error, reload } = useFetch(loadRecipes, [debouncedQuery]);

  const recipes = useMemo(() => {
    const filtered = (data?.recipes ?? []).filter((recipe) => !meal || recipe.mealType.some((type) => type.toLowerCase() === meal));
    switch (sort) {
      case 'rating': return [...filtered].sort((a, b) => b.rating - a.rating);
      case 'time': return [...filtered].sort((a, b) => (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes));
      case 'name': return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default: return filtered;
    }
  }, [data, meal, sort]);

  const updateParams = (nextQuery: string, nextMeal: string, nextSort: SortOption) => {
    const params = new URLSearchParams();
    if (nextQuery) params.set('q', nextQuery);
    if (nextMeal) params.set('repas', nextMeal);
    if (nextSort !== 'relevance') params.set('tri', nextSort);
    setSearchParams(params, { replace: true });
  };
  const handleQueryChange = (value: string) => { setQuery(value); updateParams(value, meal, sort); };
  const handleMealChange = (value: string) => { setMeal(value); updateParams(query, value, sort); };
  const handleSortChange = (value: SortOption) => { setSort(value); updateParams(query, meal, value); };

  return (
    <section className="catalog-page page-shell">
      <div className="page-heading"><div><p className="eyebrow">La cuisine, sans prise de tête</p><h2>Qu’est-ce qu’on mange ?</h2></div><p className="heading-note">Des idées simples pour vos prochains repas.</p></div>
      <div className="catalog-tools" aria-label="Recherche et filtres des recettes">
        <label className="search-field"><span className="sr-only">Rechercher une recette</span><span className="search-icon" aria-hidden="true">⌕</span><input value={query} onChange={(event) => handleQueryChange(event.target.value)} placeholder="Rechercher une recette…" /></label>
        <label className="select-field"><span>Type de repas</span><select value={meal} onChange={(event) => handleMealChange(event.target.value)}><option value="">Tous les repas</option>{mealTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
        <label className="select-field"><span>Trier par</span><select value={sort} onChange={(event) => handleSortChange(event.target.value as SortOption)}><option value="relevance">Pertinence</option><option value="rating">Meilleures notes</option><option value="time">Temps total croissant</option><option value="name">Nom, A à Z</option></select></label>
      </div>
      <div className="results-heading"><span>{loading ? 'Recherche…' : `${recipes.length} recette${recipes.length > 1 ? 's' : ''}`}</span><span className="results-caption">À vous de mijoter</span></div>
      {loading && <Loader />}
      {!loading && error && <ErrorMessage message="Impossible de charger les recettes pour le moment." onRetry={reload} />}
      {!loading && !error && recipes.length === 0 && <EmptyState message="Aucune recette ne correspond à votre recherche." />}
      {!loading && !error && recipes.length > 0 && <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>}
    </section>
  );
}