import React, { useState } from 'react';

interface ReleaseAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReleaseAssessmentModal: React.FC<ReleaseAssessmentModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('Romeo & Juliet');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState({ total: 50, H: 10, M: 15, E: 25 });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Release Assessment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Due Date</label>
          <div className="flex items-center">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Monday 10th of June"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Questions</label>
          <div className="flex items-center space-x-2">
            <span>{questions.total} →</span>
            <span className="bg-red-400 text-white rounded-full px-2 py-1">H {questions.H}</span>
            <span className="bg-orange-400 text-white rounded-full px-2 py-1">M {questions.M}</span>
            <span className="bg-green-400 text-white rounded-full px-2 py-1">E {questions.E}</span>
          </div>
        </div>
        <button className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 w-full">
          Release
        </button>
      </div>
    </div>
  );
};

export default ReleaseAssessmentModal;
