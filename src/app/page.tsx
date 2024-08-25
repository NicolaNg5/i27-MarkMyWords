import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import Card from "./components/Cards";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-500">Example Assessment 1</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-gray-500">Due: dd/mm/yyyy</div>
      </div>

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
          link="readingMaterial" 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
