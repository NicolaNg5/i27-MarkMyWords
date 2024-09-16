import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { Assessment } from "@/types/assessment";
//Assessments table comp
export default function AssessmentsTable({
  assessments,
}: {
  assessments: Assessment[];
}) {
  if (!assessments.length) return <p>No Assessment found.</p>;
  return (
    <>
      <br></br>
      <h2>All Assessments:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Assessment ID</th>
            <th>Title</th>
            <th>Topic</th>
            <th>Class</th>
            <th>Due Date</th>
            <th>Reading File Name</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((ass: Assessment) => (
            <tr key={ass.Assessmentid}>
              <td>{ass.Assessmentid}</td>
              <td>{ass.Title}</td>
              <td>{ass.Topic}</td>
              <td>{ass.Class}</td>
              <td>{ass.dueDate}</td>
              <td>{ass.ReadingFileName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
