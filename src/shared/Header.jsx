import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css'; // ✅ Usa CSS Modules

export default function Header({ title }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
