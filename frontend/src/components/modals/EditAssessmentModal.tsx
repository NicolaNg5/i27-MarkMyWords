import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import { Assessment } from '@/types/assessment';

interface EditAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment;
}

const EditAssessmentModal: React.FC<EditAssessmentModalProps> = ({ isOpen, onClose, assessment }) => {
    const [title, setTitle] = useState<string>(assessment?.Title);
    const [dueDate, setDueDate] = useState<string>(assessment?.dueDate?.toString());
    const [topic, setTopic] = useState<string>(assessment?.Topic);
    
    useEffect(() => {
        setTitle(assessment?.Title)
        assessment?.dueDate ? setDueDate(assessment?.dueDate.toString()) : ""
        setTopic(assessment?.Topic)
    },[assessment])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        
    }

    return (
        <Modal title="Edit Assessment" onClose={onClose} isOpen={isOpen}>
            <form onSubmit={handleSubmit} >
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
                    <label className="block text-gray-700 mb-2">Topic</label>
                    <input
                    type="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
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
                <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark"
                >
                    Finish
                </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditAssessmentModal;