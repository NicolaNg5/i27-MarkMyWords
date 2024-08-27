import Card from "./Cards"


interface DashboardProps {
    id: number,
}

const Dashboard: React.FC<DashboardProps> = (DashboardProps) => {


return (
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
)}

export default Dashboard;

