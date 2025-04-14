import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/NewRecipe.module.css';

function NewRecipe() {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    try {
      const response = await axios.post('/api/recipes', form); // POST to backend
      setSuccess('Recipe added successfully!');
      setForm({}); // Reset form after submission
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add recipe.';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add a New Recipe</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Recipe Title"
          value={form.title || ''}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Ingredients"
          value={form.ingredients || ''}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          required
        ></textarea>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Instructions"
          value={form.instructions || ''}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          required
        ></textarea>
        <input
          className={styles.input}
          type="url"
          placeholder="Image URL"
          value={form.image_url || ''}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <button className={styles.button} type="submit">
          Submit Recipe
        </button>
      </form>
    </div>
  );
}

export default NewRecipe;
