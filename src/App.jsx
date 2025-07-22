import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

function App() {
  return (
    <div>
      <h1>My Todo App</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
