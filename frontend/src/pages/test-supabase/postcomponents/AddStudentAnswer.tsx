import React from "react";
import { Class } from "@/types/class";
import { Student } from "@/types/student";
import { StudentAnswer } from "@/types/answer";
import { useState, useEffect } from "react";
import { Question } from "@/types/question";
import styles from "@/pages/test-supabase/testsupabase.module.css";
//add StudentAnswer
export default function AddStudentAnswer({
  setAnswers,
  questions,
  students,
  setError,
}) {
  const [questionID, setQuestionID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/poststudentanswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: questionID,
          student_id: studentID,
          answer,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update the students answer list
        setAnswers((prevAnswers: StudentAnswer[]) => [
          ...prevAnswers,
          data.student_answer,
        ]);
        // Clear the form
        setQuestionID("");
        setStudentID("");
        setAnswer("");
      } else {
        setError("Failed to add student");
      }
    } catch (error) {
      setError("An error occurred while adding the student");
    }
  };

  return (
    <>
      <br></br>
      <div className={styles["form-container"]}>
        <h2 className={styles["form-header"]}>Add New Student Answer</h2>
        <form onSubmit={handleSubmit}>
          <select
            className={styles["form-select"]}
            value={questionID}
            onChange={(e) => setQuestionID(e.target.value)}
          >
            <option value="">Select a question</option>
            {questions.map((question: Question) => (
              <option key={question.QuestionID} value={question.QuestionID}>
                {question.Question}
              </option>
            ))}
          </select>

          <select
            className={styles["form-select"]}
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          >
            <option value="">Select a student</option>
            {students.map((stu: Student) => (
              <option key={stu.Studentid} value={stu.Studentid}>
                {stu.name}
              </option>
            ))}
          </select>

          <input
            className={styles["form-input"]}
            value={answer}
            type="text"
            placeholder="Answer"
            required
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button className={styles["form-button"]} type="submit">
            Add Student Answer
          </button>
        </form>
      </div>
    </>
  );
}
