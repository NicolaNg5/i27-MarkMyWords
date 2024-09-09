import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import { Question, QuestionType } from '@/types/question';

interface EditQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: Question;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ isOpen, onClose, question}) => {
    const [newQuestion, setnewQuestion] = useState<string>(question!.Question);
    const [options, setOptions] = useState<string[] | undefined>(question!.Options);
    const [type, setType] = useState<string>(question!.Type);
    
    useEffect(() => {
    },[])

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    }

    return (
        <Modal title="Edit Question" onClose={onClose} isOpen={isOpen}>
            <form onSubmit={handleSubmit} >
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Question</label>
                    <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setnewQuestion(e.target.value)}
                    className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Type</label>
                    <select id="type" className="w-full p-2 border rounded" name="Type" onChange={(e) => setType(e.target.value)}>
                        <option value={QuestionType.FlashCard}>FlashCard</option>
                        <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
                        <option value={QuestionType.ShortAnswer}>Short Answer</option>
                        <option value={QuestionType.Highlighting}>Highlighting</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Category</label>
                </div>
                <div className="mb-4">
                    {/* create option component for flashcard and multiple choice editing */}
                    {type === QuestionType.FlashCard && (
                        <label className="block text-gray-700 mb-2">Cards</label>
                    )}
                    {type === QuestionType.ShortAnswer && (
                        <label className="block text-gray-700 mb-2">Suggested Answer</label>
                    )}
                    {type === QuestionType.MultipleChoice && (
                        <>
                            <label className="block text-gray-700 mb-2">Option</label>

                            <label className="block text-gray-700 mb-2">Answer</label>
                        </>
                    )}
                    {type === QuestionType.Highlighting && (
                        <label className="block text-gray-700 mb-2">Suggested Answer</label>
                    )}
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

export default EditQuestionModal;