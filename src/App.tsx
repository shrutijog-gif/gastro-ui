import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import ItemList from './pages/ItemList';
import RecipeDetail from './pages/RecipeDetail';
import DocumentRegistry from './pages/DocumentRegistry';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="items/:categoryId" element={<ItemList />} />
          <Route path="recipe/:recipeId" element={<RecipeDetail />} />
          <Route path="registry" element={<DocumentRegistry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
