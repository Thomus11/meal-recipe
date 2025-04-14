import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/reviews">Reviews</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/recipes">Recipes</Link>
      <Link to="/recipes/new">Add Recipe</Link>
    </nav>
  );
}

export default Navbar;
