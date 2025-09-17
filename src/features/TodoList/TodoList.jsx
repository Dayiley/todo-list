import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({
  todoList = [],
  isLoading = false,
  onCompleteTodo,
  onUpdateTodo,
}) {
  if (isLoading) {
    return <p>todo list loading...</p>;
  }

  const filteredTodoList = todoList.filter((t) => !t.isCompleted);

  return filteredTodoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <ul className={styles.list}>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
