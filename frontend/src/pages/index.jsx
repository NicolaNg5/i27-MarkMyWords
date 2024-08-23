"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function formatResponse(text) {
  if (!text) {
    return "";
  }

  return text.replace(/\n/g, "<br>");
}

export default function Home() {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

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

  const handleSubmit = async () => {
    setError(null);
    try {
      console.log("Frontend - Sending Prompt Key:", selectedPrompt);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=UTF-8" },
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

  useEffect(() => {
    if (response) {
      console.log("Response state updated:", response);
    }
  }, [response]);

  return (
    <div>
      <Navbar />
      <h1>Model Prompting</h1>
      <select value={selectedPrompt} onChange={handlePromptChange}>
        <option value="">Select a prompt</option>
        {prompts.map((prompt, index) => (
          <option key={index} value={prompt}>
            {prompt}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Generate</button>

      {error ? (
        <div>{error}</div>
      ) : response ? (
        <div>
          <h2>Response:</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: formatResponse(response.response),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
