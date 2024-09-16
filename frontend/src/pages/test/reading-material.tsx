'use client';

import { useState, useEffect } from 'react';
import { Assessment } from '@/types/assessment'; // Assuming this is the assessment type interface
import { BiDownload } from 'react-icons/bi';

// Mock API response interface (for reading files)
interface ReadingFile {
  fileName: string;
  fileUrl: string;
}

export default function ReadingMaterialPage() {
  const [assessment, setAssessment] = useState<Assessment | null>(null); // Store the assessment
  const [readingFiles, setReadingFiles] = useState<ReadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch assessment details (including ReadingMaterialID)
  const fetchAssessment = async () => {
    try {
      const res = await fetch("/api/assessment/${id}"); 
      const data = await res.json();
      setAssessment(data?.assessment as Assessment);
      generateReadingFiles(data?.assessment.ReadingMaterialID);
    } catch (error) {
      setError('Error fetching assessment');
    }
  };

  // Generate reading files from the assessment's ReadingMaterialID field
  const generateReadingFiles = (readingMaterialID: string) => {
    // Mock reading file generation from readingMaterialID (e.g., file names stored in the assessment)
    // This can be replaced with logic fetching actual URLs
    const mockReadingFiles = [
      { fileName: `${readingMaterialID}Act1.pdf`, fileUrl: `/files/${readingMaterialID}Act1.pdf` },
      { fileName: `${readingMaterialID}Act2.docx`, fileUrl: `/files/${readingMaterialID}Act2.docx` },
      { fileName: `${readingMaterialID}Act3.pdf`, fileUrl: `/files/${readingMaterialID}Act3.pdf` },
    ];

    setReadingFiles(mockReadingFiles);
  };

  // Fetch assessment and generate reading files when the component mounts
  useEffect(() => {
    fetchAssessment();
  }, []);

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

          {/* Table to display reading files */}
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">File</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {readingFiles.map((file, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {index + 1}. {file.fileName}
                  </td>
                  <td className="border px-4 py-2">
                    <a
                      href={file.fileUrl} // The URL to download or view the file
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 inline-flex items-center"
                    >
                      <BiDownload className="mr-2" />
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Back Button */}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
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
