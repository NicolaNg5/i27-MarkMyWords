"use client";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";

export default function AIPrompting() {
  const [prompts, setPrompts] = useState<any>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function formatResponse(text : string) {
    if (!text) {
      return "";
    }
  
    return text.replace(/\n/g, "<br>");
  }

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
    <>
    <Layout>
    <div className="text-gray-600">
      <h1>Model Prompting</h1>
      <select value={selectedPrompt} onChange={handlePromptChange}>
        <option value="">Select a prompt</option>
        {prompts && prompts.map((prompt: any, index : any) => (
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
    </Layout>
    </>
  );
}
