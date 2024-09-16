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
  useEffect(() => {
    const sampleQuestions: Question[] = [
      {
        id: "1",
        type: QuestionType.MultipleChoice,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
      },
      {
        id: "2",
        type: QuestionType.ShortAnswer,
        question: "What is the meaning of ...?",
      },
      {
        id: "3",
        type: QuestionType.ShortAnswer,
        question: "What is the meaning of ...?",
      },
      {
        id: "4",
        type: QuestionType.ShortAnswer,
        question: "What is the meaning of ...?",
      },
      {
        id: "5",
        type: QuestionType.MultipleChoice,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
      },
      {
        id: "6",
        type: QuestionType.FlashCard,
        question: "Sample Question",
        options: [
          "Juliet feels grief for the loss of Tybalt upon hearing about his death",
          "The Nurse promises to bring Romeo to Juliet the same night",
          "Juliet renounces her initial feelings of anger towards Romeo and focuses on grief for his banishment",
          "Capulet invites Count Paris to a party that night",
          "Romeo attempts suicide upon hearing about Juliet's grief",
        ],
      },
      {
        id: "7",
        type: QuestionType.Highlighting, // New Highlighting Question
        question: "Highlight the most important part of the text below:",
        content: "Romeo and Juliet is a play by William Shakespeare about two young star-crossed lovers."
      }
    ];

    setQuestions(sampleQuestions);
  }, []);

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

  const currentQuestionData = questions[currentQuestion - 1];
  return (
    <div className="flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl">Assessment {id}</h1>
        <Timer timeLeft={timeLeft} />
      </header>

      <div className="flex flex-col items-center p-4 mb-9">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6">
          {currentQuestionData &&
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

            })()}
        </div>
      </div>

      <QuestionNavigation
        totalQuestions={questions.length}
        currentQuestion={currentQuestion}
        onNavigate={handleNavigation}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};
export default AssessmentPage;

