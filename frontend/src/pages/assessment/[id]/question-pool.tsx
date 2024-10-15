"use client";
import Loading from "@/components/Loading";
import QuestionDetailsForm from "@/components/modals/QuestionDetailsForm";
import GenerateQuestionsModal from "@/components/modals/GenerateQuestionsModal";
import SaveQuestionPoolModal from "@/components/modals/SaveQuestionPool";
import QuestionContainer, { ContainerType } from "@/components/QuestionContainer";
import { Question, QuestionType } from "@/types/question";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const QuestionPool: React.FC = () => { 
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestions, setNewQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalId, setModalId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [id, setId] = useState<string>( router.query.id as string);
    useEffect(() => {
        if(router.isReady){
        setId(router.query.id as string);
        }
    }, [router.isReady]);

    //fetch questions for this specific assessment to display in selected questions column
    const fetchAssessmentQuestions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/question/${id}`);
            const data = await res.json();
            setNewQuestions(data?.data as Question[]);
        } catch (error) {
            setError("Error fetching questions");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAssessmentQuestions();
    }, [id]);

    useEffect(() => {
        // console.log(questions)
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
    
    const handleCreateQuestion = (question: Question) => {
        // Implement your logic for creating a new question
        question.AssessmentID = id;
        setQuestions((prev) => prev ? [...prev, question] : [question]);
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
            { loading ? <Loading/> : (
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
                                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </button>
                            <div>
                                <button
                                    className="bg-green-400 text-white rounded-md p-2 mr-2"
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
                    <QuestionDetailsForm 
                        onClose={() =>{setIsModalOpen(false)}} 
                        isOpen={isModalOpen && modalId==2}
                        title="Create Question"
                        onSubmit={handleCreateQuestion}
                    />
                    <SaveQuestionPoolModal
                        onClose={() =>{setIsModalOpen(false)}} 
                        isOpen={isModalOpen && modalId==3}
                        questions={newQuestions}
                    />
                </main>
            </div> )}
        </>
                           
    )
}


export default QuestionPool;