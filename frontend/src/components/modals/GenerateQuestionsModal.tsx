import React, { FormEvent, useEffect, useState } from "react";
import Modal from "./Modal";
import { Question } from "@/types/question";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Loading from "../Loading";

interface GenerateQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setQuestions: (any: any) => void;
}

const GenerateQuestionsModal: React.FC<GenerateQuestionsModalProps> = ({
  isOpen,
  onClose,
  setQuestions,
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [id, setId] = useState<string>(router.query.id as string);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id as string);
    }
  }, [router.isReady]);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/prompts");
      const data = await res.json();
      setPrompts(
        data.prompts.filter(
          (prompt: any) => prompt !== "Analyse Reading Material"
        )
      );
    } catch (error) {
      setError("Error fetching prompts");
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const formatOptions = (json: any) => {
    let formattedOptions: any = [];
    Object.keys(json).forEach((key) => {
      key.startsWith("option") ? formattedOptions.push(json[key]) : null;
    });
    return formattedOptions;
  };

  const handleGenerateQuestions = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // fetches the questions from the api
      const res = await fetch(`/api/generate/${id}/${selectedPrompt}`, {
        method: "GET",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
      const data = await res.json();
      console.log("API Response:", data); // Log the raw API response
      const array = JSON.parse(data.response["questions"]);
      const type = data.response["category"];
      console.log("Question Type:", type); // Log the question type
      // maps out the questions and adds them to the questions array
      setQuestions((prev: any) =>
        prev.concat(
          array.map((question: any) => ({
            QuestionID: uuidv4(),
            AssessmentID: id as string,
            Question: question.question,
            Category: question.category,
            Type: question.type ?? type,
            Options: formatOptions(question),
            Answer: question.answer,
          })) as Question[]
        )
      );
    } catch (error) {
      setError("Error fetching questions");
    }
    setLoading(false);
    onClose();
  };

  return (
    <Modal title="Generate Questions" onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleGenerateQuestions}>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-between">
            <select
              className=" text-black px-4 py-2 rounded hover:bg-grey-300"
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
            >
              <option value="" disabled>
                Select a prompt
              </option>
              {prompts.map((prompt) => (
                <option key={prompt} value={prompt}>
                  {prompt}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark flex-end"
            >
              Confirm
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default GenerateQuestionsModal;
