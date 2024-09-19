import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import { Question, QuestionType } from '@/types/question';
import { Assessment } from '@/types/assessment';
import Loading from '../Loading';

interface DeleteAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment;
}

const DeleteAssessmentModal: React.FC<DeleteAssessmentModalProps> = ({ isOpen, onClose, assessment}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {

    },[])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/assessment_delete/${assessment.Assessmentid}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.log("Error deleting assessment: ", error);
        }

        setLoading(false);
        onClose();
    }

    return (
        <Modal title="Delete Assessment" onClose={onClose} isOpen={isOpen}>
            {loading ? <Loading /> : (
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
            )}
        </Modal>
    );
};

export default DeleteAssessmentModal;