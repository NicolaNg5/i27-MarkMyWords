'use client';

import Link from 'next/link';
import CreateAssignment from './CreateAssignment';
import { useState, useEffect } from 'react';

async function getAssignments() {
  const res = await fetch('http://localhost:3000/assignment.json', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}

export default function AssignmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchAssignments = async () => {
    const data = await getAssignments();
    setAssignments(data);
  };

  // Fetch assignments on component mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="relative h-screen bg-white">
      <div className="pt-12 flex h-full">
        <aside className="w-1/13 bg-gray-300 text-white p-4 z-10">
          <nav>
            <ul>
              <li className="pt-12 mb-4">
                <Link href="/" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
              <li className="pt-12 mb-4">
                <Link href="/" className="block p-2 bg-gray-100 rounded hover:bg-grey-200">
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6 text-black">
            <h1 className="text-xl font-bold">Reading Comprehensive</h1>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center hover:bg-yellow-600"
              onClick={handleOpenModal}
            >
              + Create Assessment
            </button>
          </div>

          <table className="w-full table-auto border-collapse text-black">
            <thead>
              <tr className="bg-gray-300">
                <th className="border px-4 py-2">Assignment Name</th>
                <th className="border px-4 py-2">Actions</th>
                <th className="border px-4 py-2">View</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{assignment.name}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <Link href={`/assignment/${assignment.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View Assignment
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Render the CreateAssignment modal if the modal is open */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded shadow-lg">
                <CreateAssignment onClose={handleCloseModal} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
