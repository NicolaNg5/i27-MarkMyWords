"use client";
import { useState, useEffect } from "react";
import TextHighlight from "../components/TextHighlight";
import ChooseQuestions from "../components/ChooseQuestions";

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch("/api/prompts");
        const data = await res.json();
        setPrompts(data.prompts);
      } catch (error) {
        setError("Error fetching prompts");
      }
    };
    fetchPrompts();
  }, []);

  const handlePromptChange = (event) => {
    setSelectedPrompt(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };
  const handleFileName = (event) => {
    setFileName(event.target.value);
  };

  const handleUpload = async () => {
    setError(null);
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    if (!fileName) {
      setError("Please enter a file name.");
      return;
    }

    try {
      console.log("Frontend - Sending File Content:", fileContent);
      console.log("Frontend - Sending File Name:", fileName);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: fileName + "\n" + fileContent,
      });

      if (!res.ok) {
        throw new Error(`Error uploading file: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Frontend - File Uploaded:", data);

    } catch (error) {
      console.error("Frontend - Error:", error);
      setError("Error analyzing file");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!selectedPrompt) {
      setError("Please select a prompt.");
      return;
    }

    try {
      console.log("Frontend - Sending Prompt Key:", selectedPrompt);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: selectedPrompt,
      });

      const data = await res.json();
      console.log("Frontend - Received Data:", data);
      setResponse(data);

    } catch (error) {
      console.error("Frontend - Error:", error);
      setError("Error generating response");
    }
  };

  const handleHighlightedText = (text) => {
    setHighlightedText(text);
  };

  return (
    <div>
      <h1>Model Prompting</h1>
      <select value={selectedPrompt} onChange={handlePromptChange}>
        <option value="">Select a prompt</option>
        {prompts.map((prompt, index) => (
          <option key={index} value={prompt}>
            {prompt}
          </option>
        ))}
      </select>
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <div>
        <label htmlFor="fileName">File Name:</label>
        <input 
          type="text" 
          id="fileName" 
          value={fileName} 
          onChange={handleFileName} 
        />
      </div>
      <button onClick={handleUpload}>Upload File</button>
      <br />
      <button onClick={handleSubmit}>Generate Response</button>
      

      {console.log("FILE CONTENT:", fileContent)}
      {fileContent && ( 
        <div>
          <h2>File Content:</h2>
          <TextHighlight 
            htmlContent={fileContent} 
            onHighlight={handleHighlightedText} 
          />
        </div>
      )}

      {error ? (
        <div>{error}</div>
      ) : response ? (
        <div>
          <h2>Response:</h2>
          <ChooseQuestions response={response.response} fileName={fileName} />
          {highlightedText && (
            <div>
              <strong>Highlighted Text:</strong> {highlightedText}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
