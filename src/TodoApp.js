import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import './App.css'; // Import the CSS file

const initialState = {
  todos: [],
  input: '',
  dueDate: '',
  editingIndex: null,
  editText: '',
  editDueDate: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_DUE_DATE':
      return { ...state, dueDate: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
        input: '',
        dueDate: '',
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo, index) =>
          index === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((_, index) => index !== action.payload),
      };
    case 'START_EDIT':
      return {
        ...state,
        editingIndex: action.payload,
        editText: state.todos[action.payload].text,
        editDueDate: state.todos[action.payload].dueDate,
      };
    case 'SET_EDIT_TEXT':
      return { ...state, editText: action.payload };
    case 'SET_EDIT_DUE_DATE':
      return { ...state, editDueDate: action.payload };
    case 'SAVE_EDIT':
      return {
        ...state,
        todos: state.todos.map((todo, index) =>
          index === state.editingIndex
            ? { ...todo, text: state.editText, dueDate: state.editDueDate }
            : todo
        ),
        editingIndex: null,
        editText: '',
        editDueDate: '',
      };
    case 'SET_COMMENT_TEXT':
      return {
        ...state,
        todos: state.todos.map((todo, index) =>
          index === action.payload.index
            ? { ...todo, commentText: action.payload.commentText }
            : todo
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        todos: state.todos.map((todo, index) =>
          index === action.payload.index
            ? { ...todo, comments: [...(todo.comments || []), action.payload.comment], commentText: '' }
            : todo
        ),
      };
    default:
      return state;
  }
};

const TodoApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addTodo = useCallback(
    (e) => {
      e.preventDefault();
      if (state.input.trim() !== '' && state.dueDate) {
        dispatch({
          type: 'ADD_TODO',
          payload: { text: state.input, dueDate: state.dueDate, completed: false, id: Date.now(), comments: [], commentText: '' },
        });
      }
    },
    [state.input, state.dueDate]
  );

  const toggleTodo = useCallback(
    (index) => {
      dispatch({ type: 'TOGGLE_TODO', payload: index });
    },
    []
  );

  const deleteTodo = useCallback(
    (index) => {
      dispatch({ type: 'DELETE_TODO', payload: index });
    },
    []
  );

  const startEdit = useCallback(
    (index) => {
      dispatch({ type: 'START_EDIT', payload: index });
    },
    []
  );

  const saveEdit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch({ type: 'SAVE_EDIT' });
    },
    []
  );

  const setCommentText = useCallback(
    (index, commentText) => {
      dispatch({ type: 'SET_COMMENT_TEXT', payload: { index, commentText } });
    },
    []
  );

  const addComment = useCallback(
    (index, e) => {
      e.preventDefault();
      const commentText = state.todos[index].commentText;
      if (commentText.trim() !== '') {
        dispatch({
          type: 'ADD_COMMENT',
          payload: { index, comment: commentText },
        });
      }
    },
    [state.todos]
  );

  return (
    <div className="container">
      <h1>Todo Application</h1>

      {state.editingIndex !== null ? (
        <form onSubmit={saveEdit}>
          <input
            type="text"
            value={state.editText}
            onChange={(e) => dispatch({ type: 'SET_EDIT_TEXT', payload: e.target.value })}
            placeholder="Edit todo"
          />
          <input
            type="date"
            value={state.editDueDate}
            onChange={(e) => dispatch({ type: 'SET_EDIT_DUE_DATE', payload: e.target.value })}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={state.input}
            onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
            placeholder="Add a new todo"
          />
          <input
            type="date"
            value={state.dueDate}
            onChange={(e) => dispatch({ type: 'SET_DUE_DATE', payload: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="tasks-container">
        <ul>
          {state.todos.map((todo, index) => (
            <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : '' }}>
              <span onClick={() => toggleTodo(index)}>{todo.text}</span>
              <span> (Due: {todo.dueDate})</span>
              <div>
                <button onClick={() => startEdit(index)}>Edit</button>
                <button onClick={() => deleteTodo(index)}>Delete</button>
                <button onClick={() => toggleTodo(index)}>{todo.completed ? 'Undo' : 'Completed'}</button>
              </div>
              <ul>
                {todo.comments && todo.comments.map((comment, i) => (
                  <li key={i}>{comment}</li>
                ))}
              </ul>
              <form onSubmit={(e) => addComment(index, e)}>
                <input
                  type="text"
                  value={todo.commentText}
                  onChange={(e) => setCommentText(index, e.target.value)}
                  placeholder="Add a comment"
                />
                <button type="submit">Add Comment</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

TodoApp.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      id: PropTypes.number.isRequired,
      comments: PropTypes.arrayOf(PropTypes.string),
      commentText: PropTypes.string,
    })
  ),
  input: PropTypes.string,
  dueDate: PropTypes.string,
  editingIndex: PropTypes.number,
  editText: PropTypes.string,
  editDueDate: PropTypes.string,
};

export default TodoApp;