// src/components/CreateAssessmentForm.tsx

import { randomUUID } from "crypto";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import Loading from "../Loading";
import { Assessment } from "@/types/assessment";

interface EditAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment;
}

const EditAssessmentModal: React.FC<EditAssessmentModalProps> = ({isOpen, onClose, assessment}) => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ title, topic, dueDate, });

    const new_assessment = JSON.stringify({
      "title": title,
      "topic": topic,
      "class_id": "5cbb6db4-8601-4b16-a834-a5085437c707",
      "due_date": dueDate as string,
    //   "reading_file_name": file?.name,
    })

    await fetch('http://localhost:3000/api/postassessment', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: new_assessment,
    });

    router.reload(); //reloads to display added assessment
  };

  return (
    <>
    {loading ? <Loading /> : (
      <form onSubmit={handleSubmit} className="text-black">
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Reading Material</label>
            <div className="border border-gray-300 rounded p-4 text-center">
              <div className="flex flex-col space-y-4   ...">
                {/* {file ? (
                  <p>{file.name}</p>
                ) : (
                  <div>
                    <b>Upload file here</b>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark"
            >
              Create
            </button>
          </div> 
      </form>
    )}
    </>
  );
};

export default EditAssessmentModal;