import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { Question } from "@/types/question";
//Question table comp
export default function QuestionsTable({
  questions,
}: {
  questions: Question[];
}) {
  if (!questions.length) return <p>No Questions found.</p>;
  return (
    <>
      <br></br>
      <h2>All Questions:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Assessment ID</th>
            <th>Question</th>
            <th>Category</th>
            <th>Type</th>
            <th>Options</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q: Question) => (
            <tr key={q.QuestionID}>
              <td>{q.QuestionID}</td>
              <td>{q.AssessmentID}</td>
              <td>{q.Question}</td>
              <td>{q.Category}</td>
              <td>{q.Type}</td>
              <td>{q.Options ? q.Options.join(", ") : ""}</td>
              <td>{q.Answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
