import React, { useState } from 'react';
import Card from "./Cards";
import ReleaseAssessmentModal from './modals/ReleaseAssessmentModal';
import StudentList from './StudentList';
import { useRouter } from 'next/router';
import { Student } from '@/types/student';
import { Assessment } from '@/types/assessment';
import { PiPencil } from 'react-icons/pi';
import { RxRocket } from 'react-icons/rx';
import { CgClose } from 'react-icons/cg';
import { MdLibraryBooks, MdOutlineAnalytics } from 'react-icons/md';
import { BiQuestionMark } from 'react-icons/bi';
import Button from './Button';
import EditAssessmentModal from './modals/EditAssessmentModal';
import CloseAssessmentModal from './modals/CloseAssessmentModal';

interface DashboardProps {
    basePath: string,
    students: Student[],
    assessment: Assessment,
}

const Dashboard: React.FC<DashboardProps> = ({basePath, students, assessment}: DashboardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalId, setModalId] = useState<number | null>(null);

    const handleModal = (id: number) => {
        setIsModalOpen(true);
        setModalId(id);
        
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-3 text-white">
                <div className="grid col-span-3 gap-2 ">
                    <Card
                        title="View Reading Material"
                        color="bg-green-400"
                        icon={<MdLibraryBooks/>}
                        link={`${basePath}/reading-material`}
                    />
                    <Card
                        title="View Questions Pool"
                        color="bg-purple-400"
                        icon={<BiQuestionMark/>}
                        link={`${basePath}/question-pool`}
                    />
                    <Card
                        title="View Results"
                        color="bg-orange-400"
                        icon={<MdOutlineAnalytics/>}
                        link={`${basePath}/results`}
                    />
                </div>
                <div className="grid col-span-6 gap-2">
                    <StudentList students={students}/>
                </div>
                <div className="grid col-span-3 flex flex-col items-start pb-0">
                    <Button
                        text="Edit Assessment"
                        icon={<PiPencil/>}
                        additionalStyling="bg-primary hover:bg-primary-dark"
                        onClick={() => handleModal(1)}
                    />
                    <Button
                        text="Release Assessment"
                        icon={<RxRocket/>}
                        additionalStyling="bg-green-400 hover:bg-green-500"
                        onClick={() => handleModal(2)}
                    />
                    <Button
                        text="Close Assessment"
                        icon={<CgClose/>}
                        additionalStyling="bg-red-400 hover:bg-red-500"
                        onClick={() => handleModal(3)}
                    />
                    <div className='h-80'></div>
                </div>
            </div>
            <EditAssessmentModal
                isOpen={isModalOpen && modalId === 1}
                onClose={() => setIsModalOpen(false)}
                assessment={assessment}
            />
            <ReleaseAssessmentModal
                isOpen={isModalOpen && modalId === 2}
                onClose={() => setIsModalOpen(false)}
                assessment={assessment}
            />
            <CloseAssessmentModal
                isOpen={isModalOpen && modalId === 3}
                onClose={() => setIsModalOpen(false)}
                assessment={assessment}
            />
        </>
    );
};
export default Dashboard;
