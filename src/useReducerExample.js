import React, { useReducer } from 'react';

// Declare initial state
const initialState = {
    count: 0,
    showText: true,
    textColor: '#000000',
    text: 'This is a text'  // Add initial text value
};

// Declare reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1
            };
        case "TOGGLE_TEXT":
            return {
                ...state,
                showText: !state.showText
            };
        case "decrement":
            return {
                ...state,
                count: state.count - 1
            };
        case "CHANGE_TEXT_COLOR":
            return {
                ...state,
                textColor: action.payload
            };
        case "TEXT_UPPERCASE":
            return {
                ...state,
                text: state.text.toUpperCase()
            };
        case "TEXT_LOWERCASE":
            return {
                ...state,
                text: state.text.toLowerCase()
            };
        default:
            return state;
    }
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


// Declare component
function UseReducerExample() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <div>
            <h2>{state.count}</h2>
            <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
            <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
            <button onClick={() => dispatch({ type: "TOGGLE_TEXT" })}>Toggle Text</button>
            <button onClick={() => dispatch({ type: "CHANGE_TEXT_COLOR", payload: getRandomColor() })}>Change Text Color</button>
            <button onClick={() => dispatch({ type: "TEXT_UPPERCASE" })}>Uppercase</button>
            <button onClick={() => dispatch({ type: "TEXT_LOWERCASE" })}>Lowercase</button>
            {state.showText && <p style={{ color: state.textColor }}>{state.text}</p>}
        </div>
    );
}

export default UseReducerExample;
