import React, { useEffect, useState } from 'react';
import SwitchButton from '@/components/SwitchButton';
import DifficultyArea from '@/components/DifficultyArea';
import ViewSelection from '@/components/ViewSelection';
import ScoreDistribution from '@/components/ScoreDistribution';
import Ranking from '@/components/Ranking';
import { useRouter } from 'next/router';
// import { Assessment } from "@/types/assessment";
// import { Student } from "@/types/student";
import PerformanceTrend from '@/components/PerformanceTrend';
import { Assessment } from '@/types/assessment';
import { Student } from '@/types/student';
import { format, set } from 'date-fns';
import { Question } from '@/types/question';
import { StudentAnswer } from '@/types/answer';
import StudentAnswers from '@/components/StudentAnswers';

export interface QuestionAnswers {
  Question: Question;
  Answers: StudentAnswer[];
}

const AssessmentResults: React.FC = () => {
  const [isStudentView, setIsStudentView] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [assessment, setAssessment] = useState<Assessment>({} as Assessment);
  const [students, setStudents] = useState<Student[]>([])
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswers[]>([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [selectedView, setSelectedView] = useState<
    'Performance Trend' | 'Area of Difficulty' | 'Score Distribution' | 'Class Ranking'
  >('Area of Difficulty');


  const router = useRouter();
  const [id, setId] = useState<string>( router.query.id as string);
  useEffect(() => {
    if(router.isReady){
      setId(router.query.id as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    isStudentView ? setSelectedView('Area of Difficulty') : setSelectedView('Class Ranking');
  }, [isStudentView]);


  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/class_students/${assessment.Class}`);
      const data = await res.json();
      setStudents(data?.data as Student[]); //filled with array response
      setSelectedStudent(data?.data[0].StudentID);
    } catch (error) {
      setError("Error fetching students");
    }
  };

  const fetchAssessment= async () => {
    try {
      const res = await fetch(`/api/assessment/${id}`);
      const data = await res.json();
      setAssessment(data?.data[0] as Assessment);
    } catch (error) {
      setError("Error fetching assessment");
    }
  }

  const fetchAssessmentQuestions = async () => {
    try {
      const res = await fetch(`/api/question/${id}`);
      const data = await res.json();
      setQuestions(data?.data as Question[]);
      setQuestionAnswers([]);
    } catch (error) {
      setError("Error fetching questions");
    }
  }

  const fetchStudentAnswers = async (question: Question) => {
    try {
      const res = await fetch(`/api/studentanswer/${question.QuestionID}`);
      const data = await res.json();
      const QnA: QuestionAnswers = {
        Question: question,
        Answers: data?.data as StudentAnswer[]
      }
      //need to add duplicate check
        setQuestionAnswers((prev) => prev ? [...prev, QnA] : [QnA]);
    } catch (error) {
      setError("Error fetching student answers");
    }
  }

  const fetchStudentFeedback = async () => {
    try {
      //write handler
      const res = await fetch(`/api/feedback/${selectedStudent}`);
      const data = await res.json();
      setFeedback(data?.data[0].Feedback);
    } catch (error) {
      setError("Error fetching feedback");
    }
  }

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  useEffect(() => {
    fetchStudents();
    fetchAssessmentQuestions();
  }, [assessment]);

  useEffect(() => {
    questions?.forEach((question) => {
      fetchStudentAnswers(question);
    });
  }, [questions]);

  useEffect(() => {
    fetchStudentFeedback();
  },[selectedStudent]);

  // Sample for student list
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Assessment Result</h1>
        <h2>{assessment.Title}</h2>
        <h2>Due Date: {assessment?.dueDate ? format(assessment?.dueDate, 'dd-MM-yyyy').toString() : ""}</h2>
      </div>

      {/* Switch and Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <SwitchButton
          isOn={isStudentView}
          toggleSwitch={() => setIsStudentView(!isStudentView)}
        />
        {isStudentView && (
          <>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {students?.map((student) => (
                <option key={student.Studentid} value={student.Studentid}>
                  {student.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* View Selection Buttons */}
      {/* <ViewSelection
        isStudentView={isStudentView}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      /> */}


      {isStudentView ? (
        <>
          <StudentAnswers  studentId={selectedStudent} questionAnswer={questionAnswers}/>
          <div className="my-5 gap-2">
            <h3>Student Feedback</h3>
            <div>
              <textarea 
                className="w-full h-32 border border-gray-300 rounded p-2 mt-2" 
                placeholder="Enter feedback here"
                defaultValue={feedback}
              />
            </div>
          </div>
        </>
      ) : (
        <>

        </>
        )}

      {/* Conditionally Render Based on Selected View
      {isStudentView ? (
        selectedView === 'Area of Difficulty' ? (
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(incorrectAnswers).map(([category, difficulties]) => (
              <div key={category} className="flex flex-col items-center">
                <h2 className="mb-2">{category}</h2>
                {Object.entries(difficulties).map(([difficulty, count]) => (
                  <DifficultyArea
                    key={difficulty}
                    difficulty={difficulty as 'HARD' | 'MEDIUM' | 'EASY'}
                    incorrectCount={count as number}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : selectedView === 'Performance Trend' ? (
          <PerformanceTrend
            data={[
              { period: '1st Sem. 1st Year', gpa: 87 },
              { period: '2nd Sem. 1st Year', gpa: 84 },
              { period: '1st Sem. 2nd Year', gpa: 87 },
              { period: '2nd Sem. 2nd Year', gpa: 81 },
              { period: '1st Sem. 3rd Year', gpa: 75 },
              { period: '2nd Sem. 3rd Year', gpa: 81 },
              { period: '1st Sem. 4th Year', gpa: 84 },
            ]}
          />
        ) : null
      ) : selectedView === 'Score Distribution' ? (
        <ScoreDistribution
          scores={[710, 1000, 710, 710, 710, 710]}
        />
      ) : selectedView === 'Class Ranking' ? (
        <Ranking classRankings={classRankings} studentRankings={studentRankings} />
      ) : null} */}
      <button
        className="bg-gray-500 text-white p-2 mt-6 rounded hover:bg-gray-700"
        onClick={() => window.history.back()}
      >
          Back
      </button>
    </div>
  );
};

export default AssessmentResults;

