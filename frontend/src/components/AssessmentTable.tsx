// src/components/Table.tsx

import React, { useState } from "react";
import Link from "next/link";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Assessment } from "@/types/assessment";
import Loading from "./Loading";



interface AssementTableProps {
  assessments: Assessment[], //to be changed to Assessment model
}

const AssessmentTable = (props: AssementTableProps) => {
  const [loading, setLoading] = useState(false);

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
        {props.assessments.map((assessment, index) => (
          <tr key={assessment.Assessmentid}>
            <td className="px-4 text-black py-2 border">
              {index + 1}. {assessment.Title}
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
              {loading ? <Loading size={"5"}/> :(
                <Link
                  href={`/assessment/${assessment.Assessmentid}`}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                  onClick={() => setLoading(true)}
                >
                  View Assessment
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssessmentTable;


