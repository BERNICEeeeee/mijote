import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { CatalogPage } from './pages/CatalogPage';
import { RecipePage } from './pages/RecipePage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { LoginPage } from './pages/LoginPage';
import { NewRecipePage } from './pages/NewRecipePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import { ShoppingListProvider } from './context/ShoppingListContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <ShoppingListProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<CatalogPage />} />
              <Route path="recettes/:id" element={<RecipePage />} />
              <Route path="courses" element={<ShoppingListPage />} />
              <Route path="connexion" element={<LoginPage />} />
              <Route path="proposer" element={<ProtectedRoute><NewRecipePage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ShoppingListProvider>
    </AuthProvider>
  );
}

export default App;