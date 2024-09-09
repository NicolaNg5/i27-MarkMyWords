"use client";
import AddQuestionModal from "@/components/modals/AddQuestionModal";
import GenerateQuestionsModal from "@/components/modals/GenerateQuestionsModal";
import SaveQuestionPoolModal from "@/components/modals/SaveQuestionPool";
import QuestionContainer, { ContainerType } from "@/components/QuestionContainer";
import { Question, QuestionType } from "@/types/question";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const testQuestions: Question[] = [
    { QuestionID: "1", Question: "What is the capital of Nigeria?", Type: QuestionType.MultipleChoice, Options: ["Lagos", "Abuja", "Kano", "Ibadan"], Answer: "Abuja" },
    { QuestionID: "2", Question: "What is the capital of Ghana?", Type: QuestionType.ShortAnswer, Answer: "Accra" },
    { QuestionID: "3", Question: "What is the capital of Togo?", Type: QuestionType.Highlighting },
    { QuestionID: "4", Question: "What is the capital of Benin?", Type: QuestionType.MultipleChoice, Options: ["Lagos", "Porto-Novo", "Kano", "Ibadan"], Answer: "Porto-Novo" },
    { QuestionID: "5", Question: "What is the capital of South Africa?", Type: QuestionType.ShortAnswer},
    { QuestionID: "6", Question: "What is the capital of Kenya?", Type: QuestionType.FlashCard},
    { QuestionID: "7", Question: "What is the capital of Egypt?", Type: QuestionType.MultipleChoice, Options: ["Cairo", "Alexandria", "Luxor", "Aswan"], Answer: "Cairo" },
    { QuestionID: "8", Question: "What is the capital of Morocco?", Type: QuestionType.ShortAnswer},
    { QuestionID: "9", Question: "What is the capital of Algeria?", Type: QuestionType.FlashCard },
    { QuestionID: "10", Question: "What is the capital of Tunisia?", Type: QuestionType.MultipleChoice, Options: ["Tunis", "Sfax", "Sousse", "Bizerte"], Answer: "Tunis" },
    { QuestionID: "11", Question: "What is the capital of Libya?", Type: QuestionType.ShortAnswer},
];

const QuestionPool: React.FC = () => { 
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestions, setNewQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [prompts, setPrompts] = useState<string[]>([]);
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalId, setModalId] = useState<number | null>(null);

    useEffect(() => {
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
        const fetchQuestions = async () => {
        try {
            const res = await fetch("/api/questions")
            const data = await res.json();
            setQuestions(data?.data as Question[]);
        } catch (error) {
            setError("Error generating response");
        }
        };
        fetchQuestions();
    //     fetchAssessment();
      }, []);

    const handleAddQuestion = () => {
        // Implement your logic for adding a new question
    };
    
    const handleRemoveQuestion = () => {
        // Implement your logic for removing a question
    };
    
    const handleGenerateQuestions = () => {
        // Implement your logic for generating questions

    };

    const handleSave = () => {
        // Implement your logic for saving the question list
    };

    const handleEdit = () => {
        // Implement your logic for editing a question
    };
    
    return (
        <>
            <div className="relative h-screen bg-white px-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-black">Question Pool</h1>
                </div>
                <main className="grid grid-cols-12 gap-3">
                    <div className="grid grid-rows-10 col-span-6 gap-2 ">
                        <div className="row-span-8">
                            <QuestionContainer questions={questions} type={ContainerType.Candidates} onAction={handleAddQuestion} onEdit={handleEdit}/>
                        </div>
                        <div className="flex justify-between items-center p-4 row-span-1">
                            <button
                                className="bg-green-400 text-white rounded-md p-2"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setModalId(1);
                                }}
                            >
                                Generate Questions
                            </button>
                            <button
                                className="bg-primary text-white rounded-md p-2"
                                onClick={() =>{
                                    setIsModalOpen(true);
                                    setModalId(2);
                                }}
                            >
                                Add Question
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-rows-10 col-span-6 gap-2 ">
                        <div className="row-span-8">
                            <QuestionContainer questions={newQuestions} type={ContainerType.Quiz} onAction={handleRemoveQuestion} onEdit={handleEdit}/>
                        </div>
                        <div className="flex justify-end p-5 row-span-1">
                            <button
                                className="bg-primary text-white rounded-md p-2"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setModalId(3);
                                }}
                                style={{width: "100px"}}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    <GenerateQuestionsModal onClose={() => {
                        handleGenerateQuestions()
                        setIsModalOpen(false)
                        }} isOpen={isModalOpen && modalId==1}/>
                    <AddQuestionModal onClose={() =>{
                        handleAddQuestion()
                        setIsModalOpen(false)
                    }} isOpen={isModalOpen && modalId==2}/>
                    <SaveQuestionPoolModal onClose={() => {
                        handleSave()
                        setIsModalOpen(false)
                    }} isOpen={isModalOpen && modalId==3}/>
                </main>
                
            </div>
        </>
    )
}


export default QuestionPool;