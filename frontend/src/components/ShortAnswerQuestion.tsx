import React from 'react';

interface ShortAnswerQuestionProps {
  questionNumber: number;
  questionText: string;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  questionNumber,
  questionText,
  answer,
  onAnswerChange,
}) => {
  return (
    <div className="mb-8">
      <div className="mb-8 text-center">
        <h2 className="text-xl mb-4">
          Question {questionNumber}: {questionText}
        </h2>
      </div>
      <textarea
        className="w-full p-2 border rounded"
        rows={6}
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
      />
    </div>
  );
};

export default ShortAnswerQuestion;
