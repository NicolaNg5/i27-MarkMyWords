import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { AssessmentResults } from "@/types/assessmentresults";
//Assessment result table comp
export default function ResultsTable({
  results,
}: {
  results: AssessmentResults[];
}) {
  if (!results.length) return <p>No Assessment Result found.</p>;
  return (
    <>
      <br></br>
      <h2>All Assessments Result:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Result ID</th>
            <th>AssessmentID</th>
            <th>Student ID</th>
            <th>Analysis</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {results.map((re: AssessmentResults) => (
            <tr key={re.ResultID}>
              <td>{re.StudentID}</td>
              <td>{re.AssessmentID}</td>
              <td>{re.StudentID}</td>
              <td>{re.Analysis}</td>
              <td>{re.Marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
