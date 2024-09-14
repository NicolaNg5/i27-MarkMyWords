import { Question, QuestionType } from '@/types/question';
import React, { useState } from 'react';
import { BiArrowFromLeft, BiArrowFromRight, BiMinusBack, BiPlus } from 'react-icons/bi';
import { BsFileMinus, BsPenFill, BsPlusLg } from 'react-icons/bs';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { PiPencilBold, PiPencilCircle } from 'react-icons/pi';
import { RiPencilFill } from 'react-icons/ri';
import EditQuestionModal from './modals/EditQuestionModal';
import { TbTrashFilled } from 'react-icons/tb';
import DeleteQuestionModal from './modals/DeleteQuestionModal';
export enum ContainerType {
    Candidates,
    Quiz,
}

interface QuestionContainerProps {
    questions: Question[];
    type: ContainerType;
    setQuestions: (any: any) => void;
    onAction: (question: Question) => void;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ questions, type, setQuestions, onAction}) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalId, setModalId] = useState<number | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);

    const handleRowClick = (id: string) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    const onDelete = (question: Question) => {
        setQuestions((prev: any) => prev.filter((q:Question) => q.QuestionID !== question.QuestionID));
    };

    const onEdit = (question: Question) => {    
    }

    return (
        <>
            <div className='overflow-y-auto grid row-span-6 border border-primary bg-white p-1 pt-0' style={{ height: "650px" }}>
                <ul className="mt-2">
                    {questions?.map((question : Question) => {
                        const typeColor = 
                            question.Type === "MCQ" ? "bg-blue-400" : 
                            question.Type === "FC" ? "bg-green-400" : 
                            question.Type === "HL" ? "bg-yellow-400" : 
                            "bg-red-400";

                        return (
                            <li key={question.QuestionID} className="flex items-center justify-between py-2 px-4 border-b m-1 border-gray-100 rounded-md rounded-lg shadow-md">
                                <div className="grid grid-row-2 flex-grow cursor-pointer max-h-xs" onClick={() => handleRowClick(question.QuestionID)}>
                                    <div className="row-span-1 flex items-inline">
                                        <div className={`${typeColor} text-center text-white text-md rounded px-2 py-2`} style={{minWidth: "3vw", maxHeight:"40px"}}>
                                            {question.Type}
                                        </div>
                                        <div className={`flex items-center justify-between px-4 text-md`}>
                                            <span >{question.Question}</span>
                                        </div>
                                    </div>
                                    {expanded === question.QuestionID && ( 
                                        <>
                                        {question.Type == QuestionType.MultipleChoice && (
                                            <div className={`mt-2 text-gray-600` + (question.Options?.reduce((total, str) => total + str.length, 0) as number > 180) ? "test-sm" : "text-md"}>
                                                <div className="flex items-center">
                                                    {question.Options?.map((option, index) => ( 
                                                        <div key={option} className={`gap-2 px-3`}>
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
                                                    Suggested Highlighted Answer: {question.Answer}
                                                </div>
                                            </div>
                                        )}
                                        {question.Type == QuestionType.FlashCard && ( 
                                            <div className='mt-2 text-sm text-gray-600'>
                                                <div className="gap-2 px-3">
                                                    Matching Answer: {question.Answer}
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
                                            <FaPlusCircle size={21}/>
                                        </button>
                                    )}
                                    {type === ContainerType.Quiz && (
                                        <button
                                            className="flex items-center text-gray-500 hover:text-red-500 px-1"
                                            onClick={() => onAction(question)}
                                        >
                                            <FaMinusCircle size={21}/>
                                        </button>
                                    )}
                                     {expanded === question.QuestionID && (
                                        <button
                                            className="flex items-center text-primary hover:text-blue-600 px-1 pt-2"
                                            onClick={() => {
                                                setIsModalOpen(true) 
                                                setModalId(1)
                                                setQuestion(question)
                                        }}
                                        >
                                            <RiPencilFill size={23} />
                                        </button>
                                    )}
                                    {expanded === question.QuestionID && (
                                        <button
                                            className="flex items-center text-red-400 hover:text-blue-600 px-1 pt-2"
                                            onClick={() => {
                                                setIsModalOpen(true) 
                                                setModalId(2)
                                                setQuestion(question)
                                            }}
                                        >
                                            <TbTrashFilled size={23} />
                                        </button>
                                    )}
                                </div>
                            </li>
                            )})}
                </ul>
                <EditQuestionModal isOpen={isModalOpen && modalId==1} onClose={() => setIsModalOpen(false)} question={question ?? {} as Question}/>
                <DeleteQuestionModal isOpen={isModalOpen && modalId==2} onClose={() => setIsModalOpen(false)} question={question ?? {} as Question} onSubmit={onDelete}/>
            </div>   
        </>         
    );
};

export default QuestionContainer;