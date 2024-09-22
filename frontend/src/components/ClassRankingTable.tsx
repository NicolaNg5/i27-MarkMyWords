// components/ClassRankingTable.tsx

import React from 'react';

interface ClassRanking {
  className: string;
  averageScore: number;
}

interface ClassRankingTableProps {
  classRankings: ClassRanking[];
  onSelectClass: (className: string) => void;
  selectedClass: string | null;
  onSortToggle: () => void;
  sortDirection: 'asc' | 'desc';
}

const ClassRankingTable: React.FC<ClassRankingTableProps> = ({
  classRankings,
  onSelectClass,
  selectedClass,
  onSortToggle,
  sortDirection,
}) => {
  return (
    <div className="overflow-x-auto shadow-md">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Class</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={onSortToggle}>
              Average Score {sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th className="px-4 py-2 text-left">View Details</th>
          </tr>
        </thead>
        <tbody>
          {classRankings.map((ranking, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{ranking.className}</td>
              <td className="px-4 py-2">{ranking.averageScore}%</td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => onSelectClass(ranking.className)}
                >
                  {selectedClass === ranking.className ? 'Hide Details' : 'View Details'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassRankingTable;
