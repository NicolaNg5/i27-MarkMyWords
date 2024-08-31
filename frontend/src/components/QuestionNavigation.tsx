// src/components/QuestionNavigation.tsx

import React from 'react';
import Button from './Button'; // Assuming you have a Button component

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  onNavigate: (questionNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  totalQuestions,
  currentQuestion,
  onNavigate,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-8 h-8 rounded-full ${
              num === currentQuestion
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => onNavigate(num)}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-md">
        <Button text="Previous Question" onClick={onPrevious} />
        <Button text="Next Question" onClick={onNext} />
      </div>
    </div>
  );
};

export default QuestionNavigation;
