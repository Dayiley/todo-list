export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

export const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };

    case actions.loadTodos: {
      const todos = (action.records || []).map((record) => {
        const todo = { id: record.id, ...record.fields };
        if (todo.isCompleted === undefined) todo.isCompleted = false;
        return todo;
      });
      return { ...state, todoList: todos, isLoading: false, errorMessage: '' };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error?.message || 'Something went wrong',
        isLoading: false,
        isSaving: false,
      };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo: {
      const r = action.records?.[0];
      const saved = r ? { id: r.id, ...r.fields } : null;
      if (saved && saved.isCompleted === undefined) saved.isCompleted = false;

      return {
        ...state,
        todoList: saved ? [...state.todoList, saved] : state.todoList,
        isSaving: false,
      };
    }

    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };

    case actions.revertTodo:

    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((t) =>
        t.id === action.editedTodo.id ? { ...action.editedTodo } : t
      );

      const updatedState = { ...state, todoList: updatedTodos };
      if (action.error) updatedState.errorMessage = action.error.message;

      return updatedState;
    }

    case actions.completeTodo: {
      const updated = state.todoList.map((t) =>
        t.id === action.id ? { ...t, isCompleted: true } : t
      );
      return { ...state, todoList: updated };
    }

    case actions.clearError:
      return { ...state, errorMessage: '' };

    default:
      return state;
  }
}
