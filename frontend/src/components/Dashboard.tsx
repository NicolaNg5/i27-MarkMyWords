import React, { useState } from 'react';
import Card from "./Cards";
import ReleaseAssessmentModal from './ReleaseAssessmentModal';

interface DashboardProps {
    id: number,
}

const Dashboard: React.FC<DashboardProps> = (DashboardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReleaseAssessmentClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
                <Card
                    title="View Reading Material"
                    color="bg-green-400"
                    icon="📄"
                    link="readingMaterial"
                />
                <Card
                    title="View Questions Pool"
                    color="bg-purple-400"
                    icon="❓"
                    link="readingMaterial"
                />
                <Card
                    title="View Results"
                    color="bg-orange-400"
                    icon="📝"
                    link="readingMaterial"
                />
                <Card
                    title="Manage Students"
                    color="bg-yellow-400"
                    icon="👥"
                    link="readingMaterial"
                />
                <Card
                    title="Release Assessment"
                    color="bg-red-400"
                    icon="🚀"
                    onClick={handleReleaseAssessmentClick}
                />
            </div>
            <ReleaseAssessmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
export default Dashboard;
