import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Favorites.module.css';

function Favorites({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  // Fetch favorites for the logged-in user
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`/api/favorites?user_id=${userId}`);
        setFavorites(response.data); // Update state with fetched favorites
      } catch (err) {
        setError('Failed to fetch favorites. Please try again later.');
      }
    };

    fetchFavorites();
  }, [userId]); // Dependency on userId ensures data is fetched when userId changes

  // Handle deletion of a favorite
  const handleDelete = async (favoriteId) => {
    try {
      await axios.delete(`/api/favorites/${favoriteId}`);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId)); // Remove favorite from the list
    } catch (err) {
      setError('Failed to delete favorite. Please try again later.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Favorites</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.favoritesGrid}>
        {favorites.map((favorite) => (
          <div key={favorite.id} className={styles.card}>
            <h3>{favorite.recipe.title}</h3>
            <img
              src={favorite.recipe.image_url}
              alt={favorite.recipe.title}
              className={styles.image}
            />
            <p><strong>Ingredients:</strong> {favorite.recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {favorite.recipe.instructions}</p>
            <button
              className={styles.button}
              onClick={() => handleDelete(favorite.id)}
            >
              Remove Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
