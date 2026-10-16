import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Cette page n'existe pas</p>
      <Link to="/" className="btn-back">Retour au catalogue</Link>
    </div>
  );
}