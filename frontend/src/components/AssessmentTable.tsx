// src/components/Table.tsx

import React from "react";
import Link from "next/link";
import { FiEdit, FiTrash } from "react-icons/fi";



interface AssementTableProps {
  assessments: any[], //to be changed to Assessment model
}

const AssessmentTable = (props: AssementTableProps) => {

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
        {props.assessments.map((assessment) => (
          <tr key={assessment.id}>
            <td className="px-4 text-black py-2 border">
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
                href={`/assessment/${assessment.id}`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
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

export default AssessmentTable;


