"use client";
import React, { useState, useRef } from 'react';

interface highlightProps{
  htmlContent: string
  onHighlight: (highlightedText: string) => null;
}

const TextHighlight = ({ htmlContent, onHighlight } : highlightProps) => {
  const [highlightedText, setHighlightedText] = useState("");
  const highlightRef = useRef(null);

  const handleHighlight = () => {
    const selection: Selection | null = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText && highlightRef.current && selection) {
      const range : Range = selection.getRangeAt(0);

      const newRange = document.createRange();
      newRange.setStart(range.startContainer, range.startOffset);
      newRange.setEnd(range.endContainer, range.endOffset);

      const selectedTextNode = newRange.extractContents();

      const highlightedNode = document.createTextNode(selectedText);
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
    />
  );
};

export default TextHighlight;