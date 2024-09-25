import React, { FormEvent, useEffect, useState } from "react";
import Modal from "./Modal";
import { Question, QuestionCategory, QuestionType } from "@/types/question";
import { v4 as uuidv4 } from "uuid";

interface QuestionDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: Question) => void;
  title: string;
  question?: Question;
}

const defaultQuestion: Question = {
  QuestionID: "",
  Type: QuestionType.MultipleChoice,
  Category: QuestionCategory.Literal,
  Question: "",
  Options: [],
  Answer: "",
};

const QuestionDetailsForm: React.FC<QuestionDetailsFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  question = defaultQuestion,
}) => {
  const [questionText, setQuestionText] = useState<string>(question.Question);
  const [category, setCategory] = useState<QuestionCategory>(
    question.Category!
  );
  const [type, setType] = useState<QuestionType>(question.Type);
  const [options, setOptions] = useState<string[]>(question.Options!);
  const [answer, setAnswer] = useState<string>(question.Answer!);

  const handleQuestionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setType(e.target.value as QuestionType);
    setAnswer("");
  };

  const handleOptions = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = [...options];
    if (e.target.value != "") {
      newOptions[index] = e.target.value;
      setOptions(newOptions);
    } else {
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleClose = () => {
    setQuestionText("");
    setCategory(QuestionCategory.Literal);
    setType(QuestionType.MultipleChoice);
    setOptions([]);
    setAnswer("");
    onClose();
  };

  useEffect(() => {
    if (question) {
      setQuestionText(question.Question);
      setCategory(question.Category!);
      setType(question.Type);
      setOptions(question.Options!);
      setAnswer(question.Answer!);
    }
  }, [question]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const new_question: Question = {
      QuestionID: question?.QuestionID === "" ? uuidv4() : question?.QuestionID,
      Type: type,
      Category: category,
      Question: questionText,
      Options: options,
      Answer: answer,
    };
    if (new_question != question) {
      onSubmit(new_question);
    }
    handleClose();
  }

  return (
    <Modal title={title} onClose={handleClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Type</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={type}
            onChange={(e) => handleQuestionTypeChange(e)}
            required
          >
            <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
            <option value={QuestionType.ShortAnswer}>Short Answer</option>
            <option value={QuestionType.FlashCard}>Flash Card</option>
            <option value={QuestionType.Highlighting}>Highlighting</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value as QuestionCategory)}
            required
          >
            <option value={QuestionCategory.Literal}>Literal</option>
            <option value={QuestionCategory.Inferential}>Inferential</option>
          </select>
        </div>
        {type === QuestionType.MultipleChoice && (
          <>
            <div className="mb-4">
              <label className="block mb-2">Question</label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between my-1">
                <label className="block mr-2">1.</label>
                <input
                  type="text"
                  value={options[0]}
                  onChange={(e) => handleOptions(e, 0)}
                  className="w-full border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between my-1">
                <label className="block mr-2">2.</label>
                <input
                  type="text"
                  value={options[1]}
                  onChange={(e) => handleOptions(e, 1)}
                  className="w-full border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between my-1">
                <label className="block mr-2">3.</label>
                <input
                  type="text"
                  value={options[2]}
                  onChange={(e) => handleOptions(e, 2)}
                  className="w-full border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between my-1">
                <label className="block mr-2">4.</label>
                <input
                  type="text"
                  value={options[3]}
                  onChange={(e) => handleOptions(e, 3)}
                  className="w-full border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Answer</label>
              <select
                className="w-full p-2 border"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              >
                <option className="text-gray-200" value="" disabled>
                  Pick an option as the answer
                </option>
                {options.map((option, index) => (
                  <option key={index} value={"option" + (index + 1)}>
                    Option {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        {type === QuestionType.ShortAnswer && (
          <>
            <div className="">
              <label className="block mb-2">Question</label>
              <textarea
                value={questionText}
                rows={2}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Suggested Answer:</label>
              <textarea
                value={answer}
                rows={3}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </>
        )}
        {type === QuestionType.FlashCard && (
          <>
            <div className="">
              <label className="block mb-2">Card</label>
              <textarea
                value={questionText}
                rows={2}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Answer</label>
              <input
                type="text"
                value={answer}
                placeholder="True or False"
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}
        {type === QuestionType.Highlighting && (
          <>
            <div className="">
              <label className="block mb-2">Question</label>
              <textarea
                value={questionText}
                rows={5}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Answer</label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </>
        )}
        <div className="flex justify-between">
          <div></div>
          <button
            type="submit"
            className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark flex-end"
          >
            Done
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuestionDetailsForm;
