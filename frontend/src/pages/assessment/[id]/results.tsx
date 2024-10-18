import React, { use, useEffect, useState } from 'react';
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
import { Analysis } from '@/types/analysis';
import Loading from '@/components/Loading';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import AnalysisBox from '@/components/AnalysisBox';
import RatingBox from '@/components/RatingBox';

export interface QuestionAnswers {
  Question: Question;
  Answers: StudentAnswer[];
}

const AssessmentResults: React.FC = () => {
  const [isStudentView, setIsStudentView] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [assessment, setAssessment] = useState<undefined | Assessment>(undefined);
  const [students, setStudents] = useState<Student[]>([])
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswers[]>([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [analysis, setAnalysis] = useState<Analysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis>({} as Analysis);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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
      const res = await fetch(`/api/class_students/${assessment?.Class}`);
      const data = await res.json();
      setStudents(data?.data as Student[]); //filled with array response
      setSelectedStudent(data?.data[0].Studentid);
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
      setQuestionAnswers((prev) => {
        // Check if the question is already in the list
        const existingQA = prev.find(qa => qa.Question.QuestionID === question.QuestionID);
        
        if (existingQA) {
          // If the question exists, update its answers
          return prev.map(qa => 
            qa.Question.QuestionID === question.QuestionID 
              ? { ...qa, Answers: data?.data as StudentAnswer[] }
              : qa
          );
        } else {
          // If the question doesn't exist, add it to the list
          return [...prev, {
            Question: question,
            Answers: data?.data as StudentAnswer[]
          }];
        }
      });
    } catch (error) {
      setError("Error fetching student answers");
    }
  }

  const generateAnalysis = async () => {
    try {
      const res = await fetch(`/api/analyse_answers/${id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);
      setAnalysis(data as Analysis[]);
    } catch (error) {
      setError("Error generating analysis");
    }
  }

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`/api/getAssessmentAnalysis/${id}`);
      const data = await res.json();
      if (data?.data.length === 0){
        await generateAnalysis();
      } else {
        setAnalysis(data?.data as Analysis[]);
      }
    } catch (error) {
      setError("Error fetching analysis:" + error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAssessment();
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const getAssessmentAnalysis = async () => {
      setLoading(true);
      await fetchAnalysis();
      setLoading(false);
    }
    if (assessment && analysis.length === 0) getAssessmentAnalysis();
  }, [assessment]);
    

  useEffect(() => {
    const fetchData = async () => {
      await fetchStudents();
      await fetchAssessmentQuestions();
    }
    if (analysis.length != 0) fetchData();
  }, [analysis]);

  useEffect(() => {
    if (selectedStudent && questions) {
      questions?.forEach(async (question) => {
        await fetchStudentAnswers(question);
      });
    }
  }, [questions]);

  useEffect(() => {
    if (analysis.length != 0 && Boolean(analysis as Analysis[])) {
      console.log(analysis);
      setCurrentAnalysis(analysis?.find((a) => a.StudentID === selectedStudent) ?? {} as Analysis);
      setFeedback(analysis?.find((a) => a.StudentID === selectedStudent)?.feedback ?? "no feedback given");
    }
  }, [selectedStudent]);

  // method for changing selected student and setting the current analysis to the selected student
  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);
    setCurrentAnalysis(analysis?.find((a) => a.StudentID === studentId) ?? {} as Analysis);
    setFeedback(analysis?.find((a) => a.StudentID === studentId)?.feedback ?? "no feedback given");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-400';
    if (rating >= 6) return 'bg-yellow-300';
    return 'bg-red-400';
  };

  // Sample for student list
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Assessment Result</h1>
        <h2>{assessment?.Title}</h2>
        <h2>Due Date: {assessment?.dueDate ? format(assessment?.dueDate, 'dd-MM-yyyy').toString() : ""}</h2>
      </div>

      {/* Switch and Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <SwitchButton
          isOn={isStudentView}
          toggleSwitch={() => setIsStudentView(!isStudentView)}
          disabled={loading}
        />
        
        {isStudentView && (
          <>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentChange(e.target.value)}
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
      { loading ? <Loading/> : (
        <>
      {isStudentView ? (
        <div className="space-y-2">
          <StudentAnswers  studentId={selectedStudent} questionAnswer={questionAnswers}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisBox title="Strengths" content={currentAnalysis.strengths} />
            <AnalysisBox title="Weaknesses" content={currentAnalysis.weaknesses} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RatingBox 
              title="Inferential Rating" 
              rating={currentAnalysis.inferential_rating} 
              color={getRatingColor(currentAnalysis.inferential_rating)}
            />
            <RatingBox 
              title="Literal Rating" 
              rating={currentAnalysis.literal_rating} 
              color={getRatingColor(currentAnalysis.literal_rating)}
            />
          </div>
          
          <div className="my-5 gap-2">
            <h3>Student Feedback</h3>
            <div>
              <textarea 
                className="w-full h-32 border border-gray-300 rounded p-2 mt-2" 
                placeholder="Enter feedback here"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
          <div className="w-full h-[35em] flex flex-col bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Student Ratings: Inferential vs Literal</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  analysis.map((a) => ({
                    name: students.find((s) => s.Studentid === a.StudentID)?.name,
                    inferential: a.inferential_rating,
                    literal: a.literal_rating,
                  }))
                }
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="inferential" stroke="#8884d8" activeDot={{ r: 8 }} name="Inferential" />
                <Line type="monotone" dataKey="literal" stroke="#82ca9d" activeDot={{ r: 8 }} name="Literal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
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