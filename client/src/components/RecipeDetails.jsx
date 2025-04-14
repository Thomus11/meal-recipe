import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/RecipeDetail.module.css';

function RecipeDetail() {
  const { id } = useParams(); // Extract the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
 // Fetch recipe by ID
        setRecipe(response.data); // Store recipe details in state
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again later.');
      }
    };

    fetchRecipe();
  }, [id]); // Dependency array ensures this runs when the `id` changes

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{recipe.title}</h2>
      <img src={recipe.image_url} alt={recipe.title} className={styles.image} />
      <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
      <p><strong>Instructions:</strong> {recipe.instructions}</p>
    </div>
  );
}

export default RecipeDetail;
