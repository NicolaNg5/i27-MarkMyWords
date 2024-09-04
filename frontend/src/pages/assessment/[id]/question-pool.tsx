"use client";
import Layout from "@/components/layout";
import QuestionContainer from "@/components/QuestionContainer";
import { Assessment } from "@/types/assessment";
import { Question, QuestionType } from "@/types/question";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const testQuestions: Question[] = [
    { id: "1", question: "What is the capital of Nigeria?", type: QuestionType.MultipleChoice },
    { id: "2", question: "What is the capital of Ghana?", type: QuestionType.ShortAnswer },
    { id: "3", question: "What is the capital of Togo?", type: QuestionType.FlashCard },
    { id: "4", question: "What is the capital of Benin?", type: QuestionType.MultipleChoice },
];

const QuestionPool: React.FC = () => { 
    const [questions, setQuestions] = useState<Question[]>([]);
    const [assessment, setAssessment] = useState<Assessment>({} as Assessment);
    const [error, setError] = useState<string | null>(null);
    const [prompts, setPrompts] = useState<string[]>([]);
    const router = useRouter();
    const { id } = router.query;

    // useEffect(() => {
    //     const fetchAssessment= async () => {
    //       try {
    //         const res = await fetch(`/api/assessment/${id}`);
    //         const data = await res.json();
    //         setAssessment(data?.data[0] as Assessment);
    //       } catch (error) {
    //         setError("Error fetching assessment");
    //       }
    //     }
    //     const fetchQuestions2 = async () => {
    //         try {
    //           const res = await fetch(`/api/questions?assessmentId=${id}`);
    //           const data = await res.json();
    //           setQuestions(data?.data as Question[]);
    //         } catch (error) {
    //           setError("Error fetching questions");
    //         }
    //       }
    //     const fetchQuestions = async () => {
    //     try {
    //         const res = await fetch("/api/generate", {
    //         method: "POST",
    //         headers: { "Content-Type": "text/plain; charset=UTF-8" },
    //         body: "",
    //         });
    
    //         const data = await res.json();
    //         setQuestions(data?.data as Question[]);
    //     } catch (error) {
    //         setError("Error generating response");
    //     }
    //     };
    //     fetchQuestions();
    //     fetchAssessment();
    //   }, []);

    const handleGenerateQuestions = () => {
        // Implement your logic for generating questions
      };
    
      const handleAddQuestion = () => {
        // Implement your logic for adding a new question
      };
    
      const handleSave = () => {
        // Implement your logic for saving the questions
      };

    return (
        <>
            <div className="relative h-screen bg-white">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-black">Question Pool</h1>
                </div>
                <main className="grid grid-cols-12 gap-3">
                    <div className="grid grid-rows-12 col-span-6 gap-2 ">
                        <div className="row-span-11">
                            <QuestionContainer questions={questions} answer={""}/>
                        </div>
                        <div className="flex justify-inbetween gap-4 row-span-1">
                            <button
                                className="bg-green-400 text-white rounded-md p-2"
                                onClick={handleGenerateQuestions}
                            >
                                Generate Questions
                            </button>
                            <button
                                className="bg-primary text-white rounded-md p-2"
                                onClick={handleAddQuestion}
                            >
                                Add Question
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-rows-6 col-span-6">
                        {/* <div className="grid">
                            <div className="row-span-">
                                <QuestionContainer questions={questions} answer={""}/>
                            </div>
                            <div className="row-span-1">
                                <button
                                    className="bg-primary text-white rounded-md p-2"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div> */}
                    </div>
                </main>
            </div>
        </>
    )
}


export default QuestionPool;