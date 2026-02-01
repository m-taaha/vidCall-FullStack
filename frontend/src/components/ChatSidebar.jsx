import React, { useEffect, useRef } from 'react'

function ChatSidebar({messages, currentMessage, setCurrentMessage, sendMessage}) {
    const messsageEndRef = useRef(null);


    useEffect(() => {
        messsageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])




  return (
    <div className="flex flex-col h-full w-80 bg-slate-900 border-l border-white/10 shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white">Chat</h2>
      </div>

      {/* message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}
          >
            <span className="text-xs text-slate-400 mb-1">{msg.sender}</span>
            <div className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm ${
                msg.sender === "You" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"
            }`}>
                {msg.text}
            </div>
          </div>
        ))}
        <div ref={messsageEndRef} />
      </div>

      {/* input area */}
      {/* TODO: We'll build this next */}
    </div>
  );
}

export default ChatSidebar