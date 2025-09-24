import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import TodosViewForm from './features/TodosViewForm';
import styles from './App.module.css';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [todoList, setTodoList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",{title})`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        // Simulación de error para probar mensaje de error y CSS
        // throw new Error('Simulated error for testing');

        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(resp.statusText || `HTTP ${resp.status}`);
        }
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (err) {
        dispatch({
          type: todoActions.setLoadError,
          error: err,
        });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString, encodeUrl]);

  //adding new todo to Airtable
  async function addTodo(title) {
    const newTodo = { title, isCompleted: false };

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
    } catch (err) {
      dispatch({
        type: todoActions.setLoadError,
        error: err,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  //Complete Todo
  async function completeTodo(id) {
    const original = todoState.todoList.find((t) => t.id === id);
    dispatch({ type: todoActions.completeTodo, id });

    const payload = {
      records: [
        {
          id,
          fields: { isCompleted: true },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
    } catch (err) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: original,
        error: new Error(
          (err.message || 'Failed to complete todo') + '. Reverting todo...'
        ),
      });
    }
  }

  async function updateTodo(editedTodo) {
    const original = todoState.todoList.find((t) => t.id === editedTodo.id);

    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
    } catch (err) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: original,
        error: new Error(
          (err.message || 'Failed to update todo') + '. Reverting todo...'
        ),
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  return (
    <div className={styles.appContainer}>
      <h1>My Todo App</h1>

      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      <TodoList
        todoList={todoState.todoList}
        isLoading={todoState.isLoading}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
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

      {todoState.errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p role="alert">Error: {todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
