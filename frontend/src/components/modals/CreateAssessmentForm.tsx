// src/components/CreateAssessmentForm.tsx

import { useRouter } from "next/router";
import React, { useState, useEffect} from "react";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";

const CreateAssessmentForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

    // Modified handleFileChange to support .txt, .docx, and .pdf
    useEffect(() => {
      if (file) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
  
        const reader = new FileReader();
  
        if (fileExtension === "txt") {
          reader.onload = (e) => {
            setFileContent(e.target?.result as string);
          };
          reader.readAsText(file);
        } else if (fileExtension === "docx") {
          reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const { value } = await mammoth.extractRawText({ arrayBuffer });
            setFileContent(value);
          };
          reader.readAsArrayBuffer(file);
        } else if (fileExtension === "pdf") {
          reader.onload = async (e) => {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          
            let text = "";
            for (let i = 0; i < pdf.numPages; i++) {
              const page = await pdf.getPage(i + 1);
              const textContent = await page.getTextContent();
          
              const pageText = textContent.items
                .map((item: { str: string }) => item.str) 
                .join(" ");
              text += pageText + "\n";
            }
            setFileContent(text);
          };          
          reader.readAsArrayBuffer(file);
        } else {
          setError("Unsupported file type. Please upload a .txt, .docx, or .pdf file.");
        }
      }
    }, [file]);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setError(null);
        setFile(e.target.files[0]);
      } else {
        setError("Please upload a file");
      }
    };
  

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ title, dueDate, file });

    await fetch('http://localhost:3000/assignment.json', { //add correct api here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        dueDate,
        file
      }),
    });

    console.log("Assessment",{ title, dueDate, file, fileContent});

    // router.reload(); //reloads to display added assessment
  };

  return (
    <form onSubmit={handleSubmit} className="text-black"
    >
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Reading Material</label>
        <div className="border border-gray-300 rounded p-4 text-center">
          <div className="flex flex-col space-y-4   ...">
            {file ? (
              <p>{file.name}</p>
            ) : (
              <div>
                <b>Drop or Drag your file here</b>
                <p>or Upload File below</p>
              </div>
            )}
            <div className="place-content-center">
              <label
                htmlFor="file-upload"
                className="bg-primary text-white  w-48 mt-10 px-4 py-2 rounded cursor-pointer hover:bg-primary-dark"
              >
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden "
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-secondary text-black px-4 py-2 rounded hover:bg-secondary-dark"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateAssessmentForm;