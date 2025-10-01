import React from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function TodosPage({
  todoList,
  isLoading,
  isSaving,
  errorMessage,
  onAddTodo,
  onCompleteTodo,
  onUpdateTodo,
  onClearError,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const totalTodos = todoList.length;
  const totalPages = Math.ceil(totalTodos / itemsPerPage);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;

  const currentTodos = todoList.slice(indexOfFirstTodo, indexOfLastTodo);

  function handlePreviousPage() {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  }

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <div className={styles.appContainer}>
      <h1>My Todo App</h1>

      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={currentTodos}
        isLoading={isLoading}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
      />

      <hr />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      <div className={styles.paginationControls}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p role="alert">Error: {todoState.errorMessage}</p>
          <button onClick={onClearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
