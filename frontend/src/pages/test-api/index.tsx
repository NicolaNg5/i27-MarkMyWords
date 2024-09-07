"use client";
import { useState, useEffect } from "react";
import TextHighlight from "@/components/TextHighlight";
import ChooseQuestions from "@/components/ChooseQuestions";

export default function Home() {
  const [prompts, setPrompts] = useState<any>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<any>("");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileContent, setFileContent] = useState<any | null>("");
  const [fileName, setFileName] = useState<any>("");
  const [highlightedText, setHighlightedText] = useState<any>("");

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

  const handlePromptChange = (event: any) => {
    setSelectedPrompt(event.target.value);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result);
      };
      reader.readAsText(file);
    }
  };
  const handleFileName = (event: any) => {
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
      }else{
        alert("File uploaded successfully under the name: " + fileName + "!");
      }

      const data = await res.json();
      console.log("Frontend - File Uploaded:", data);

    } catch (error) {
      console.error("Frontend - Error:", error);
      setError("Error analyzing file");
    }
  };

  const handleSubmit = async (event : any) => {
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

  const handleHighlightedText = (text : any) => {
    setHighlightedText(text);
  };

  return (
    <div>
      <h1>Model Prompting</h1>
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
      <select value={selectedPrompt} onChange={handlePromptChange}>
        <option value="">Select a prompt</option>
        {prompts.map((prompt: any, index: any) => (
          <option key={index} value={prompt}>
            {prompt}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleSubmit}>Generate Response</button>
      
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
