"use client";
import React, { useState, useRef } from 'react';

const TextHighlight = ({ htmlContent, onHighlight }) => {
  const [highlightedText, setHighlightedText] = useState("");
  const highlightRef = useRef(null);

  const handleHighlight = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (selectedText && highlightRef.current) {
      const range = selection.getRangeAt(0);

      const newRange = document.createRange();
      newRange.setStart(range.startContainer, range.startOffset);
      newRange.setEnd(range.endContainer, range.endOffset);

      const selectedTextNode = newRange.extractContents();

      newRange.insertNode(highlightedNode); 
      selectedTextNode.textContent = ""; 

      setHighlightedText(selectedText);
      onHighlight(selectedText);
    }
  };

  return (
    <div 
      ref={highlightRef}
      onMouseUp={handleHighlight}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default TextHighlight;