import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../../services/aiService";
import type { ChatMessageHistory } from "../../types/ai";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessageHistory[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem("ai_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    } else {
      setMessages([
        { role: "assistant", content: "Hi! I'm your Velocity AI Shopping Assistant. How can I help you find the perfect product today?" }
      ]);
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage
    if (messages.length > 0) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: ChatMessageHistory[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        // Send the last 10 messages for context
        history: newMessages.slice(-10)
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.reply }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm sorry, I encountered an error connecting to my servers. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:animate-pulse">auto_awesome</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col bg-surface border border-outline-variant rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
        isMinimized ? "w-80 h-14" : "w-[90vw] md:w-[400px] h-[80vh] md:h-[600px] max-h-[800px]"
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between bg-primary px-4 py-3 text-white cursor-pointer select-none"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
          <span className="font-bold font-label-lg tracking-wide">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {isMinimized ? "expand_less" : "expand_more"}
            </span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest scroll-smooth">
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-surface-container-low text-on-surface border border-outline-variant rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" || msg.role === "model" ? (
                      <div className="prose prose-sm prose-p:my-1 prose-a:text-primary prose-strong:text-on-surface dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-sm break-words whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low border border-outline-variant rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-surface border-t border-outline-variant">
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-full pr-1 pl-4 py-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-on-surface-variant/70">AI can make mistakes. Verify important info.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
