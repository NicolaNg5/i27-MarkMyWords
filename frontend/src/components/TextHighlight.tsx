// src/components/HighlightingQuestion.tsx
import React, { useState, useRef } from "react";
import { FaHighlighter, FaTrashAlt } from "react-icons/fa"; // Icons for highlight and delete buttons

interface HighlightingQuestionProps {
  questionNumber: number;
  questionText: string;
  content: string;
  highlightedText: string;
  onHighlight: (highlightedText: string) => void;
}

const HighlightingQuestion: React.FC<HighlightingQuestionProps> = ({
  questionNumber,
  questionText,
  content,
  highlightedText,
  onHighlight,
}) => {
  const [highlightedContent, setHighlightedContent] = useState(content); // Store content with highlighted text
  const highlightRef = useRef<HTMLParagraphElement>(null);

  const handleHighlight = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    const contentText = highlightRef.current?.innerText || content;

    if (selectedText && contentText.includes(selectedText)) {
      const c1 = contentText.split(selectedText)[0];
      const c2 = selectedText;
      const c3 = contentText.split(selectedText)[1];
      const newContent = `${c1}<span style="background-color: yellow">${c2}</span>${c3}`;

      setHighlightedContent(newContent); // Update content with highlighted text
      onHighlight(c2); // Pass highlighted text to parent component
    }
  };

  const handleDeleteHighlight = () => {
    setHighlightedContent(content); // Reset content to original
    onHighlight(""); // Clear highlighted text
  };

  return (
    <div className="highlighting-question">
        <div className="mb-8 text-center">
          <h2 className="text-xl mb-4">
            Question {questionNumber}: { questionText }
          </h2>
        </div>
      {/* Highlight button */}
      <button
        onClick={handleHighlight}
        className="highlight-button rounded-xl items-center border  bg-yellow-300  px-3 py-1 mr-3 mb-4"
      >
        <FaHighlighter />
      </button>

      {/* Delete button */}

      <button
        onClick={handleDeleteHighlight}
        className="delete-button rounded-xl items-center border  bg-red-400 px-3 py-1"
      >
        <FaTrashAlt />
      </button>



      {/* Display the content with highlights */}
      <div className="border bg-grey p-4 rounded-xl">
  <p
    ref={highlightRef}
    dangerouslySetInnerHTML={{ __html: highlightedContent }}
    className="whitespace-pre-wrap"
  />
</div>


      {/* Display the highlighted text */}
      {/* {highlightedText && (
        <div className="highlighted-text">
          <strong>Highlighted Text:</strong> {highlightedText}
        </div>
      )} */}
    </div>
  );
};

export default HighlightingQuestion;
