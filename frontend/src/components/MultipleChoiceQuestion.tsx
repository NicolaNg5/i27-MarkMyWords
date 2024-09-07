// src/components/MultipleChoiceQuestion.tsx

import React from 'react';

interface MultipleChoiceQuestionProps {
  questionNumber: number;
  questionText: string;
  options: string[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionNumber,
  questionText,
  options,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="mb-8">
      <div className="mb-8 text-center">
        <h2 className="text-xl mb-4">
          Question {questionNumber}: { questionText }
        </h2>
      </div>
      <div className="space-y-4">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div
              className={`w-6 h-6 border-2 flex items-center justify-center ${
                selectedAnswer === option
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => onAnswerSelect(option)}
            >
              {selectedAnswer === option && (
                <span className="text-white">✓</span>
              )}
            </div>
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
