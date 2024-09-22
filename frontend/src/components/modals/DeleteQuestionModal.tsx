import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import { Question, QuestionType } from '@/types/question';

interface DeleteQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (any: any) => void;
    question: Question;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ isOpen, onClose, onSubmit, question}) => {
    
    useEffect(() => {
    },[])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        onSubmit(question);
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

export default DeleteQuestionModal;