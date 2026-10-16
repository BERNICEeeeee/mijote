import { Link } from 'react-router';
import type { Recipe } from '../types';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return <Link className="recipe-card" to={`/recettes/${recipe.id}`}><div className="recipe-card-image"><img src={recipe.image} alt="" loading="lazy" /><span className="recipe-card-rating">★ {recipe.rating.toFixed(1)}</span></div>
    <div className="recipe-card-body"><p className="recipe-card-cuisine">{recipe.cuisine} · {recipe.difficulty}</p><h3>{recipe.name}</h3><div className="recipe-card-meta"><span>◷ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span><span>{recipe.reviewCount} avis</span></div></div></Link>;
}