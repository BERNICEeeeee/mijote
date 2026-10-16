import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setSubmitting(true);
    try {
      await login({ username, password });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';
      navigate(from, { replace: true });
    } catch { setError('Identifiants incorrects. Vérifiez votre nom d’utilisateur et votre mot de passe.'); }
    finally { setSubmitting(false); }
  };
  return <section className="auth-page page-shell"><div className="auth-panel"><p className="eyebrow">Ravi de vous revoir</p><h2>Connexion</h2><p className="auth-intro">Connectez-vous pour proposer votre prochaine recette.</p>
    <form className="form-stack" onSubmit={handleSubmit}><label className="form-field"><span>Nom d’utilisateur</span><input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label><label className="form-field"><span>Mot de passe</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={submitting}>{submitting ? 'Connexion…' : 'Se connecter'}</button></form>
    <p className="auth-footnote">Pas encore de compte ? <Link to="/">Explorez les recettes</Link></p></div></section>;
}