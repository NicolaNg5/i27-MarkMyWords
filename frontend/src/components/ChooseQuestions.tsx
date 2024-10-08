"use client";
import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  answer: string;
  filename?: string; 
  category?: string;
  type: string;
}

const ChooseQuestions: React.FC<{ response: string; fileName: string; selectedPrompt: string }> = ({ response, fileName, selectedPrompt }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const getQuestionCategory = (promptName: string): string => {
    switch (promptName) {
      case "10 Short Answers":
        return "SA";
      case "10 Multiple Choices":
        return "MCQ";
      case "10 True/False":
      case "10 Agree/Disagree":
      case "10 Correct/Incorrect":
        return "FC";
      case "10 Highlight":
        return "HL";
      default:
        return "NA"; 
    }
  };

  useEffect(() => {
    if (response) {
      setQuestions(convertToJsonArray(response).map(question => ({ ...question, filename: fileName, type: getQuestionCategory(selectedPrompt)})));
    }
  }, [response, fileName, selectedPrompt]); 

  function convertToJsonArray(plainText: string): Question[] {
    console.log("jsonString:", plainText);
    let jsonArray = JSON.parse(plainText);
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
      console.log("Selected Question Data:", selectedQuestionData);
      const questionsText = `[\n${selectedQuestionData.map(q => JSON.stringify(q)).join(',\n')}\n]`;

      const res = await fetch('/api/save_questions', {
        method: 'POST',
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: questionsText,
      });

      if (res.ok) {
        alert("Selected questions saved successfully!");
      } else {
        throw new Error(`Error saving questions: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error saving questions:", error);
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
              {q.answer && (
                <p><strong>Correct Answer:</strong> {q.answer}</p>
              )}
              {q.type && (
                <h4><u>{q.category} question</u></h4>
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