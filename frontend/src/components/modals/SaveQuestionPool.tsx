import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';

interface SaveQuestionPoolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const SaveQuestionPoolModal: React.FC<SaveQuestionPoolModalProps> = ({ isOpen, onClose, onSubmit}) => {
    // const []
    
    useEffect(() => {
    },[])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    }

    return (
        <Modal title="Save Question Pool" onClose={onClose} isOpen={isOpen}>
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

export default SaveQuestionPoolModal;