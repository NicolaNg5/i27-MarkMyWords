"use client";
import { useState, useEffect } from "react";
import styles from "./testsupabase.module.css";
import Layout from "@/components/layout";
import { Student } from "@/types/student";
import StudentsTable from "./getcomponents/StudentsTable";
import AnswerTable from "./getcomponents/StudentAnswerTable";
import ClassesTable from "./getcomponents/ClassesTable";
import AssessmentsTable from "./getcomponents/AssessmentsTable";
import ResultsTable from "./getcomponents/ResultsTable";
import QuestionsTable from "./getcomponents/QuestionTable";
import SkillTable from "./getcomponents/SkillTable";
import QuestionSkillsTable from "./getcomponents/QuestionSkillTable";
import AddStudentForm from "./postcomponents/AddStudentForrm";
import AddStudentAnswer from "./postcomponents/AddStudentAnswer";
import { StudentAnswer } from "@/types/answer";
import { Class } from "@/types/class";
import { Assessment } from "@/types/assessment";
import { AssessmentResults } from "@/types/assessmentresults";
import { Question } from "@/types/question";
import { Skill } from "@/types/skill";
import { QuestionSkill } from "@/types/questionSkill";

export default function TestSupabase() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResults[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [questionSkills, setQuestionSkills] = useState<QuestionSkill[]>([]);
  const [error, setError] = useState<string | null>(null);

  //handle function:
  const fetchSelectedStudent = async (studentId: string) => {
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
    //get all students
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/getstudents");
        const data = await res.json();
        setStudents(data?.data as Student[]); //filled with array response
      } catch (error) {
        setError("Error fetching students");
      }
    };

    //get all students answer
    const fetchAnswers = async () => {
      try {
        const res = await fetch("/api/getstudentanswers");
        const data = await res.json();
        setAnswers(data?.data as StudentAnswer[]); //filled with array response
      } catch (error) {
        setError("Error fetching answer");
      }
    };

    //get all classes
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/getclass");
        const data = await res.json();
        setClasses(data?.data as Class[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching classes");
      }
    };

    //get all Assessments:
    const fetchAssessments = async () => {
      try {
        const res = await fetch("/api/getassessment");
        const data = await res.json();
        setAssessments(data?.data as Assessment[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching Assessments");
      }
    };

    //get all assessment results
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/getassessmentresults");
        const data = await res.json();
        setResults(data?.data as AssessmentResults[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching Assessments Results");
      }
    };

    //get all questions
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/getquestions");
        const data = await res.json();
        setQuestions(data?.data as Question[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching questions");
      }
    };

    //get all skills
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/getskills");
        const data = await res.json();
        setSkills(data?.data as Skill[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching skills");
      }
    };

    //get all question skill
    const fetchQuestionSkills = async () => {
      try {
        const res = await fetch("/api/getquestionskills");
        const data = await res.json();
        setQuestionSkills(data?.data as QuestionSkill[]); //filled with arrraay of class type
      } catch (error) {
        setError("Error fetching questions skills");
      }
    };
    fetchStudents();
    fetchAnswers();
    fetchClasses();
    fetchAssessments();
    fetchResults();
    fetchQuestions();
    fetchSkills();
    fetchQuestionSkills();
  }, []);

  return (
    <div>
      <h1>Testing the retrieval and creation of supabase tables and rows</h1>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <AddStudentForm
            setStudents={setStudents}
            setError={setError}
            classes={classes}
          />
          <StudentsTable students={students} />
          <SelectedStudent
            students={students}
            onSelectStudent={fetchSelectedStudent}
            selectedStudent={selectedStudent}
          />
          <AddStudentAnswer
            setAnswers={setAnswers}
            setError={setError}
            questions={questions}
            students={students}
          />
          <AnswerTable answers={answers} />
          {/* <SelectedAnswer
            answers={answers}
            onSelectAnswer={fetchSelectedAnswer}
            selectedAnswer={selectedAnswer}
          /> */}
          <ClassesTable classes={classes} />
          <AssessmentsTable assessments={assessments} />
          <ResultsTable results={results} />
          <QuestionsTable questions={questions} />
          <SkillTable skills={skills} />
          <QuestionSkillsTable questionSkills={questionSkills} />
        </>
      )}
    </div>
  );
}

//ALL COMPONENTS FOR DISPLAY SUPA TABLES

interface SelectedStudentProps {
  students: Student[];
  onSelectStudent: (id: any) => void;
  selectedStudent: Student | null;
}

function SelectedStudent({
  students,
  onSelectStudent,
  selectedStudent,
}: SelectedStudentProps) {
  //func called onselect to set selected student oonly if student.id is set
  const handleSelectChange = (e: any) => {
    const selectedId = e.target.value;
    if (selectedId) {
      onSelectStudent(selectedId);
    }
  };
  return (
    <>
      <br></br>
      <h2> Select specific student to display</h2>
      <select
        className={styles["student-select"]}
        value={selectedStudent?.Studentid} //the start is null
        onChange={handleSelectChange}
      >
        <option value="">Select a student</option>
        {students.map((student: any) => (
          <option key={student.Studentid} value={student.Studentid}>
            {student.name}
          </option>
        ))}
      </select>
      {selectedStudent && (
        <div className={styles.studentDetails}>
          <h2>Student Details</h2>
          <p>
            <strong>ID:</strong> {selectedStudent.Studentid}
          </p>
          <p>
            <strong>Name:</strong> {selectedStudent.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedStudent.email}
          </p>
          <p>
            <strong>Class:</strong> {selectedStudent.class}
          </p>
        </div>
      )}
    </>
  );
}
