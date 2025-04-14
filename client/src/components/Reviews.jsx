import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Review.module.css';

function Review({ recipeId }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch reviews for the specific recipe
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/reviews?recipe_id=${recipeId}`);
        setReviews(response.data); // Update the reviews state
      } catch (err) {
        setError('Failed to fetch reviews. Please try again later.');
      }
    };

    fetchReviews();
  }, [recipeId]);

  // Handle form submission for adding a review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/reviews', {
        recipe_id: recipeId,
        user_id: 1, // Replace with the logged-in user's ID
        content: form.content,
        rating: form.rating,
      });
      setSuccess('Review added successfully!');
      setReviews([...reviews, response.data]); // Add the new review to the list
      setForm({}); // Clear the form
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to submit review.';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reviews</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <p><strong>User ID:</strong> {review.user_id}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p>{review.content}</p>
          </div>
        ))}
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Write your review..."
          value={form.content || ''}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        ></textarea>
        <select
          className={styles.input}
          value={form.rating || ''}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          required
        >
          <option value="">Select a Rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <button className={styles.button} type="submit">Submit Review</button>
      </form>
    </div>
  );
}

export default Review;
