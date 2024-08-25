// src/components/CreateAssessmentForm.tsx

import React, { useState } from "react";

const CreateAssessmentForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ title, dueDate, file });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4">Create Assessment</h2>

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
                className="bg-blue-500 text-white  w-48 mt-10 px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
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
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateAssessmentForm;
