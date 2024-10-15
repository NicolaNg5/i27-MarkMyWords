import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import { se } from 'date-fns/locale';
import { Question } from '@/types/question';
import { set } from 'date-fns';

interface SaveQuestionPoolModalProps {
    isOpen: boolean;
    onClose: () => void;
    questions: Question[];
}

const SaveQuestionPoolModal: React.FC<SaveQuestionPoolModalProps> = ({ isOpen, onClose, questions }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mcQuestions = questions?.filter((question) => question.Type === "MCQ").length;
    const fcQuestions = questions?.filter((question) => question.Type === "FC").length;
    const hlQuestions = questions?.filter((question) => question.Type === "HL").length;
    const saQuestions = questions?.filter((question) => question.Type === "SA").length;
    const literalQuestions = questions?.filter((question) => question.Category === "literal").length;  
    const inferentialQuestions = questions?.filter((question) => question.Category === "inferential").length;
    
    useEffect(() => {
        questions?.length === 0 ?
            setError("There are no questions selected") :
            setError(null);
    },[questions])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            console.log("Selected Questions:", JSON.stringify(questions));

            const res = await fetch(`/api/save_questions`, {
              method: "POST",
              headers: { "Content-Type": "text/plain; charset=utf-8" },
              body: JSON.stringify(questions),
            });
      
            if (res.ok) {
            } else {
              setError(
                `Error saving questions: ${res.status} ${res.statusText}`
              );
            }
          } catch (error) {
            console.error("Error saving questions:", error);
          }

        setLoading(false);
        onClose();
    }

    return (
        <Modal title="Summary of Questions" onClose={onClose} isOpen={isOpen}>
            <form onSubmit={handleSubmit} >
                {loading ? 
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mt-5 mb-5"></div>
                    </div>
                : (
                    <div className='grid grid-row-4'>
                        <div className='row-span-3'>
                            <div className={`flex justify-between text-center mt-2 gap-2 text-gray-600 p-1 mx-1 text-sm`}>
                                <div className={`bg-blue-400 text-white text-md rounded px-2 py-2`}>
                                    <p>Multiple Choice {mcQuestions}</p>
                                </div>
                                <div className={`bg-green-400 text-white text-md rounded px-2 py-2`}>
                                    <p>FlashCard {fcQuestions}</p>
                                </div>
                                <div className={`bg-yellow-400 text-white text-md rounded px-2 py-2`}>
                                    <p>Highlight {hlQuestions}</p>
                                </div>
                                <div className={`bg-red-400 text-white text-md rounded px-2 py-2`}>
                                    <p>Short Answer {saQuestions}</p>
                                </div>
                            </div>
                            <hr className="border-t-2 border-gray-300 my-2" />
                            <div className={`flex justify-center text-center mt-2 gap-2 text-gray-600 p-1 mx-1 text-sm`}>
                                <div className={`bg-purple-400 text-white text-md rounded px-2 py-2`}>
                                    <p>Literal {literalQuestions} </p>
                                </div>
                                <div className={`bg-orange-400 text-white text-md rounded px-2 py-2`}>
                                    <p>Inferential {inferentialQuestions}</p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-gray-500">
                                <p></p>
                                <p>Total Questions: {questions?.length}</p>
                            </div>
                        </div>
                        <div className='flex justify-between items-center row-span-1 py-2'>
                            {error && (
                                <p className="text-red-500 mb-4 px-2 pt-3">
                                    {error}
                                </p>
                            )}
                            <div></div>
                            <button
                                type="submit"
                                className={`col-span-1 px-4 py-2 rounded flex-end` + (questions?.length === 0 ? " bg-gray-200 text-gray-600" : "text-black bg-secondary hover:bg-secondary-dark")}
                                disabled={questions?.length === 0}
                            >
                                Save Questions
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default SaveQuestionPoolModal;