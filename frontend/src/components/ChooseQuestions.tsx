"use client";
import React, { useState, useEffect } from "react";
import { Assessment } from "@/types/assessment";

interface Question {
  assessmentID: string;
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

const ChooseQuestions: React.FC<{
  response: string;
  fileName: string;
  selectedPrompt: string;
}> = ({ response, fileName, selectedPrompt }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentID, setSelectedAsessmentID] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const getQuestionCategory = (promptName: string): string => {
    switch (promptName) {
      case "10 Short Answers":
        return "SA";
      case "10 Multiple Choices":
        return "MCQ";
      case "10 Correct or Incorrect" || "10 True or False" || "10 Agree or Disagree":
        return "FC";
      case "10 Highlight":
        return "HL";
      default:
        return "NA";
    }
  };

  useEffect(() => {
    if (response) {
      setQuestions(
        convertToJsonArray(response).map((question) => ({
          ...question,
          filename: fileName,
          type: getQuestionCategory(selectedPrompt),
        }))
      );
    }

    const fetchAssessments = async () => {
      try {
        const res = await fetch("/api/getassessment");
        const data = await res.json();
        setAssessments(data?.data as Assessment[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching Assessments");
      }
    };

    fetchAssessments();
  }, [response, fileName, selectedPrompt]);

  function convertToJsonArray(plainText: string): Question[] {
    console.log("jsonString:", plainText);
    let jsonArray = JSON.parse(plainText);
    return jsonArray as Question[];
  }

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleSaveQuestions = async () => {
    try {
      const selectedQuestionData = selectedQuestions.map((i) => questions[i]);
      console.log("Selected Question Data:", selectedQuestionData);
      const questionsText = `[\n${selectedQuestionData
        .map((q) =>
          JSON.stringify({ ...q, assessmentID: selectedAssessmentID })
        )
        .join(",\n")}\n]`;

      const res = await fetch("/api/save_questions", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: questionsText,
      });

      if (res.ok) {
        alert("Selected questions saved successfully!");
      } else {
        throw new Error(
          `Error saving questions: ${res.status} ${res.statusText}`
        );
      }
    } catch (error) {
      console.error("Error saving questions:", error);
    }
  };

  const handleAssessmentChange = (e: any) => {
    setSelectedAsessmentID(e.target.value);
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
                <p>
                  <strong>Correct Answer:</strong> {q.answer}
                </p>
              )}
              {q.type && (
                <h4>
                  <u>{q.category} question</u>
                </h4>
              )}
            </li>
          </div>
        ))}
      </ol>
      <select value={selectedAssessmentID} onChange={handleAssessmentChange}>
        <option value="">Select an assessment</option>
        {assessments.map((ass) => (
          <option key={ass.Assessmentid} value={ass.Assessmentid}>
            {ass.Title}
          </option>
        ))}
      </select>
      <button
        onClick={handleSaveQuestions}
        disabled={selectedQuestions.length === 0}
      >
        Save Selected Questions
      </button>
    </div>
  );
};

export default ChooseQuestions;
