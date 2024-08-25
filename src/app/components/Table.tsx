// src/components/Table.tsx

import React from "react";
import Link from "next/link";
import { FiEdit, FiTrash } from "react-icons/fi";

interface Assessment {
  id: number;
  name: string;
}

const assessments: Assessment[] = [
  { id: 1, name: "Assessment 1" },
  { id: 2, name: "Assessment 2" },
  { id: 3, name: "Assessment 3" },
];

const Table: React.FC = () => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Name</th>
          <th className="px-4 py-2 border">Actions</th>
          <th className="px-4 py-2 border-b border-gray-300"></th>
        </tr>
      </thead>
      <tbody>
        {assessments.map((assessment) => (
          <tr key={assessment.id}>
            <td className="px-4 py-2 border">
              {assessment.id}. {assessment.name}
            </td>
            <td className="px-4 py-2 border  justify-center  space-x-4">
              <button className="text-blue-500">
                <FiEdit size={20} />
              </button>
              <button className="text-red-500">
                <FiTrash size={20} />
              </button>
            </td>
            <td className="px-4 py-2 border-b border-gray-300">
              <Link
                href={`/assessments/${assessment.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Assessment
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;


