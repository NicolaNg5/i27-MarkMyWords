// src/pages/assessment/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QuestionNavigation from '@/components/QuestionNavigation';
import MultipleChoiceQuestion from '@/components/MultipleChoiceQuestion';

const AssessmentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3599); 
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const totalQuestions = 10; 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="p-4 text- flex justify-between items-center">
        <h1 className="text-xl">Assessment {id}</h1>
        <div className="text-xl">{formatTime(timeLeft)}</div>
      </header>

      {/* Main content */}
      <div className=" flex flex-col items-center p-4 mb-9">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
          <MultipleChoiceQuestion
            questionNumber={currentQuestion}
            questionText="What is the meaning of ...?"
            options={["A: Answer", "B: Answer", "C: Answer", "D: Answer"]}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>
      </div>

      {/* Footer with navigation */}
        <QuestionNavigation
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          onNavigate={setCurrentQuestion}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
        />
    </div>
  );
};
export default AssessmentPage;
