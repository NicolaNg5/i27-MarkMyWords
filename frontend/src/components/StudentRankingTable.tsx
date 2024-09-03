import React from 'react';

interface StudentRanking {
  id: number;
  name: string;
  score: number;
}

interface StudentRankingTableProps {
  className: string;
  students: StudentRanking[];
  onSortToggle: () => void;
  sortDirection: 'asc' | 'desc';
}

const StudentRankingTable: React.FC<StudentRankingTableProps> = ({
  className,
  students,
  onSortToggle,
  sortDirection,
}) => {
  console.log("Sort Direction:", sortDirection);
  console.log("Students Data:", students);

  const sortedStudents = [...students].sort((a, b) => {
    return sortDirection === 'asc' ? a.score - b.score : b.score - a.score;
  });

  return (
    <div className="overflow-x-auto shadow-md mt-4">
      <h3 className="text-lg font-semibold">{`Students in ${className}`}</h3>
      <table className="min-w-full bg-white border border-gray-300 mt-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={onSortToggle}>
              Score {sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th className="px-4 py-2 text-left">View Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => (
            <tr key={student.id} className="border-t">
              <td className="px-4 py-2">{student.id}</td>
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{student.score}%</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 hover:underline">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentRankingTable;
