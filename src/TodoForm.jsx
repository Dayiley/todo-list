import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef();

  function handleAddTodo(event) {
    event.preventDefault();
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input type="text" id="todoTitle" name="title" ref={todoTitleInput} />
      <button>Add Todo</button>
    </form>
  );
}

export default TodoForm;
