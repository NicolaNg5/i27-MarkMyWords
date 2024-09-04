"use client";
import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correctOption?: string;
  filename: string; 
}

const ChooseQuestions: React.FC<{ response: string; fileName: string }> = ({ response, fileName }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (response) {
      // Add filename to each question object during parsing
      setQuestions(convertToJsonArray(response).map(question => ({ ...question, filename: fileName })));
    }
  }, [response, fileName]); 

  function convertToJsonArray(plainText: string): Question[] {
    let jsonString = plainText.replace(/^```json\s*|\s*```$/g, '').replace(/'/g, '"');
    let jsonArray = JSON.parse(jsonString);
    return jsonArray as Question[];
  }

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestions(prevSelected => 
      prevSelected.includes(index) 
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleSaveQuestions = async () => {
    try {
      const selectedQuestionData = selectedQuestions.map(i => questions[i]);
      console.log("Selected Question Data:", selectedQuestionData)
      const res = await fetch('/api/save_questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: selectedQuestionData }),
      });

      if (res.ok) {
        alert("Selected questions saved successfully!");
      } else {
        throw new Error(`Error saving questions: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  return (
    <div>
      <h2>Questions:</h2>
      <ol>
        {questions.map((q, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={selectedQuestions.includes(index)}
              onChange={() => handleQuestionSelect(index)}
            />
            <li>
              {q.question} 

              {/* Conditionally render options based on question type */}
              {q.option1 && q.option2 && (
                <ul>
                  <li>{q.option1}</li>
                  <li>{q.option2}</li>
                  {q.option3 && <li>{q.option3}</li>}
                  {q.option4 && <li>{q.option4}</li>}
                </ul>
              )}
              {q.correctOption && (
                <p><strong>Correct Option:</strong> {q.correctOption}</p>
              )}
            </li>
          </div>
        ))}
      </ol>
      <button onClick={handleSaveQuestions} disabled={selectedQuestions.length === 0}>
        Save Selected Questions
      </button>
    </div>
  );
};

export default ChooseQuestions;