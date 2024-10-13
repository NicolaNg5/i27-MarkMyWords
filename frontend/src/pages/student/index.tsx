// src/pages/assessment/[id].tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import ShortAnswerQuestion from "@/components/ShortAnswerQuestion";
import QuestionNavigation from "@/components/QuestionNavigation";
import Timer from "@/components/Timer";
import FlashcardQuestion from "@/components/FlashCardQuestion";
import TextHighlight from "@/components/TextHighlight";
import { Question, QuestionType } from "@/types/question";
import { StudentAnswer } from "@/types/studentAns";
import { v4 as uuid } from "uuid";
import { Assessment } from "@/types/assessment";
import Loading from "@/components/Loading";
import Modal from "@/components/modals/Modal";

interface FlashcardAnswer {
  true: string[];
  false: string[];
}
const StudentView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<
    Record<string, string | FlashcardAnswer>
  >({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [error, setError] = useState<string | null>(null);
  const [referenceText, setReferenceText] = useState("");
  const [formattedQuestions, setFormattedQuestions] = useState<Question[]>([]);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const id = "c5f2d012-b6fc-4088-beb7-a73d7f5b3c7b"

  const fetchAssessment= async () => {
    try {
      const res = await fetch(`/api/assessment/${id}`);
      const data = await res.json();
      setAssessment(data?.data[0] as Assessment);
    } catch (error) {
      setError("Error fetching assessment");
    }
  }

  const fetchReadingMaterial = async () => {
    try {
      const res = await fetch(`/api/assessment-content/${id}`);
      const data = await res.json();
      setReferenceText(data["file_content"] as string);
    } catch (error) {
      setError("Error fetching reading material: " + error); 
    }
  }

  const fetchAssessmentQuestions = async () => {
    try {
      const res = await fetch(`/api/question/${id}`);
      const data = await res.json();

      setQuestions(data?.data as Question[]);
      setCurrentQuestion(1)
    } catch (error) {
      setError("Error fetching questions");
    }
  }

  useEffect(() => {
    // fetchAssessmentData();
    fetchAssessment();
    fetchReadingMaterial();
  }, [id]);

  useEffect(() => {
    fetchAssessmentQuestions();
  }, [assessment]);

  // Convert questions
  useEffect(() => {
    let hasFormattedFlashcard = false;
    const flashcardQuestions: Question[] = questions.filter(
      (q) => {
        if(q.Type === QuestionType.FlashCard)
          if (hasFormattedFlashcard) {
            return false;
          } else {
            hasFormattedFlashcard = true;
            return true;
          }
        }
    );

    const formatted: Question[] = flashcardQuestions.map((q: Question) => {
        // Combine True/False questions into a single Flashcard question
        return {
          ...q,
          Question: "Drag the cards to their correct field:",
          Type: QuestionType.FlashCard,
          Options: questions
            .filter(
              (fq) =>
                fq.Type === QuestionType.FlashCard &&
                fq.AssessmentID === q.AssessmentID
            )
            .map((fq) => fq.Question),
        };
    });

    

    const newQuestions: Question[] = questions.filter( q => q.Type !== QuestionType.FlashCard);

    setFormattedQuestions([...newQuestions, ...formatted]);
  }, [questions, referenceText]);

  const handleAnswerChange = (
    questionId: string,
    answer: string | FlashcardAnswer
  ) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleNavigation = (questionNumber: number) => {;
    setCurrentQuestion(questionNumber);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmitAnswers = async () => {
    if (Object.keys(answers).length < formattedQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    } else {
      try {
        const answersToSend: StudentAnswer[] = [];
        for (const [questionId, answer] of Object.entries(answers)) {
          if (typeof answer === "string") {
            // Short Answer and Highlighting
            answersToSend.push({
              AnswerID: uuid(),
              QuestionID: questionId,
              Answer: answer,
              StudentID: "f94f1e58-3cbf-413e-af4d-efcf88bb5ede",
              AssessmentID: id
            });
          } else {
            // Flashcard 
            // Find the combined Flashcard question in formattedQuestions
            const combinedFlashcardQuestion = formattedQuestions.find(
              (q) => q.Type === QuestionType.FlashCard && q.QuestionID === questionId
            );
    
            if (combinedFlashcardQuestion) {
              const AssessmentID = combinedFlashcardQuestion.AssessmentID;
              const originalFlashcardQuestions = questions.filter(
                (q) => q.Type === QuestionType.FlashCard && q.AssessmentID === AssessmentID
              );
    
              // Iterate through the original True/False questions 
              originalFlashcardQuestions.forEach((originalQuestion) => {
                // Determine if the answer is true or false
                let answerValue = "False"; 
                if (answer.true.includes(originalQuestion.Question)) {
                  answerValue = "True";
                }

                answersToSend.push({
                  AnswerID: uuid(),
                  QuestionID: originalQuestion.QuestionID,
                  Answer: answerValue,
                  StudentID: "f94f1e58-3cbf-413e-af4d-efcf88bb5ede",
                  AssessmentID: id,
                });
              });
            }
          }
        }
    
        console.log("Answers to send:", answersToSend);
        const answersText = JSON.stringify(answersToSend);
    
        const res = await fetch("/api/submit_answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" }, 
          body: answersText, 
        });
    
        if (res.ok) {
          alert("Answers submitted successfully!");
          setAnswersSubmitted(true);
        } else {
          throw new Error(`Error submitting answers: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        console.error("Error submitting answers:", error);
        setError("Error submitting answers. Please try again.");
      }
    }
  };

  const handleAnalyseAnswers = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/analyse_answers/${id}`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Frontend - Analysis Results:", data);
        alert("Answers analysed successfully! Check backend console.");
      } else {
        throw new Error(
          `Error analysing answers: ${res.status} ${res.statusText}`
        );
      }
    } catch (error) {
      console.error("Frontend - Error:", error);
      setError("Error analyzing answers.");
    }
  };

  const currentQuestionData = formattedQuestions[currentQuestion - 1];
  return (
    <div className="flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl">{assessment?.Title} </h1>
        <Timer timeLeft={timeLeft} />
      </header>

      <div className="grid place-items-center p-4 mb-9" style={{minHeight: "600px"}}>
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6">
          {formattedQuestions.length > 0 ? (
            currentQuestionData && (
              (() => {
                switch (currentQuestionData.Type) {
                  case QuestionType.MultipleChoice:
                    return (
                      <MultipleChoiceQuestion
                        questionNumber={currentQuestion}
                        questionText={currentQuestionData.Question}
                        options={currentQuestionData.Options || []}
                        selectedAnswer={
                          (answers[currentQuestionData.QuestionID] as string) || null
                        }
                        onAnswerSelect={(answer) =>
                          handleAnswerChange(currentQuestionData.QuestionID, answer)
                        }
                      />
                    );
                  case QuestionType.ShortAnswer:
                    return (
                      <ShortAnswerQuestion
                        questionNumber={currentQuestion}
                        questionText={currentQuestionData.Question}
                        answer={(answers[currentQuestionData.QuestionID] as string) || ""}
                        onAnswerChange={(answer) =>
                          handleAnswerChange(currentQuestionData.QuestionID, answer)
                        }
                      />
                    );
                  case QuestionType.FlashCard:
                    return (
                      <FlashcardQuestion
                        question={currentQuestionData}
                        onAnswerChange={(answer) =>
                          handleAnswerChange(currentQuestionData.QuestionID, answer)
                        }
                        savedAnswer={
                          answers[currentQuestionData.QuestionID] as
                          | FlashcardAnswer
                          | undefined
                        }
                      />
                    );
                  case QuestionType.Highlighting: // Handle the new highlighting question type
                    return (
                      <TextHighlight
                        questionNumber={currentQuestion}
                        questionText={currentQuestionData.Question}
                        content={referenceText}
                        highlightedText={(answers[currentQuestionData.QuestionID] as string) || ""}
                        onHighlight={(highlightedText) =>
                          handleAnswerChange(currentQuestionData.QuestionID, highlightedText)
                        }
                      />
                    );
                  default:
                    return <div>Unsupported question type</div>;
                }
              })()
            )
          ) : (
            <div>Loading questions...</div> // Loading message
          )}
        </div>
      </div>

      <QuestionNavigation
        totalQuestions={formattedQuestions.length}
        currentQuestion={currentQuestion}
        onNavigate={handleNavigation}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      <div className="inline-block flex justify-center"> {/* Apply inline-block to the container */}
        <button
          onClick={handleSubmitAnswers}
          // disabled={Object.keys(answers).length < formattedQuestions.length}
          className="bg-primary px-4 py-2 rounded-md text-white font-semibold"
        >
          Submit Answers
        </button>
        {loading && (
          <Modal title="Saving Questions" isOpen={loading} onClose={()=> {}} disableClose>
            <Loading/>
          </Modal>
        )}
        {answersSubmitted && (
          <button onClick={handleAnalyseAnswers} className="bg-yellow-500 ml-2 text-white font-bold py-2 px-4 rounded">
            Get Feedback
          </button>
        )}
      </div>
    </div>
  );
};
export default StudentView;