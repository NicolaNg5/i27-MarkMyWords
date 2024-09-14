import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';

interface CreateQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateQuestionModal: React.FC<CreateQuestionsModalProps> = ({ isOpen, onClose}) => {
    // const []
    
    useEffect(() => {
    },[])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    }

    return (
        <Modal title="Create Question" onClose={onClose} isOpen={isOpen}>
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

export default CreateQuestionModal;