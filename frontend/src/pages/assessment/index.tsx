'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/modals/Modal';
import AssessmentTable from '@/components/AssessmentTable';
import CreateAssessmentForm from '../../components/modals/CreateAssessmentForm';
import { Assessment } from '@/types/assessment';
import { BiPlus } from 'react-icons/bi';

export default function AssignmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/assessments");
      const data = await res.json();
      setAssessments(data?.data as Assessment[]); //filled with array response
    } catch (error) {
      setError("Error fetching assessments");
    }
  };;

  // Fetch assignments on component mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <>
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-black">Reading Comprehension</h1>
        <Button 
          text="Create Assessment" 
          icon={<BiPlus/>}
          additionalStyling="bg-secondary text-black hover:bg-secondary-dark transition-colors duration-300"
          onClick={() => setIsModalOpen(true)} 
        />
        </div>
        <AssessmentTable assessments={assessments} />
        {/* Modal for Creating Assessments */}
        <Modal title="Create Assessment" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CreateAssessmentForm />
        </Modal>
    </>
  );
}
