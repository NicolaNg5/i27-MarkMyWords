// src/pages/assessment/[id].tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/ShortAnswerQuestion";
import QuestionNavigation from "@/components/QuestionNavigation";
import Timer from "@/components/Timer";

interface Question {
  id: number;
  type: "multiple-choice" | "short-answer";
  text: string;
  options?: string[];
}
const AssessmentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  useEffect(() => {
    // Sample Questions
    setQuestions([
      {
        id: 1,
        type: "multiple-choice",
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
      },
      { id: 2, type: "short-answer", text: "What is the meaning of ...?" },
      { id: 3, type: "short-answer", text: "What is the meaning of ...?" },
      { id: 4, type: "short-answer", text: "What is the meaning of ...?" },
      {
        id: 5,
        type: "multiple-choice",
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
      },
    ]);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNavigation = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const currentQuestionData = questions[currentQuestion - 1];
  return (
    <div className="flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl">Assessment {id}</h1>
        <Timer timeLeft={timeLeft} />
      </header>

      <div className="flex flex-col items-center p-4 mb-9">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
          {currentQuestionData &&
            (currentQuestionData.type === "multiple-choice" ? (
              <MultipleChoiceQuestion
                questionNumber={currentQuestion}
                questionText={currentQuestionData.text}
                options={currentQuestionData.options || []}
                selectedAnswer={answers[currentQuestion] || null}
                onAnswerSelect={handleAnswerSelect}
              />
            ) : (
              <ShortAnswerQuestion
                questionNumber={currentQuestion}
                questionText={currentQuestionData.text}
                answer={answers[currentQuestion] || ""}
                onAnswerChange={(answer) => handleAnswerSelect(answer)}
              />
            ))}
        </div>
      </div>

      <QuestionNavigation
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        onNavigate={handleNavigation}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};
export default AssessmentPage;
