import { Assessment } from '@/types/assessment';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

interface ReleaseAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment;
}

const ReleaseAssessmentModal: React.FC<ReleaseAssessmentModalProps> = ({ isOpen, onClose, assessment }) => {
  const [title, setTitle] = useState<string>(assessment?.Title);
  const [dueDate, setDueDate] = useState<string>(assessment?.dueDate?.toString());
  const [questions, setQuestions] = useState({ total: 50, H: 10, M: 15, E: 25 });

  const handleSubmit = async(e: React.FormEvent) => {
  }

  useEffect(() => {
      setTitle(assessment?.Title)
      assessment?.dueDate ? setDueDate(assessment?.dueDate.toString()) : ""
  },[assessment])
  
  if (!isOpen) return null;

  return (
    <Modal title="Release Assessment" onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit} className="text-black">
        <div>
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
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReleaseAssessmentModal;
