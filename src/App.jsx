import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState, useEffect } from 'react';
import TodosViewForm from './features/TodosViewForm';

function App() {
  const [todoList, setTodoList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = ({ sortField, sortDirection, queryString }) => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        const resp = await fetch(
          encodeUrl({ sortField, sortDirection, queryString }),
          options
        );
        if (!resp.ok) {
          throw new Error(resp.statusText || `HTTP ${resp.status}`);
        }
        const { records } = await resp.json();
        const fetched = records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(fetched);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load todos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [sortField, sortDirection, queryString]);

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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
      const { records } = await resp.json();
      const saved = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!saved.isCompleted) saved.isCompleted = false;
      setTodoList([...todoList, saved]);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save todo');
    } finally {
      setIsSaving(false);
    }
  }

  //Complete Todo
  async function completeTodo(id) {
    const original = todoList.find((t) => t.id === id);
    const optimistic = todoList.map((t) =>
      t.id === id ? { ...t, isCompleted: true } : t
    );
    setTodoList(optimistic);

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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        (err.message || 'Failed to complete todo') + '. Reverting todo...'
      );
      const reverted = todoList.map((t) => (t.id === id ? original : t));
      setTodoList(reverted);
    }
  }

  async function updateTodo(editedTodo) {
    const original = todoList.find((t) => t.id === editedTodo.id);

    const optimistic = todoList.map((t) =>
      t.id === editedTodo.id ? { ...editedTodo } : t
    );
    setTodoList(optimistic);

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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.statusText || `HTTP ${resp.status}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        (err.message || 'Failed to update todo') + '. Reverting todo...'
      );
      const reverted = todoList.map((t) =>
        t.id === editedTodo.id ? original : t
      );
      setTodoList(reverted);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1>My Todo App</h1>

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        isLoading={isLoading}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
      {errorMessage && (
        <div style={{ marginTop: 16 }}>
          <hr />
          <p role="alert">Error: {errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
