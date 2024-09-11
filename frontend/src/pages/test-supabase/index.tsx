"use client";
import { useState, useEffect } from "react";
import styles from "./testsupabase.module.css";
import Layout from "@/components/layout";
import { Student } from "@/types/student";
import { StudentAnswer } from "@/types/answer";

export default function TestSupabase() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [error, setError] = useState<string | null>(null);

  //handle function:
  const fetchSelectedStudent = async (studentId: any) => {
    try {
      const res = await fetch(`/api/student/${studentId}`);
      const data = await res.json();
      setSelectedStudent(data.data[0]); //data is an arrray with only 1 stu
    } catch (error) {
      setError("Error fetching student details");
      console.log(error);
      console.log(studentId);
    }
  };

  const fetchSelectedAnswer = async (quesId: any) => {
    try {
      const res = await fetch(`/api/answer/${quesId}`);
      const data = await res.json();
      setSelectedAnswer(data.data[0]); //data is an arrray with only 1 stu
    } catch (error) {
      setError("Error fetching answer details");
      console.log(error);
      console.log(quesId);
    }
  };
  //initialization
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();
        setStudents(data?.data as Student[]); //filled with array response
      } catch (error) {
        setError("Error fetching students");
      }
    };
    const fetchAnswers = async () => {
      try {
        const res = await fetch("/api/answers");
        const data = await res.json();
        setAnswers(data?.data as StudentAnswer[]); //filled with array response
      } catch (error) {
        setError("Error fetching answer");
      }
    };
    fetchStudents();
    fetchAnswers();
  }, []);

  return (
    <div>
      <h1>Testing the retrieval of supabase tables</h1>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          {/* <AddStudentForm setStudents={setStudents} setError={setError} /> */}
          <StudentsTable students={students} />
          {/* <SelectedStudent
            students={students}
            onSelectStudent={fetchSelectedStudent}
            selectedStudent={selectedStudent}
          /> */}
          <AnswerTable answers={answers} />
          {/* <SelectedAnswer
            answers={answers}
            onSelectAnswer={fetchSelectedAnswer}
            selectedAnswer={selectedAnswer}
          /> */}
        </>
      )}
    </div>
  );
}

function StudentsTable({ students }: { students: Student[] }) {
  if (!students.length) return <p>No students found.</p>;
  return (
    <>
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

// interface SelectedStudentProps {
//   students: any;
//   onSelectStudent: (id: any) => void;
//   selectedStudent: any;
// }

// function SelectedStudent({
//   students,
//   onSelectStudent,
//   selectedStudent,
// }: SelectedStudentProps) {
//   //func called onselect to set selected student oonly if student.id is set
//   const handleSelectChange = (e: any) => {
//     const selectedId = e.target.value;
//     if (selectedId) {
//       onSelectStudent(selectedId);
//     }
//   };

//   return (
//     <>
//       <h2> Select specific student to display</h2>
//       <select
//         className={styles["student-select"]}
//         value={selectedStudent.Studentid}
//         onChange={handleSelectChange}
//       >
//         <option value="">Select a student</option>
//         {students.map((student: any) => (
//           <option key={student.Studentid} value={student.Studentid}>
//             {student.name}
//           </option>
//         ))}
//       </select>
//       {selectedStudent && (
//         <div className={styles.studentDetails}>
//           <h2>Student Details</h2>
//           <p>
//             <strong>ID:</strong> {selectedStudent.Studentid}
//           </p>
//           <p>
//             <strong>Name:</strong> {selectedStudent.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {selectedStudent.email}
//           </p>
//           <p>
//             <strong>Class:</strong> {selectedStudent.class}
//           </p>
//         </div>
//       )}
//     </>
//   );
// }

function AnswerTable({ answers }: { answers: StudentAnswer[] }) {
  if (!answers.length) return <p>No answers found.</p>;
  return (
    <>
      <h2>All answers:</h2>
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

// interface SelectedAnswerProps {
//   answers: any;
//   onSelectAnswer: (id: any) => void;
//   selectedAnswer: any;
// }

// function SelectedAnswer({
//   answers,
//   onSelectAnswer,
//   selectedAnswer,
// }: SelectedAnswerProps) {
//   const handleSelectChange = (e: any) => {
//     const selectedId = e.target.value;
//     if (selectedId) {
//       onSelectAnswer(selectedId);
//     }
//   };

//   return (
//     <>
//       <h2> Select specific answer based on question to display</h2>
//       <select
//         className={styles["student-select"]}
//         value={selectedAnswer.QuestionID}
//         onChange={handleSelectChange}
//       >
//         <option value="">
//           Select a question you would like to see the answer
//         </option>
//         {answers.map((ans: any) => (
//           <option key={ans.QuestionID} value={ans.QuestionID}>
//             Question id: {ans.QuestionID}
//           </option>
//         ))}
//       </select>
//       {selectedAnswer && (
//         <div className={styles.studentDetails}>
//           <h2>Answer to question</h2>
//           <p>
//             <strong>ID:</strong> {selectedAnswer.Answer}
//           </p>
//         </div>
//       )}
//     </>
//   );
// }

// interface AddStudentFormProps {
//   setStudents: (student: any) => void;
//   setError: (error: any) => void;
// }

// function AddStudentForm({ setStudents, setError }: AddStudentFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [classId, setClassId] = useState("");

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/studentpost", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, class_id: classId }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         // Update the students list
//         setStudents((prevStudents: any) => [...prevStudents, data.student]);
//         // Clear the form
//         setName("");
//         setEmail("");
//         setClassId("");
//       } else {
//         setError(data.detail || "Failed to add student");
//       }
//     } catch (error) {
//       setError("An error occurred while adding the student");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Add New Student</h2>
//       <input
//         value={name}
//         type="text"
//         placeholder="Name"
//         required
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         required
//       />
//       <input
//         type="text"
//         value={classId}
//         onChange={(e) => setClassId(e.target.value)}
//         placeholder="Class ID"
//         required
//       />
//       <button type="submit">Add Student</button>
//     </form>
//   );
// }
