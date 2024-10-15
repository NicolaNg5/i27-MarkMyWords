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
            <input
              type="radio"
              value={option}
              checked={selectedAnswer === option}
              onChange={()=> onAnswerSelect(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
