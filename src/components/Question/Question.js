// Question.js

import React from "react";
import Options from "./Options";

function Question({
  currentQuestion,
  handleAnswer,
  selectedAnswersMap,
  questions,
}) {
  // Extract the current question details
  const { question, options } = questions[currentQuestion];

  return (
    <>
      <h2>{`${currentQuestion + 1}. ${question}`}</h2>
      {/* Pass options directly to Options component */}
      <Options
        options={options}
        handleAnswer={handleAnswer}
        selectedAnswersMap={selectedAnswersMap}
        currentQuestion={currentQuestion}
      />
    </>
  );
}

export default Question;