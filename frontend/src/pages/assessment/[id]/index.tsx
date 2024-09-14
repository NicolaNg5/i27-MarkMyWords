import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Dashboard from "@/components/Dashboard";
import { Assessment } from "@/types/assessment";
import { Student } from "@/types/student";
import { format } from 'date-fns';


const AssessmentViewPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const basePath = router.asPath;
  const [assessment, setAssessment] = useState<Assessment>({} as Assessment);
  const [students, setStudents] = useState<Student[]>([])
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchAssessment= async () => {
      try {
        const res = await fetch(`/api/assessment/${id}`);
        const data = await res.json();
        setAssessment(data?.data[0] as Assessment);
      } catch (error) {
        setError("Error fetching assessment");
      }
    }
  
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/getstudents");
        const data = await res.json();
        setStudents(data?.data as Student[]); //filled with array response
      } catch (error) {
        setError("Error fetching students");
      }
    };
    fetchAssessment();
    fetchStudents();
  }, []);


    return (
      <>
        <div className="bg-white p-7">
          <div className="mb-6">
              <h1 className="text-2xl font-bold text-black">Dashboard</h1>
              <div className="flex justify-between mt-2 text-gray-500">
                <p>{assessment?.Title}</p>
                <p>Due Date: {assessment?.dueDate ? format(assessment?.dueDate, 'dd-MM-yyyy').toString() : ""}</p>
              </div>
          </div>
          {/* Main Content */}
          <main className="flex-1 p-8 pt-0">
              <Dashboard basePath={basePath} students={students} assessment={assessment}/>
          </main>
        </div> 
        
      </>
    )
}

export default AssessmentViewPage;

