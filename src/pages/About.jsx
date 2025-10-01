import React from 'react';
import styles from '../App.module.css';

export default function About() {
  return (
    <div className={styles.pageContainer}>
      <h2>About This App</h2>
      <p>
        This Todo List app helps you manage tasks efficiently. You can add,
        edit, complete, and search todos — all synced with Airtable.
      </p>
      <p>
        It was built with React, uses the reducer pattern for state management,
        and demonstrates routing with React Router.
      </p>
      <p>
        Developed by <strong>Dayana Leyva</strong> as part of the Code the Dream
        React course.
      </p>
    </div>
  );
}
