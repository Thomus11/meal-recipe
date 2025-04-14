import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Recipes.module.css';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes'); // Flask endpoint
        setRecipes(response.data); 
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
      }
    };

    fetchRecipes();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recipes</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.recipesGrid}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className={styles.recipeCard}>
            <img src={recipe.image_url} alt={recipe.title} className={styles.recipeImage} />
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;
