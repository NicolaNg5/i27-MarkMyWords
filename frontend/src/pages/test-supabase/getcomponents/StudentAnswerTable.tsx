import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { StudentAnswer } from "@/types/answer";

//StudentAnswer table comp
export default function AnswerTable({ answers }: { answers: StudentAnswer[] }) {
  if (!answers.length) return <p>No answers found.</p>;
  return (
    <>
      <br></br>
      <h2>All student answers:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Answer ID</th>
            <th>Question ID</th>
            <th>Student ID</th>
            <th>Student Answer</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((ans: StudentAnswer) => (
            <tr key={ans.AnswerID}>
              <td>{ans.AnswerID}</td>
              <td>{ans.QuestionID}</td>
              <td>{ans.StudentID}</td>
              <td>{ans.Answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
