"use client";
import { useState, useEffect } from "react";
import { 
    GoogleGenerativeAI, 
    HarmCategory, 
    HarmBlockThreshold 
} from "@google/generative-ai";

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [chat, setChat] = useState(null);
    const [error, setError] = useState(null);

    const API_KEY = "AIzaSyDlIgvojKuLfMr9LB1NBV2TSrJhKiX5Y6Q"; 
    const MODEL_NAME = "gemini-1.5-pro";

    const genAI = new GoogleGenerativeAI(API_KEY);

    const config = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutptTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE

        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
    ];

    useEffect(() => {
        const initChat = async () => {
            try {
                const newChat = await genAI
                    .getGenerativeModel({ model: MODEL_NAME })
                    .startChat({
                        config,
                        safetySettings,
                        history: messages.map((msg) => ({
                            text: msg.text,
                            role: msg.role,
                        })),
                    });
                setChat(newChat);
            } catch (error) {
                setError("Failed to initialise chat. Please try again");
            }
        };
        initChat();
    }, []);

    const handleMessage = async () => {
        try {
            const userMessage = {
                text: userInput,
                role: "user",
                timestamp: new Date(),
            };

            setMessages((preMessages) => [...preMessages, userMessage]);
            setUserInput("");

            if (chat) {
                const result = await chat.sendMessage(userInput);
                const botMessage = {
                    text: result.response.text(),
                    role: "bot",
                    timestamp: new Date()
                };

                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
        } catch (error) {
            setError("Failed to send message. Please try again.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleMessage();
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gemini Chatbot</h1>

            <div className="chat-window bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`message mb-4 ${msg.role === "user" ? "user-message" : "bot-message"}`}>
                        <span className={`text-sm ${msg.role === "user" ? "text-blue-500" : "text-gray-700"}`}>
                            {msg.role === "bot" ? "Bot" : "You"} - {msg.timestamp.toLocaleTimeString()}
                        </span>
                        <pre 
                            className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-200" : "bg-gray-300"}`}
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {msg.text}
                        </pre>
                    </div>
                ))}
            </div>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            <div className="input-area flex mt-4">
                <input
                    type="text"
                    placeholder="Ask me anything"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-grow border border-gray-400 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleMessage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
}