import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Recipes from './components/Recipes';
import RecipeDetails from './components/RecipeDetails';
import Reviews from './components/Reviews';
import Favorites from './components/Favorites';
import NewRecipe from './components/NewRecipe';
import Search from './components/Search'; 

function App() {
  return (
    <Router>
      <Navbar /> {/* Always visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipes/new" element={<NewRecipe />} />
        <Route path="/search" element={<Search />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;
