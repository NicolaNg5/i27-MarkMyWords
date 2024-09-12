import React from "react";
import { Class } from "@/types/class";
import { Student } from "@/types/student";
import { useState, useEffect } from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
//add student
interface AddStudentFormProps {
  setStudents: (student: any) => void;
  setError: (error: any) => void;
  classes: Class[];
}

export default function AddStudentForm({
  setStudents,
  setError,
  classes,
}: AddStudentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/studentpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, class_id: classId }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update the students list
        setStudents((prevStudents: Student[]) => [
          ...prevStudents,
          data.student,
        ]);
        // Clear the form
        setName("");
        setEmail("");
        setClassId("");
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
        <h2 className={styles["form-header"]}>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles["form-input"]}
            value={name}
            type="text"
            placeholder="Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={styles["form-input"]}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <select
            className={styles["form-select"]}
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Select a class</option>
            {classes.map((cl: Class) => (
              <option key={cl.ClassNumber} value={cl.ClassNumber}>
                {cl.ClassNumber}
              </option>
            ))}
          </select>
          <button className={styles["form-button"]} type="submit">
            Add Student
          </button>
        </form>
      </div>
    </>
  );
}
