// src/components/CreateAssessmentForm.tsx

import { randomUUID } from "crypto";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import Loading from "../Loading";
import { Assessment } from "@/types/assessment";
import Modal from "./Modal";

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

  useEffect(() => {
    setTitle(assessment?.Title)
    assessment?.dueDate ? setDueDate(assessment?.dueDate.toString()) : ""
    setTopic(assessment?.Topic)
  },[assessment])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission logic
    console.log({ title, topic, dueDate, });

    const new_assessment: any = {"assessment_id": assessment.Assessmentid};

    //check if the values are different from the original assessment
    title !== assessment.Title ? new_assessment["title"] = title : undefined;
    topic !== assessment.Topic ? new_assessment["topic"] = topic : undefined;
    dueDate !== assessment.dueDate.toString() ? new_assessment["dueDate"] = dueDate.toString() : undefined;

    console.log(new_assessment);

    await fetch('http://localhost:3000/api/putassessment', { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(new_assessment),
    });
    setLoading(false);
    onClose();

    router.reload();
  };

  return (
    <>
    <Modal title="Edit Assessment" onClose={onClose} isOpen={isOpen}>
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
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark"
              >
                Confirm
              </button>
            </div> 
        </form>
      )}
    </Modal>
    </>
  );
};

export default EditAssessmentModal;