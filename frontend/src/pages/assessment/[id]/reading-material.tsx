import { useState, useEffect } from 'react';
import { Assessment } from '@/types/assessment'; // Assuming this is the assessment type interface
import { useRouter } from 'next/router';

export default function ReadingMaterialPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null); // Store the assessment
  const [readingMaterial, setReadingMaterial] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>(router.query.id as string);

  useEffect(() => {
      if(router.isReady){
          setId(router.query.id as string);
      }
  }, [router.isReady]);

  const fetchAssessment= async () => {
    try {
      const res = await fetch(`/api/assessment/${id}`);
      const data = await res.json();
      setAssessment(data?.data[0] as Assessment);
    } catch (error) {
      setError("Error fetching assessment: " + error);
    }
  }
  const fetchReadingMaterial = async () => {
    try {
      const res = await fetch(`/api/assessment-content/${id}`);
      const data = await res.json();
      setReadingMaterial(data["file_content"] as string);
    } catch (error) {
      setError("Error fetching reading material: " + error); 
    }
  }

  useEffect(() => {
    fetchAssessment();
    fetchReadingMaterial();
  }, [id]);

  return (
    <div className="p-8">
      {assessment ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-black">Reading Material</h1>
            <h2 className="text-lg">{assessment.Title}</h2>
          </div>

          {/* Error handling */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <p>{readingMaterial}</p>
          </div>

          {/* Back Button */}
          <button
            className="bg-gray-500 text-white my-5 px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </>
      ) : (
        <div>Loading assessment...</div>
      )}
    </div>
  );
}
