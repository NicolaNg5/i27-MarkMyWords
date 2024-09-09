import { Question, QuestionType } from '@/types/question';
import React, { useState } from 'react';
import { BiArrowFromLeft, BiArrowFromRight, BiMinusBack, BiPlus } from 'react-icons/bi';
import { BsFileMinus, BsPenFill, BsPlusLg } from 'react-icons/bs';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { PiPencilBold, PiPencilCircle } from 'react-icons/pi';
import { RiPencilFill } from 'react-icons/ri';
import EditQuestionModal from './modals/EditQuestionModal';
export enum ContainerType {
    Candidates,
    Quiz,
}

interface QuestionContainerProps {
    questions: Question[];
    type: ContainerType;
    onAction: (question: Question) => void;
    onEdit: (question: Question) => void;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ questions, type, onAction, onEdit }) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [question, setQuestion] = useState<Question | null>(null);

    const handleRowClick = (id: string) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    return (
        <>
            <div className='overflow-y-auto grid row-span-6 border border-primary bg-white p-1 pt-0' style={{ height: "700px" }}>
                <ul className="mt-2">
                    {questions?.map((question) => {
                        const typeColor = 
                            question.Type === "MCQ" ? "bg-blue-400" : 
                            question.Type === "FC" ? "bg-green-400" : 
                            question.Type === "HL" ? "bg-yellow-400" : 
                            "bg-red-400";
                        return (
                            <li key={question.QuestionID} className="flex items-center justify-between py-2 px-4 border-b m-1 border-gray-100 rounded-md rounded-lg shadow-md">
                                <div className="grid grid-row-2 flex-grow cursor-pointer " onClick={() => handleRowClick(question.QuestionID)}>
                                    <div className="row-span-1 flex items-inline">
                                        <div className={`${typeColor} text-center text-white text-md rounded px-3 py-1`} style={{width: "60px"}}>
                                            {question.Type}
                                        </div>
                                        <div className="flex justify-between px-4 text-lg">
                                            <span >{question.Question}</span>
                                        </div>
                                    </div>
                                    {expanded === question.QuestionID && ( 
                                        <>
                                        {question.Type == QuestionType.MultipleChoice && (
                                            <div className='mt-2 text-md text-gray-600'>
                                                <div className="flex items-center">
                                                    {question.Options?.map((option, index) => ( 
                                                        <div key={option} className="gap-2 px-3">
                                                            {index + 1}. {option}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="gap-2 px-3">
                                                    Answer: {question.Answer}
                                                </div>
                                            </div>
                                        )}
                                        {question.Type == QuestionType.ShortAnswer && ( 
                                            <div className='mt-2 text-sm text-gray-600'>
                                                <div className="gap-2 px-3">
                                                    Suggested Answer: {question.Answer}
                                                </div>
                                            </div>
                                        )}
                                        {question.Type == QuestionType.Highlighting && ( 
                                            <div className='mt-2 text-sm text-gray-600'>
                                                <div className="gap-2 px-3">
                                                    Suggested Answer: {question.Answer}
                                                </div>
                                            </div>
                                        )}
                                        {question.Type == QuestionType.FlashCard && ( 
                                            <div className='mt-2 text-sm text-gray-600'>
                                                <div className="gap-2 px-3">
                                                    Suggested Answer: {question.Answer}
                                                </div>
                                            </div>
                                        )}
                                        </>
                                    )}
                                </div>
                                <div className='text-bg mt-2 py-3 text-lg'>
                                    {type === ContainerType.Candidates && (
                                        <button
                                            className="flex items-center text-gray-500 hover:text-green-500 px-1"
                                            onClick={() => onAction(question)}
                                        >
                                            <FaPlusCircle size={25}/>
                                        </button>
                                    )}
                                    {type === ContainerType.Quiz && (
                                        <button
                                            className="flex items-center text-gray-500 hover:text-red-500 px-1"
                                            onClick={() => onAction(question)}
                                        >
                                            <FaMinusCircle size={25}/>
                                        </button>
                                    )}
                                     {expanded === question.QuestionID && (
                                        <button
                                            className="flex items-center text-primary hover:text-blue-600 py-2"
                                            onClick={() => onEdit(question) }
                                        >
                                            <RiPencilFill 
                                                size={28} 
                                                onClick={() => {
                                                    setIsModalOpen(true) 
                                                    setQuestion(question)
                                            }}/>
                                        </button>
                                    )}
                                </div>
                            </li>
                            )})}
                </ul>
                <EditQuestionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} question={question ?? {} as Question}/>
            </div>   
        </>         
    );
};

export default QuestionContainer;