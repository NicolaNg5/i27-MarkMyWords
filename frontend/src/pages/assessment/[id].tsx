import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Dashboard from "@/components/Dashboard";




export default function AssessmentPage({ params }: { params: { id: string } }){
  const router = useRouter();
  const { id } = router.query;
  const [assessment, setAssessment] = useState<any>();

  async function getAssessments(id:string) {
    const res = await fetch ('http://localhost:3000/assignment.json',
    {
        next: {revalidate: 10},
    });
    const data = await res.json();
    const numericId= Number(id);
    for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].id === numericId) {
          setAssessment(data.items[i]);
            break;
        }
    }
}

  useEffect(() => {
    getAssessments(id as string);
  }, []);

    return (
      <>
        <div className="relative h-screen bg-white">
          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-black">Dashboard</h1>
                <p className="text-gray-500">{assessment?.name}</p>
            </div>
            <div className="flex justify-between items-center mb-8">
                <div className="text-gray-500">Due: {assessment?.dueDate}</div>
            </div>
            <Dashboard id={assessment?.id}/>
          </main>
        </div> 
      </>
    )
}
