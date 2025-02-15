import React, { useReducer } from 'react';
import './App.css';

const initialState = {
  todos: [],
  input: "",
  dueDate: "",
  priority: "Medium",
  category: "General",
  editMode: false,
  editId: null,
  searchQuery: "",
  filterPriority: "All", 
  filterCategory: "All",
  comments: [],
  commentInput: "",
  commentMode: false,
  commentId: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "SET_DUE_DATE": 
      return { ...state, dueDate: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER_PRIORITY":
      return { ...state, filterPriority: action.payload };
    case "SET_FILTER_CATEGORY": 
      return { ...state, filterCategory: action.payload };
    case "START_EDIT":
      const todoToEdit = state.todos.find(todo => todo.id === action.payload);
      return {
        ...state,
        editMode: true,
        editId: action.payload,
        input: todoToEdit.text,
        dueDate: todoToEdit.dueDate,
        priority: todoToEdit.priority,
        category: todoToEdit.category
      };
    case "CANCEL_EDIT":
      return {
        ...state,
        editMode: false,
        editId: null,
        input: "",
        dueDate: "",
        priority: "Medium",
        category: "General"
      };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === state.editId ? {
            ...todo,
            text: state.input,
            dueDate: state.dueDate,
            priority: state.priority,
            category: state.category
          } : todo
        ),
        editMode: false,
        editId: null,
        input: "",
        dueDate: "",
        priority: "Medium",
        category: "General"
      };
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            text: state.input,
            dueDate: state.dueDate,
            priority: state.priority,
            category: state.category,
            completed: false,
            id: Date.now()
          }
        ],
        input: "",
        dueDate: "",
        priority: "Medium",
        category: "General"
      };
    case "TOGGLE_COMPLETE":
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
      case "ADD_COMMENT":
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.todoId
              ? {
                  ...todo,
                  comments: [...todo.comments, {
                    id: Date.now(),
                    text: action.payload.comment,
                    timestamp: new Date().toISOString()
                  }]
                }
              : todo
          )
        };
    default:
      return state;
  }
};

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { 
    todos, 
    input, 
    dueDate, 
    priority, 
    category, 
    editMode,
    searchQuery,
    filterPriority,
    filterCategory 
  } = state;

  const filteredTodos = todos
    .filter(todo => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(todo => filterPriority === "All" ? true : todo.priority === filterPriority)
    .filter(todo => filterCategory === "All" ? true : todo.category === filterCategory);

  return (
    <div className="container">
      <h1>Todo List</h1>
      
      <input
        type="text"
        value={input}
        onChange={e => dispatch({ type: "SET_INPUT", payload: e.target.value })}
        placeholder="Enter task"
      />
      
      <input
        type="date"
        value={dueDate}
        onChange={e => dispatch({ type: "SET_DUE_DATE", payload: e.target.value })}
      />
      
      <select 
        value={priority}
        onChange={e => dispatch({ type: "SET_PRIORITY", payload: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={category}
        onChange={e => dispatch({ type: "SET_CATEGORY", payload: e.target.value })}
      >
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      <button onClick={() => {
        if (editMode) {
          dispatch({ type: "UPDATE_TODO" });
        } else {
          dispatch({ type: "ADD_TODO" });
        }
      }}>
        {editMode ? "Update Task" : "Add Task"}
      </button>

      {editMode && (
        <button onClick={() => dispatch({ type: "CANCEL_EDIT" })}>
          Cancel Edit
        </button>
      )}

      <input
        type="text"
        value={searchQuery}
        onChange={e => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
        placeholder="Search tasks..."
      />

      <select
        value={filterPriority}
        onChange={e => dispatch({ type: "SET_FILTER_PRIORITY", payload: e.target.value })}
      >
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={filterCategory}
        onChange={e => dispatch({ type: "SET_FILTER_CATEGORY", payload: e.target.value })}
      >
        <option value="All">All Categories</option>
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      <ul>
        {filteredTodos.map(todo => (

          <li key={todo.id} className={`priority-${todo.priority.toLowerCase()}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: "TOGGLE_COMPLETE", payload: todo.id })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text} - Due: {todo.dueDate} - Priority: {todo.priority} - Category: {todo.category}
            </span>
            <button onClick={() => dispatch({ type: "START_EDIT", payload: todo.id })}>
              Edit
            </button>
            <button onClick={() => dispatch({ type: "DELETE_TODO", payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;