// Options.js

import React from "react";

// Options Component
function Options({ options, handleAnswer, selectedAnswers }) {
  return (
    <ul>
      {options.map((option, index) => (
        <li key={index}>
          <label>
            <input
              type="checkbox"
              value={option}
              onChange={() => handleAnswer(option)}
              checked={
                selectedAnswers && selectedAnswers.includes(option.charAt(0))
              }
              // Adding a check for selectedAnswers to prevent accessing includes() on undefined
            />
            {option}
          </label>
        </li>
      ))}
    </ul>
  );
}

export default Options;
