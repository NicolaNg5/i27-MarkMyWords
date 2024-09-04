import React, { FormEvent, useEffect, useState } from 'react';
import { Assessment } from '@/types/assessment';
import Modal from './Modal';

interface CloseAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment;
}

const CloseAssessmentModal: React.FC<CloseAssessmentModalProps> = ({ isOpen, onClose, assessment }) => {
    const [title, setTitle] = useState<string>(assessment?.Title);
    const [dueDate, setDueDate] = useState<string>(assessment?.dueDate?.toString);
    const [topic, setTopic] = useState<string>(assessment?.Topic);
    
    useEffect(() => {
        setTitle(assessment?.Title)
        assessment?.dueDate ? setDueDate(assessment?.dueDate.toString()) : ""
        setTopic(assessment?.Topic)
    },[assessment])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    }

    return (
        <Modal title="" onClose={onClose} isOpen={isOpen}>
            <form onSubmit={handleSubmit} >
                <div className=''>
                <p>are you sure you want to close assessment?</p>
                    <button
                        type="submit"
                        className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark flex-end"
                    >
                        Confirm
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CloseAssessmentModal;