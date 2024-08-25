// src/pages/assessments.tsx
"use client"; // This is a client component 👈🏽

import React from "react";
import { useState } from "react";

import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import Button from "../components/Button";
import Modal from "../components/Modal";
import CreateAssessmentForm from "./CreateAssessmentForm";
const Assessments: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  const handleCreateAssessment = () => {
    // Handle the creation logic here
    console.log("Create new assessment");
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Reading Comprehension</h1>
        <Button text="+ Create Assessment" onClick={openModal} />
      </div>
      <Table />
      {/* Modal for Creating Assessments */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateAssessmentForm />
      </Modal>
    </DashboardLayout>
  );
};

export default Assessments;
