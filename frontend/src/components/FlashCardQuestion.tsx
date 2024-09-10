import React, { useState, useEffect } from 'react';
import { Question } from '@/types/question';

// Define the props for the FlashcardQuestion component
interface FlashcardQuestionProps {
  question: Question;
  onAnswerChange: (answer: FlashcardAnswer) => void;
  savedAnswer?: FlashcardAnswer;
}

// Define the structure of a FlashcardAnswer
interface FlashcardAnswer {
  true: string[];
  false: string[];
}
const FlashcardQuestion: React.FC<FlashcardQuestionProps> = ({
  question,
  onAnswerChange,
  savedAnswer,
}) => {
  // Initialize state for the current answer, using savedAnswer if available
  const [answer, setAnswer] = useState<FlashcardAnswer>(savedAnswer || { true: [], false: [] });

  // Initialize state for remaining statements, filtering out any that are already in savedAnswer
  const [remainingStatements, setRemainingStatements] = useState<string[]>(
    savedAnswer
      ? (question.options || []).filter(option => !savedAnswer.true.includes(option) && !savedAnswer.false.includes(option))
      : question.options || []
  );

  // Effect to update state when question or savedAnswer changes
  useEffect(() => {
    if (savedAnswer) {
      setAnswer(savedAnswer);
      setRemainingStatements(
        (question.options || []).filter(option => !savedAnswer.true.includes(option) && !savedAnswer.false.includes(option))
      );
    } else {
      setAnswer({ true: [], false: [] });
      setRemainingStatements(question.options || []);
    }
  }, [question, savedAnswer]);

  // Handler for when drag starts
  const handleDragStart = (e: React.DragEvent, statement: string, source: 'remaining' | 'true' | 'false') => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ statement, source }));
  };

  // Handler for when an item is being dragged over a drop zone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handler for when an item is dropped
  const handleDrop = (e: React.DragEvent, targetColumn: 'true' | 'false' | 'remaining') => {
    e.preventDefault();
    const { statement, source } = JSON.parse(e.dataTransfer.getData('text'));
    
    const newAnswer = { ...answer };
    const newRemaining = [...remainingStatements];

    // Remove from source
    if (source === 'remaining') {
      const index = newRemaining.indexOf(statement);
      if (index > -1) newRemaining.splice(index, 1);
    } else {
      const index = newAnswer[source as 'true' | 'false'].indexOf(statement);
      if (index > -1) newAnswer[source as 'true' | 'false'].splice(index, 1);
    }

    // Add to target
    if (targetColumn === 'remaining') {
      newRemaining.push(statement);
    } else {
      newAnswer[targetColumn].push(statement);
    }
    setAnswer(newAnswer);
    setRemainingStatements(newRemaining);
    onAnswerChange(newAnswer);
  };

  // Function to render a draggable item
  const renderDraggableItem = (statement: string, index: number, source: 'remaining' | 'true' | 'false') => (
    <div 
      key={index} 
      draggable 
      onDragStart={(e) => handleDragStart(e, statement, source)}
      className={`mb-2 p-3 rounded cursor-move ${
        source === 'remaining' 
          ? 'bg-white' 
          : source === 'true'
            ? 'bg-green-100'
            : 'bg-orange-100'
      } shadow-md hover:shadow-lg transition-shadow duration-200`}
    >
      {statement}
    </div>
  );

  // Render the component
  return (
    <div className="flex flex-col space-y-4 max-w-[1600px] mx-auto w-full px-4">
      <div className="flex justify-between">
        <h3 className="font-bold mb-2 w-[30%] text-center text-green-600">True</h3>
        <h3 className="font-bold mb-2 w-[30%] text-center text-orange-600">False</h3>
        <h3 className="font-bold mb-2 w-[40%] text-center text-gray-600">Statements</h3>
      </div>
      <div className="flex justify-between space-x-6">
        {/* True column */}
        <div 
          className="w-[30%] p-4 bg-gray-100 rounded-lg shadow-lg min-h-[300px] max-h-[400px] overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'true')}
        >
          {answer.true.map((statement, index) => renderDraggableItem(statement, index, 'true'))}
        </div>
        {/* False column */}
        <div 
          className="w-[30%] p-4 bg-gray-100 rounded-lg shadow-lg min-h-[300px] max-h-[400px] overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'false')}
        >
          {answer.false.map((statement, index) => renderDraggableItem(statement, index, 'false'))}
        </div>
        {/* Remaining statements column */}
        <div 
          className="w-[40%] p-4 bg-gray-100 rounded-lg shadow-lg min-h-[300px] max-h-[400px] overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'remaining')}
        >
          {remainingStatements.map((statement, index) => renderDraggableItem(statement, index, 'remaining'))}
        </div>
      </div>
    </div>
  );
};
export default FlashcardQuestion;
