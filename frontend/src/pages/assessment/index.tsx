'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import AssessmentTable from '@/components/AssessmentTable';
import CreateAssessmentForm from './CreateAssessmentForm';


async function getAssessments() {
  const res = await fetch('http://localhost:3000/assignment.json', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}

export default function AssignmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);

  const fetchAssessments = async () => {
    const data = await getAssessments();
    setAssessments(data);
  };

  // Fetch assignments on component mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <>
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Reading Comprehension</h1>
        <Button text="+ Create Assessment" onClick={() => setIsModalOpen(true)} />
        </div>
        <AssessmentTable assessments={assessments} />
        {/* Modal for Creating Assessments */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CreateAssessmentForm />
        </Modal>
    </>
  );
}
