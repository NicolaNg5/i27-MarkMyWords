import { Question } from '@/types/question';
import React, { useState } from 'react';

interface QuestionContainerProps {
    questions: Question[];
    answer: string;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ questions }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    // {questions?.map((question, index) => ())}
    console.log(questions);

    return (
        <>
            <div className='grid row-span-6 border border-primary bg-white p-1 pt-0'>
                <ul className="mt-2">
                    {questions?.map((question) => (
                    <li key={question.id} className="flex items-center justify-between py-2 px-4 border-b m-1 border-gray-100 rounded-md rounded-lg shadow-md">
                        <div className="bg-blue-500 text-white text-sm rounded px-3 py-1">
                            {question.type}
                        </div>
                        <div className="flex items-center">
                            <span>{question.question}</span>
                        </div>
                        <button
                        className="text-red-500 hover:text-red-600"
                        >
                        +
                        </button>
                    </li>
                    ))}
                </ul>
            </div>   
        </>         
    );
};

export default QuestionContainer;