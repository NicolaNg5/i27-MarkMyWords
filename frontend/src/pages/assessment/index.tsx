'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/modals/Modal';
import AssessmentTable from '@/components/AssessmentTable';
import CreateAssessmentForm from '../../components/modals/CreateAssessmentForm';
import { Assessment } from '@/types/assessment';
import { BiPlus } from 'react-icons/bi';
import Loading from '@/components/Loading';
import EditAssessmentModal from '@/components/modals/EditAssessmentModal';
import DeleteAssessmentModal from '@/components/modals/DeleteAssessmentModal';

export default function AssignmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/getassessments");
      const data = await res.json();
      setAssessments(data?.data as Assessment[]); //filled with array response
    } catch (error) {
      setError("Error fetching assessments");
    }
    setLoading(false);
  };

  // Fetch assignments on component mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <div className='p-8'>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Reading Comprehension</h1>
          <Button 
            text="Create Assessment" 
            icon={<BiPlus/>}
            additionalStyling="bg-secondary text-black hover:bg-secondary-dark transition-colors duration-300"
            onClick={() => {
              setIsModalOpen(true)
              setModalId(1)
            }}/>
        </div>
        {loading ? <Loading /> : (
          <AssessmentTable assessments={assessments} setIsModalOpen={setIsModalOpen} setModalId={setModalId} setSelectedAssessment={setSelectedAssessment}/>
        )}
        <EditAssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} assessment={selectedAssessment!} />
        <DeleteAssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} assessment={selectedAssessment!} />
        {/* Modal for Creating Assessments */}
        <Modal title="Create Assessment" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CreateAssessmentForm />
        </Modal>
    </div>
  );
}
