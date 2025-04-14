import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axios.post('/api/login', form); // POST request to back-end
      alert(response.data.message); // Display welcome message from server
      navigate('/dashboard'); // Redirect to dashboard or other page after successful login
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage); // Set error message
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        {error && <p className={styles.error}>{error}</p>} {/* Display error if any */}
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
