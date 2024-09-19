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
        QuestionID: "1",
        Type: QuestionType.MultipleChoice,
        Question: "What is the capital of France?",
        Options: ["London", "Berlin", "Paris", "Madrid"],
      },
      {
        QuestionID: "2",
        Type: QuestionType.ShortAnswer,
        Question: "What is the meaning of ...?",
      },
      {
        QuestionID: "3",
        Type: QuestionType.ShortAnswer,
        Question: "What is the meaning of ...?",
      },
      {
        QuestionID: "4",
        Type: QuestionType.ShortAnswer,
        Question: "What is the meaning of ...?",
      },
      {
        QuestionID: "5",
        Type: QuestionType.MultipleChoice,
        Question: "What is the capital of France?",
        Options: ["London", "Berlin", "Paris", "Madrid"],
      },
      {
        QuestionID: "6",
        Type: QuestionType.FlashCard,
        Question: "Sample Question",
        Options: [
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
        question: "Highlight the most important part of the text below",
        content: "Romeo and Juliet is a tragedy written by William Shakespeare early in his career about two young star-crossed lovers whose deaths ultimately reconcile their feuding families. It was among Shakespeare's most popular plays during his lifetime and, along with Hamlet, is one of his most frequently performed plays. Today, the title characters are regarded as archetypal young lovers. Romeo and Juliet belongs to a tradition of tragic romances stretching back to antiquity. Its plot is based on an Italian tale translated into verse as The Tragical History of Romeus and Juliet by Arthur Brooke in 1562 and retold in prose in Palace of Pleasure by William Painter in 1567. Shakespeare borrowed heavily from both but expanded the plot by developing supporting characters, particularly Mercutio and Paris."
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

