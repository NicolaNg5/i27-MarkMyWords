import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import { Question, QuestionType } from '@/types/question';
import { Assessment } from '@/types/assessment';

interface DeleteAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment;
}

const DeleteAssessmentModal: React.FC<DeleteAssessmentModalProps> = ({ isOpen, onClose, assessment}) => {
    
    useEffect(() => {
    },[])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        onClose();
    }

    return (
        <Modal title="Delete Question" onClose={onClose} isOpen={isOpen}>
            <form onSubmit={handleSubmit} >
                <div className=''>
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

export default DeleteAssessmentModal;