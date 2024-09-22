import React, { useEffect, useState } from 'react';
import SwitchButton from '@/components/SwitchButton';
import Dropdown from '@/components/DropdownMenu';
import DifficultyArea from '@/components/DifficultyArea';
import ViewSelection from '@/components/ViewSelection';
import ScoreDistribution from '@/components/ScoreDistribution';
import Ranking from '@/components/Ranking';
import { useRouter } from 'next/router';
// import { Assessment } from "@/types/assessment";
// import { Student } from "@/types/student";
import PerformanceTrend from '@/components/PerformanceTrend';

const AssessmentResults: React.FC = () => {
  const [isStudentView, setIsStudentView] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('Student1');
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


  //to fetch real data
  // const [assessment, setAssessment] = useState<Assessment>({} as Assessment);
  // const [students, setStudents] = useState<Student[]>([])
  // useEffect(() => {
  //   const fetchAssessment= async () => {
  //     try {
  //       const res = await fetch(`/api/assessment/${id}`);
  //       const data = await res.json();
  //       setAssessment(data?.data[0] as Assessment);
  //     } catch (error) {
  //       setError("Error fetching assessment");
  //     }
  //   }

  //   const fetchStudents = async () => {
  //     try {
  //       const res = await fetch("/api/students");
  //       const data = await res.json();
  //       setStudents(data?.data as Student[]); //filled with array response
  //     } catch (error) {
  //       setError("Error fetching students");
  //     }
  //   };
  //   fetchAssessment();
  //   fetchStudents();
  // }, []);

  // Sample for student list
  const students = ['Student1', 'Student2', 'Student3'];

  // Number of incorrect answers
  const incorrectAnswers = {
    MCQ: { HARD: 5, MEDIUM: 3, EASY: 1 },
    ShortAnswer: { HARD: 4, MEDIUM: 2, EASY: 0 },
    Highlighting: { HARD: 6, MEDIUM: 0, EASY: 2 },
    FlashCards: { HARD: 3, MEDIUM: 1, EASY: 0 },
  };

  const classRankings = [
    { className: '7A', averageScore: 95 },
    { className: '7B', averageScore: 90 },
    { className: '7C', averageScore: 60 },
  ];

  // Sample student data associated with each class
  const studentRankings = {
    '7A': [
      { id: 1, name: 'John Doe', score: 85 },
      { id: 2, name: 'Mary Smith', score: 86 },
      { id: 3, name: 'Tom Dang', score: 90 },
    ],
    '7B': [
      { id: 4, name: 'Alice Johnson', score: 78 },
      { id: 5, name: 'Bob Brown', score: 92 },
    ],
    '7C': [
      { id: 6, name: 'Charlie Davis', score: 60 },
    ],
  };
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Assessment Result</h1>
        <h2>Assessment Name</h2>
        <h2>Due Date: 03/09/2024</h2>
      </div>

      {/* Switch and Dropdown */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <SwitchButton
          isOn={isStudentView}
          toggleSwitch={() => setIsStudentView(!isStudentView)}
        />
        {isStudentView && (
          <Dropdown
            options={students}
            selectedOption={selectedStudent}
            onSelect={setSelectedStudent}
          />
        )}
      </div>

      {/* View Selection Buttons */}
      <ViewSelection
        isStudentView={isStudentView}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />

      {/* Conditionally Render Based on Selected View */}
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
      ) : null}
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
