import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Search.module.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.get(`/api/recipes?query=${query}`);

      setResults(response.data); // Update results with the response data
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch search results.';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search for a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.results}>
        {results.map((recipe) => (
          <div key={recipe.id} className={styles.card}>
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
