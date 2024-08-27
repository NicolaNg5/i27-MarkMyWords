'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default  function CreateAssignment({ onClose }:any) {
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentMaterial, setAssignmentMaterial] = useState('');

  const router = useRouter();

  const handleCreate = async() => {
    console.log('v');

    await fetch('http://localhost:3000/assignment.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentName,
        dueDate,
        assignmentMaterial
      }),
    });
    setAssignmentName('');
    setDueDate('');
    setAssignmentMaterial('');
    onClose();

    router.refresh();
  };

  return (
    <div className='text-black'>
      <h2 className="text-xl font-bold mb-4 ">Create Assignment</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2">Assignment Name</label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Assignment Material</label>
          <textarea
            value={assignmentMaterial}
            onChange={(e) => setAssignmentMaterial(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
