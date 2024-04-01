// NavBar.js

import React from "react";

// NavBar Component
function NavBar({
  totalQuestions,
  setCurrentQuestion,
  answerStatusMap,
  setShuffleQuestions,
  shuffleQuestions,
  handleReset,
}) {
  // Generate an array of question numbers
  const questionNumbers = Array.from(
    { length: totalQuestions },
    (_, index) => index
  );

  // Handle reset button click
  const handleResetClick = () => {
    handleReset();
  };

  // Handle shuffle checkbox change
  const handleShuffleChange = (event) => {
    setShuffleQuestions(event.target.checked);
  };

  // Handle dropdown change event
  const handleDropdownChange = (event) => {
    setCurrentQuestion(parseInt(event.target.value, 10));
  };

  return (
    <nav className="nav-bar">
      <h1 className="title">SalAd Test</h1>
      <div className="question-navigator">
        {/* Reset button */}
        <button onClick={handleResetClick}>Reset</button>
        {/* Shuffle checkbox */}
        <label>
          <input
            type="checkbox"
            checked={shuffleQuestions}
            onChange={handleShuffleChange}
          />
          Shuffle
        </label>
        {/* Dropdown for question navigation */}
        <select onChange={handleDropdownChange} defaultValue="">
          <option value="" disabled hidden>
            Questions' List
          </option>
          {questionNumbers.map((number) => (
            <option
              key={number}
              value={number}
              className={
                answerStatusMap[number] === "correct"
                  ? "correct"
                  : answerStatusMap[number] === "incorrect"
                  ? "incorrect"
                  : ""
              }
            >
              Question {number + 1}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

export default NavBar;
