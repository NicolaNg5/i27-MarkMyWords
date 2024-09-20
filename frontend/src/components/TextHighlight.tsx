import React, { useState, useRef } from "react";

interface HighlightingQuestionProps {
  questionNumber: number;
  questionText: string;
  content: string;
  highlightedText: string;
  onHighlight: (highlightedText: string) => void;
}

const TextHighlight: React.FC<HighlightingQuestionProps> = ({
  questionNumber,
  questionText,
  content,
  highlightedText,
  onHighlight,
}) => {
  const highlightRef = useRef(null);

  const handleHighlight = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText) {
      onHighlight(selectedText); 
    }
  };

  return (
    <div className="highlighting-question" onMouseUp={handleHighlight}>
      <h2>{questionNumber}. {questionText}</h2>
      <p ref={highlightRef} dangerouslySetInnerHTML={{ __html: content }} />
      {highlightedText && (
        <div className="highlighted-text">
          <strong>Highlighted Text:</strong> {highlightedText}
        </div>
      )}
    </div>
  );
};

export default TextHighlight;