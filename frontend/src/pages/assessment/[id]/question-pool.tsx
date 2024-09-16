"use client";
import CreateQuestionModal from "@/components/modals/AddQuestionModal";
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
    const [readingMaterial, setReadingMaterial] = useState<string>("");
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalId, setModalId] = useState<number | null>(null);

    //fetch questions for this specific assessment to display in selected questions column
    const fetchAssessmentQuestions = async () => {
        try {
            const res = await fetch(`/api/question/${id}`);
            const data = await res.json();
            setNewQuestions(data?.data as Question[]);
        } catch (error) {
            setError("Error fetching questions");
        }
    };

    useEffect(() => {
        fetchAssessmentQuestions();
    }, []);

    useEffect(() => {
        console.log(questions)
    }, [questions]);

    //add question to selected questions column
    const handleAddQuestion = (question: Question) => {
        setNewQuestions((prev) => prev ? [...prev, question] : [question]);
        setQuestions((prev) => prev.filter((q) => q.QuestionID !== question.QuestionID));
    };
    
    //remove question from selected questions column
    const handleRemoveQuestion = (question: Question) => {
        setQuestions((prev) => prev ? [...prev, question] : [question]);
        setNewQuestions((prev) => prev.filter((q) => q.QuestionID !== question.QuestionID));
    };
    
    const handleCreateQuestion = () => {
        // console.log(questions)
        // Implement your logic for creating a new question
    };

    const handleSave = async () => {
        // Implement your logic for saving the question list
        try {
            const res = await fetch("/api/save_questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newQuestions.map(question => JSON.stringify(question))),
            });
            const data = await res.json();
            if (data?.status === "success") {
                alert("Questions saved successfully");
            } else {
                alert("Error saving questions");
            }
        } catch (error) {
            setError("Error saving questions");
        }

    };

    
    return (
        <>
            <div className="bg-white px-12 pt-2">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-black">Question Pool</h1>
                </div>
                <div className="flex justify-between mt-2 text-gray-500">
                    <p>Questions</p>
                    <p>Selected Questions</p>
                </div>
                <main className="grid grid-cols-12 gap-3">
                    <div className="grid grid-rows-8 col-span-6 gap-2 ">
                        <div className="row-span-7">
                            <QuestionContainer questions={questions} type={ContainerType.Candidates} onAction={handleAddQuestion} setQuestions={setQuestions}/>
                        </div>
                        <div className="flex justify-between items-center p-4 row-span-1 py-0">
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
                                Create Question
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-rows-8 col-span-6 gap-2 ">
                        <div className="row-span-7">
                            <QuestionContainer questions={newQuestions} type={ContainerType.Quiz} onAction={handleRemoveQuestion} setQuestions={setNewQuestions}/>
                        </div>
                        <div className="flex justify-between items-center p-4 row-span-1 py-0">
                            <div/>
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
                    <GenerateQuestionsModal 
                        onClose={() => {setIsModalOpen(false)}} 
                        isOpen={isModalOpen && modalId==1}
                        setQuestions={setQuestions}
                    />
                    <CreateQuestionModal 
                        onClose={() =>{setIsModalOpen(false)}} 
                        isOpen={isModalOpen && modalId==2}
                        onSubmit={() => {handleCreateQuestion()}}
                    />
                    <SaveQuestionPoolModal
                        onClose={() =>{setIsModalOpen(false)}} 
                        isOpen={isModalOpen && modalId==3}
                        questions={newQuestions}
                    />
                </main>
                
            </div>
        </>
    )
}


export default QuestionPool;