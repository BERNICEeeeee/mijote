import { NavLink, Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useShoppingList } from '../hooks/useShoppingList';

export function Header() {
  const { user, logout } = useAuth();
  const { entries } = useShoppingList();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-brand">
        <Link to="/" className="logo-link">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span className="brand-name">mijoté<span>.</span></span>
        </Link>
      </div>

      <nav className="header-nav">
        {/* En vue bureau (>= 1024px), on affiche aussi Catalogue et Proposer une recette */}
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Catalogue
        </NavLink>

        <NavLink to="/proposer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Proposer une recette
        </NavLink>

        <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active courses-link' : 'nav-link courses-link'}>
          Courses <span className="badge">{entries.length}</span>
        </NavLink>

        {user ? <div className="header-user">
          <img src={user.image} alt="" />
          <span className="header-user-name">{user.firstName}</span>
          <button type="button" className="btn-login" onClick={handleLogout}>Déconnexion</button>
        </div> : <Link to="/connexion" className="btn-login">Se connecter</Link>}
      </nav>
    </header>
  );
}