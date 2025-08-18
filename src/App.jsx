import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
