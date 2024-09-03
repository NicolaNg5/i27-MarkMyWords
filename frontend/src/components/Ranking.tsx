import React, { useState } from 'react';
import ClassRankingTable from './ClassRankingTable';
import StudentRankingTable from './StudentRankingTable';

interface ClassRanking {
  className: string;
  averageScore: number;
}

interface StudentRanking {
  id: number;
  name: string;
  score: number;
}

interface RankingProps {
  classRankings: ClassRanking[];
  studentRankings: Record<string, StudentRanking[]>;
}

const Ranking: React.FC<RankingProps> = ({ classRankings, studentRankings }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Separate state for sorting
  const [classSortDirection, setClassSortDirection] = useState<'asc' | 'desc'>('desc');
  const [studentSortDirection, setStudentSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle class selection
  const handleSelectClass = (className: string) => {
    setSelectedClass(selectedClass === className ? null : className);
  };

  // Handle sorting direction change for class rankings
  const handleClassSortToggle = () => {
    setClassSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  // Handle sorting direction change for student rankings
  const handleStudentSortToggle = () => {
    setStudentSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  // Sort function based on direction
  const sortItems = <T,>(items: T[], key: keyof T, direction: 'asc' | 'desc') => {
    return [...items].sort((a, b) =>
      direction === 'asc'
        ? (a[key] as number) - (b[key] as number)
        : (b[key] as number) - (a[key] as number)
    );
  };

  return (
    <div>
      {/* Class Ranking Table */}
      <ClassRankingTable
        classRankings={sortItems(classRankings, 'averageScore', classSortDirection)}
        onSelectClass={handleSelectClass}
        selectedClass={selectedClass}
        onSortToggle={handleClassSortToggle}
        sortDirection={classSortDirection}
      />

      {/* Student Ranking Table - shown when a class is selected */}
      {selectedClass && (
        <StudentRankingTable
          className={selectedClass}
          students={sortItems(studentRankings[selectedClass], 'score', studentSortDirection)}
          onSortToggle={handleStudentSortToggle}
          sortDirection={studentSortDirection}
        />
      )}
    </div>
  );
};

export default Ranking;
