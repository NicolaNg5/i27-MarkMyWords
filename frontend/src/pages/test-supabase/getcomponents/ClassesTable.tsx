import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { Class } from "@/types/class";
//Classes table comp
export default function ClassesTable({ classes }: { classes: Class[] }) {
  if (!classes.length) return <p>No class found.</p>;
  return (
    <>
      <br></br>
      <h2>All Class:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Class ID</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cl: Class) => (
            <tr key={cl.ClassNumber}>
              <td>{cl.ClassNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
