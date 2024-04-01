// Result.js

import React from "react";

// Result Component
function Result({ score, selectedQuestions }) {
  const percentage = ((score / selectedQuestions) * 100).toFixed(2);

  return (
    <div className="container">
      <h2>Test Complete</h2>
      <p>
        Your score is {score} out of {selectedQuestions}.{" "}
        {selectedQuestions > 0 && `(${percentage}%)`}
      </p>
    </div>
  );
}

export default Result;
