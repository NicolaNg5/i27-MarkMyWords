import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { Student } from "@/types/student";
//Student table comp
export default function StudentsTable({ students }: { students: Student[] }) {
  if (!students.length) return <p>No students found.</p>;
  return (
    <>
      <br></br>
      <h2>All students:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu: Student) => (
            <tr key={stu.Studentid}>
              <td>{stu.Studentid}</td>
              <td>{stu.name}</td>
              <td>{stu.email}</td>
              <td>{stu.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
