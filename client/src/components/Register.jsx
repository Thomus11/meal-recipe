import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';

function Register() {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null); // Tracks any errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset the error state

    try {
      const response = await axios.post('/api/register', form); // Send data to the backend
      alert(response.data.message); // Show a success message
      navigate('/login'); // Redirect to the login page on successful registration
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to register. Please try again.';
      setError(errorMessage); // Display error if registration fails
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Name"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={form.email || ''}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={form.password || ''}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className={styles.error}>{error}</p>} {/* Display errors if any */}
        <button className={styles.button} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
