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

interface FlashcardAnswer {
  true: string[];
  false: string[];
}
const AssessmentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
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

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        //Fetch questions for quiz
        const res = await fetch("/api/quiz");
        const questionsData = await res.json();

        if (questionsData.error) {
          throw new Error(questionsData.error);
        }

        setQuestions(questionsData.questions);

        // Fetch reading material
        const textRes = await fetch("/api/reading_material");
        const textData = await textRes.json();

        if (textData.error) {
          throw new Error(textData.error);
        }

        setReferenceText(textData.text);
      } catch (error) {
        console.error("Error fetching assessment data:", error);
        setError("Failed to load assessment data.");
      }
    };

    fetchAssessmentData();
  }, []);

  // Convert questions
  useEffect(() => {
    let hasFormattedFlashcard = false;

    const formatted = questions.filter((q) => {
      if (q.type === QuestionType.FlashCard) {
        if (hasFormattedFlashcard) {
          return false;
        } else {
          hasFormattedFlashcard = true;
          return true;
        }
      }
      return true;
    }).map((q) => {
      if (q.type === QuestionType.FlashCard) {
        // Combine True/False questions into a single Flashcard question
        return {
          ...q,
          question: "Drag the cards to their correct field:",
          type: QuestionType.FlashCard,
          options: questions
            .filter(
              (fq) =>
                fq.type === QuestionType.FlashCard &&
                fq.assessmentID === q.assessmentID
            )
            .map((fq) => fq.question),
        };
      } else if (q.type === QuestionType.Highlighting) {
        return {
          ...q,
          content: referenceText,
        };
      } else {
        return q;
      }
    });

    setFormattedQuestions(formatted);
  }, [questions, referenceText]);

  const handleAnswerChange = (
    questionId: string,
    answer: string | FlashcardAnswer
  ) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleNavigation = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmitAnswers = async () => {
    try {
      const answersToSend: StudentAnswer[] = [];
  
      for (const [questionId, answer] of Object.entries(answers)) {
        if (typeof answer === "string") {
          // Short Answer and Highlighting
          answersToSend.push({
            ansID: uuid(),
            questionID: questionId,
            answer: answer,
            studentID: "1",
            assessmentID: "1"
          });
        } else {
          // Flashcard 
          // Find the combined Flashcard question in formattedQuestions
          const combinedFlashcardQuestion = formattedQuestions.find(
            (q) => q.type === QuestionType.FlashCard && q.id === questionId
          );
  
          if (combinedFlashcardQuestion) {
            const assessmentId = combinedFlashcardQuestion.assessmentID;
            const originalFlashcardQuestions = questions.filter(
              (q) => q.type === QuestionType.FlashCard && q.assessmentID === assessmentId
            );
  
            // Iterate through the original True/False questions 
            originalFlashcardQuestions.forEach((originalQuestion) => {
              // Determine if the answer is true or false
              let answerValue = "False"; 
              if (answer.true.includes(originalQuestion.question)) {
                answerValue = "True";
              }

              answersToSend.push({
                ansID: uuid(),
                questionID: originalQuestion.id,
                answer: answerValue,
                studentID: "1",
                assessmentID: "1"
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
  };

  const handleAnalyseAnswers = async () => {
    setError(null);
    try {
      const res = await fetch("/api/analyse_answers", {
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
        <h1 className="text-xl">Assessment {id}</h1>
        <Timer timeLeft={timeLeft} />
      </header>

      <div className="flex flex-col items-center p-4 mb-9">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6">
          {formattedQuestions.length > 0 ? (
            currentQuestionData && (
              (() => {
                switch (currentQuestionData.type) {
                  case QuestionType.MultipleChoice:
                    return (
                      <MultipleChoiceQuestion
                        questionNumber={currentQuestion}
                        questionText={currentQuestionData.question}
                        options={currentQuestionData.options || []}
                        selectedAnswer={
                          (answers[currentQuestionData.id] as string) || null
                        }
                        onAnswerSelect={(answer) =>
                          handleAnswerChange(currentQuestionData.id, answer)
                        }
                      />
                    );
                  case QuestionType.ShortAnswer:
                    return (
                      <ShortAnswerQuestion
                        questionNumber={currentQuestion}
                        questionText={currentQuestionData.question}
                        answer={(answers[currentQuestionData.id] as string) || ""}
                        onAnswerChange={(answer) =>
                          handleAnswerChange(currentQuestionData.id, answer)
                        }
                      />
                    );
                  case QuestionType.FlashCard:
                    return (
                      <FlashcardQuestion
                        question={currentQuestionData}
                        onAnswerChange={(answer) =>
                          handleAnswerChange(currentQuestionData.id, answer)
                        }
                        savedAnswer={
                          answers[currentQuestionData.id] as
                          | FlashcardAnswer
                          | undefined
                        }
                      />
                    );
                  case QuestionType.Highlighting: // Handle the new highlighting question type
                    return (
                      <TextHighlight
                        questionNumber={currentQuestion}
                        questionText={currentQuestionData.question}
                        content={currentQuestionData.content || ""}
                        highlightedText={(answers[currentQuestionData.id] as string) || ""}
                        onHighlight={(highlightedText) =>
                          handleAnswerChange(currentQuestionData.id, highlightedText)
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
          disabled={Object.keys(answers).length < formattedQuestions.length}
          className="bg-primary px-4 py-2 rounded-md text-white font-semibold"
        >
          Submit Answers
        </button>
        
        {answersSubmitted && (
          <button onClick={handleAnalyseAnswers} className="bg-yellow-500 ml-2 text-white font-bold py-2 px-4 rounded">
            Get Feedback
          </button>
        )}
      </div>
    </div>
  );
};
export default AssessmentPage;