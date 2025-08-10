import TodoListItem from './TodoListItem';

function TodoList({ todoList = [], onCompleteTodo }) {
  const filteredTodoList = todoList.filter((t) => !t.isCompleted);

  if (filteredTodoList.length === 0) {
    return <p>Add todo above to get started</p>;
  } else {
    return (
      <ul>
        {filteredTodoList.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
          />
        ))}
      </ul>
    );
  }
}

export default TodoList;
