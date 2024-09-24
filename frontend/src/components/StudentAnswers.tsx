import { QuestionAnswers } from "@/pages/assessment/[id]/results";
import { StudentAnswer } from "@/types/answer";
import { Question, QuestionType } from "@/types/question";
import { format } from "path";
import { use, useEffect, useState } from "react";
import MultipleChoice from "./questions/MultipleChoice";
import FlashCard from "./questions/FlashCard";
import ShortAnswer from "./questions/ShortAnswer";
import Highlighting from "./questions/Highlighting";

interface StudentAnswersProps {
    questionAnswer: QuestionAnswers[];
    studentId: string;
}


const StudentAnswers: React.FC<StudentAnswersProps> = ({questionAnswer, studentId}) => {
    const [questions, setQuestions] = useState<Question[]>(questionAnswer.map((qa) => qa.Question));

    useEffect(() => {
        console.log(questionAnswer);
        setQuestions(questionAnswer.map((qa) => qa.Question));
    }, [questionAnswer]);


    return (
        <>
          <div className="flex overflow-x-auto" style={{maxWidth: "90vw"}}>
                {questions?.map((question) => {
                    const answer = questionAnswer.find((qa) => qa.Question.QuestionID === question.QuestionID)?.Answers.find((a) => a.StudentID === studentId)?.Answer;
                    const typeColor = 
                            question.Type === QuestionType.MultipleChoice ? "bg-blue-400" : 
                            question.Type === QuestionType.FlashCard ? "bg-green-400" : 
                            question.Type === QuestionType.Highlighting ? "bg-yellow-400" : 
                            "bg-red-400";
                    return(
                        <div className="py-2 px-4 border-b m-1 border-gray-100 rounded-md rounded-lg shadow-md" style={{minWidth:"500px"}}>
                            <div className="row-span-1 flex items-inline">
                                <div className={`${typeColor} text-center text-white text-md rounded px-2 py-2`} style={{minWidth: "3vw", maxHeight:"40px"}}>
                                    {question.Type}
                                </div>
                                <div className={`flex items-center justify-between px-4 text-md`}>
                                    <span >{question.Question}</span>
                                </div>
                            </div>
                            {question.Type === QuestionType.MultipleChoice && (
                                <MultipleChoice question={question} studentAnswer={answer}/>
                            )}
                            {question.Type === QuestionType.FlashCard && (
                                <FlashCard question={question} studentAnswer={answer}/>
                            )}
                            {question.Type === QuestionType.ShortAnswer && (
                                <ShortAnswer question={question} studentAnswer={answer}/>
                            )}
                            {question.Type === QuestionType.Highlighting && (
                                <Highlighting question={question} studentAnswer={answer}/>
                            )}
                        </div>
            )
                })}
          </div>
        </>
    )
}

export default StudentAnswers;