import { useState, type FormEvent } from 'react';
import { createRecipe } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Difficulty, NewRecipe } from '../types';

type RecipeForm = Omit<NewRecipe, 'userId'> & { ingredientsText: string; instructionsText: string };
type RecipeErrors = Partial<Record<keyof RecipeForm, string>>;
const initialForm: RecipeForm = { name: '', cuisine: '', difficulty: 'Easy', prepTimeMinutes: 15, servings: 2, ingredients: [], instructions: [], ingredientsText: '', instructionsText: '' };

function validateRecipe(form: RecipeForm): RecipeErrors {
  const errors: RecipeErrors = {};
  if (form.name.trim().length < 3) errors.name = 'Le nom doit contenir au moins 3 caractères.';
  if (!form.cuisine.trim()) errors.cuisine = 'Indiquez une cuisine.';
  if (form.prepTimeMinutes < 1) errors.prepTimeMinutes = 'La durée doit être supérieure à 0.';
  if (form.servings < 1) errors.servings = 'Indiquez au moins une portion.';
  if (!form.ingredientsText.split('\n').some((line) => line.trim())) errors.ingredientsText = 'Ajoutez au moins un ingrédient.';
  if (!form.instructionsText.split('\n').some((line) => line.trim())) errors.instructionsText = 'Ajoutez au moins une instruction.';
  return errors;
}

export function NewRecipePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState<Partial<Record<keyof RecipeForm, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ message: string; success: boolean } | null>(null);
  const errors = validateRecipe(form);
  const hasErrors = Object.keys(errors).length > 0;
  const update = <K extends keyof RecipeForm>(field: K, value: RecipeForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const fieldError = (field: keyof RecipeForm) => (touched[field] || submitted) ? errors[field] : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitted(true); setNotice(null);
    if (hasErrors) return;
    setSaving(true);
    const payload: NewRecipe = { name: form.name.trim(), cuisine: form.cuisine.trim(), difficulty: form.difficulty, prepTimeMinutes: form.prepTimeMinutes, servings: form.servings,
      ingredients: form.ingredientsText.split('\n').map((line) => line.trim()).filter(Boolean), instructions: form.instructionsText.split('\n').map((line) => line.trim()).filter(Boolean), userId: user?.id ?? 1 };
    try {
      await createRecipe(payload); setForm(initialForm); setTouched({}); setSubmitted(false);
      setNotice({ message: 'Votre recette a bien été envoyée. Merci de contribuer à MIJOTÉ !', success: true });
    } catch { setNotice({ message: 'L’envoi a échoué. Vérifiez votre connexion puis réessayez.', success: false }); }
    finally { setSaving(false); }
  };

  return <section className="new-recipe-page page-shell"><div className="page-heading"><div><p className="eyebrow">À vous de jouer</p><h2>Proposer une recette</h2></div></div>
    <form className="recipe-form" onSubmit={handleSubmit} noValidate><div className="form-grid">
      <label className="form-field form-field-wide"><span>Nom de la recette</span><input value={form.name} onBlur={() => setTouched((current) => ({ ...current, name: true }))} onChange={(event) => update('name', event.target.value)} aria-invalid={!!fieldError('name')} aria-describedby={fieldError('name') ? 'error-name' : undefined} />{fieldError('name') && <small id="error-name" className="form-error">{fieldError('name')}</small>}</label>
      <label className="form-field"><span>Type de cuisine</span><input value={form.cuisine} onBlur={() => setTouched((current) => ({ ...current, cuisine: true }))} onChange={(event) => update('cuisine', event.target.value)} aria-invalid={!!fieldError('cuisine')} aria-describedby={fieldError('cuisine') ? 'error-cuisine' : undefined} />{fieldError('cuisine') && <small id="error-cuisine" className="form-error">{fieldError('cuisine')}</small>}</label>
      <label className="form-field"><span>Difficulté</span><select value={form.difficulty} onChange={(event) => update('difficulty', event.target.value as Difficulty)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
      <label className="form-field"><span>Préparation (minutes)</span><input type="number" min="1" value={form.prepTimeMinutes} onBlur={() => setTouched((current) => ({ ...current, prepTimeMinutes: true }))} onChange={(event) => update('prepTimeMinutes', Number(event.target.value))} aria-invalid={!!fieldError('prepTimeMinutes')} aria-describedby={fieldError('prepTimeMinutes') ? 'error-prep' : undefined} />{fieldError('prepTimeMinutes') && <small id="error-prep" className="form-error">{fieldError('prepTimeMinutes')}</small>}</label>
      <label className="form-field"><span>Nombre de portions</span><input type="number" min="1" value={form.servings} onBlur={() => setTouched((current) => ({ ...current, servings: true }))} onChange={(event) => update('servings', Number(event.target.value))} aria-invalid={!!fieldError('servings')} aria-describedby={fieldError('servings') ? 'error-servings' : undefined} />{fieldError('servings') && <small id="error-servings" className="form-error">{fieldError('servings')}</small>}</label>
      <label className="form-field"><span>Ingrédients</span><textarea rows={6} value={form.ingredientsText} onBlur={() => setTouched((current) => ({ ...current, ingredientsText: true }))} onChange={(event) => update('ingredientsText', event.target.value)} aria-invalid={!!fieldError('ingredientsText')} aria-describedby={fieldError('ingredientsText') ? 'error-ingredients' : undefined} placeholder={'Farine\nŒufs\nLait'} />{fieldError('ingredientsText') && <small id="error-ingredients" className="form-error">{fieldError('ingredientsText')}</small>}</label>
      <label className="form-field"><span>Instructions</span><textarea rows={6} value={form.instructionsText} onBlur={() => setTouched((current) => ({ ...current, instructionsText: true }))} onChange={(event) => update('instructionsText', event.target.value)} aria-invalid={!!fieldError('instructionsText')} aria-describedby={fieldError('instructionsText') ? 'error-instructions' : undefined} placeholder={'Mélanger les ingrédients.\nFaire cuire.'} />{fieldError('instructionsText') && <small id="error-instructions" className="form-error">{fieldError('instructionsText')}</small>}</label>
    </div>{notice && <p className={notice.success ? 'form-success' : 'form-error'} role="status">{notice.message}</p>}<div className="form-actions"><button className="button button-primary" disabled={saving || hasErrors}>{saving ? 'Envoi…' : 'Envoyer ma recette'}</button></div></form>
  </section>;
}