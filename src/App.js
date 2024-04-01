// App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Question from "./components/Question/Question";
import Result from "./components/Result";
import questions from "./assets/questions.json";

// Function to shuffle an array
const shuffleArray = (array) => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// App Component
function App() {
  // State variables
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswersMap, setSelectedAnswersMap] = useState({});
  const [answerStatusMap, setAnswerStatusMap] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Function to reset the quiz
  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswersMap({});
    setAnswerStatusMap({});
    setErrorMessage("");
    if (shuffleQuestions) {
      // Shuffle the questions if enabled
      questions = shuffleArray(questions);
    }
  };

  // Use effect to update checkbox state based on selected answers
  useEffect(() => {
    const selectedAnswers = selectedAnswersMap[currentQuestion] || [];
    const checkboxes = document.querySelectorAll(
      `.app-content input[type="checkbox"]`
    );

    checkboxes.forEach((checkbox) => {
      const option = checkbox.value.charAt(0);
      checkbox.checked = selectedAnswers.includes(option);
    });
  }, [currentQuestion, selectedAnswersMap]);

  // Function to validate the answer
  const validate = () => {
    const selectedAnswers = selectedAnswersMap[currentQuestion] || [];
    let requiredChoices;

    // Determine the question type and set required choices accordingly
    const questionType = Array.isArray(questions[currentQuestion].answer)
      ? "multiple"
      : "single";

    if (questionType === "single") {
      requiredChoices = 1;
    } else if (questionType === "multiple") {
      requiredChoices = questions[currentQuestion].answer.length;
    }

    // Check if the required number of choices is selected
    if (selectedAnswers.length === requiredChoices) {
      // Retrieve correct answers
      const correctAnswers = [].concat(questions[currentQuestion].answer);

      // Check if the selected answers are correct
      const isCorrect =
        Array.isArray(correctAnswers) &&
        correctAnswers.length === selectedAnswers.length &&
        correctAnswers.every((answer) => selectedAnswers.includes(answer));

      // Reset selectedAnswersMap for the next question
      setSelectedAnswersMap((prevMap) => ({
        ...prevMap,
        [currentQuestion]: selectedAnswers,
      }));

      return { isCorrect, correctAnswers, errorMessage: "" };
    } else {
      const errorMessage = `Choose ${requiredChoices} answer${
        requiredChoices > 1 ? "s" : ""
      }`;
      setErrorMessage(errorMessage);
      return { isCorrect: false, correctAnswers: [], errorMessage };
    }
  };

  // Function to handle quiz submission (Check button)
  const handleCheck = () => {
    // Call the validate function
    const { isCorrect, correctAnswers, errorMessage } = validate();

    // Provide feedback based on the validation result
    if (isCorrect) {
      setErrorMessage(`Correct!`);
    } else if (errorMessage) {
      // Display the error message for required choices not selected
      setErrorMessage(errorMessage);
    } else {
      // Display correct answers and feedback for an incorrect response
      const correctAnswersInfo = correctAnswers.map((answer) => (
        <div key={answer}>
          {answer.charAt(0)}:{" "}
          {questions[currentQuestion].options
            .find((opt) => opt.charAt(0) === answer)
            .substring(2)}
        </div>
      ));

      const explanation =
        "The correct answer" +
        (correctAnswers.length > 1 ? "s are" : " is") +
        ":";
      const explanationText = (
        <div>
          Incorrect. {explanation} {correctAnswersInfo}
          <br />
          Explanation: {questions[currentQuestion].explanation}
        </div>
      );
      // Check if there is an explanation link
      const explanationLink = questions[currentQuestion].explanationLink;
      const errorMessageContent = explanationLink ? (
        <div>
          {explanationText}
          <a href={explanationLink} target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </div>
      ) : (
        explanationText
      );

      setErrorMessage(errorMessageContent);
    }
  };

  // Function to handle user's answer selection
  const handleAnswer = (selectedOption) => {
    const selectedAnswerIdentifier = selectedOption.charAt(0);
    const selectedAnswers = selectedAnswersMap[currentQuestion] || [];

    // Toggle selected answers
    if (selectedAnswers.includes(selectedAnswerIdentifier)) {
      selectedAnswers.splice(
        selectedAnswers.indexOf(selectedAnswerIdentifier),
        1
      );
    } else {
      selectedAnswers.push(selectedAnswerIdentifier);
    }

    // Update selected answers map
    setSelectedAnswersMap((prevMap) => ({
      ...prevMap,
      [currentQuestion]: selectedAnswers,
    }));
  };

  // Function to handle navigation to the next question (Next button)
  const handleNextQuestion = () => {
    // Call the validate function
    const { isCorrect, errorMessage } = validate();

    // Update answer status map, update the score, and proceed to the next question
    setAnswerStatusMap((prevMap) => ({
      ...prevMap,
      [currentQuestion]: isCorrect ? "correct" : "incorrect",
    }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    } else if (errorMessage) {
      // Display the error message for required choices not selected
      setErrorMessage(errorMessage);
      return; // Stop further execution if there is an error
    }

    // Reset error message
    setErrorMessage("");

    // Proceed to the next question
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  // Function to handle navigation to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setErrorMessage("");
      setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    } else {
      setErrorMessage("This is the first question.");
    }
  };

  // Function to handle quiz submission at any point
  const handleSubmitTest = () => {
    // Check if any answers are selected
    const isAnyAnswerSelected = Object.keys(selectedAnswersMap).some(
      (questionNumber) => selectedAnswersMap[questionNumber].length > 0
    );

    if (!isAnyAnswerSelected) {
      setErrorMessage(
        "Please select an answer for at least one question in order to submit the test."
      );
      return;
    }

    // Call the validate function
    const { isCorrect, errorMessage } = validate();

    // Update answer status map, update the score
    setAnswerStatusMap((prevMap) => ({
      ...prevMap,
      [currentQuestion]: isCorrect ? "correct" : "incorrect",
    }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    } else if (errorMessage) {
      // Display the error message for required choices not selected
      setErrorMessage(errorMessage);
      return; // Stop further execution if there is an error
    }

    // Reset error message
    setErrorMessage("");

    // Render the Result component
    setCurrentQuestion(questions.length);
  };

  // Render the App component
  return (
    <div>
      {/* Navigation bar with the question dropdown */}
      <NavBar
        totalQuestions={questions.length}
        setCurrentQuestion={setCurrentQuestion}
        answerStatusMap={answerStatusMap}
        setShuffleQuestions={setShuffleQuestions}
        shuffleQuestions={shuffleQuestions}
        handleReset={handleReset}
      />
      <div className="container">
        {/* Main content area */}
        <div className="app-content">
          {/* Display the current question and options */}
          {currentQuestion < questions.length ? (
            <Question
              currentQuestion={currentQuestion}
              handleAnswer={handleAnswer}
              selectedAnswersMap={selectedAnswersMap}
              questions={questions}
            />
          ) : (
            // Display the quiz completion message
            <Result
              score={score}
              totalQuestions={questions.length}
              selectedQuestions={Object.keys(selectedAnswersMap).length}
            />
          )}
          {/* Display an error message with correct/incorrect styling */}
          {errorMessage && (
            <div
              className={`error-message ${
                String(errorMessage).includes("Correct")
                  ? "correct"
                  : "incorrect"
              }`}
            >
              {errorMessage}
            </div>
          )}
        </div>
        {/* Button container for navigation buttons */}
        <div className="button-container">
          {currentQuestion < questions.length && (
            <>
            <div className="nav-buttons">
              <button onClick={handlePreviousQuestion}>Previous</button>
              <button onClick={handleCheck}>Check</button>
              <button onClick={handleNextQuestion}>Next</button>
            </div>
            <div className="submit-button">
              <button onClick={handleSubmitTest}>Submit Test</button>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
