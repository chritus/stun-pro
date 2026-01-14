import React, { useEffect, useRef } from 'react';

const MessageWindow = ({ messages, selectedChat }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
      {!selectedChat ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 text-lg">Select a chat to start messaging</p>
          </div>
        </div>
      ) : (
        <>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No messages yet</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {!msg.isOwn && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {msg.sender}
                    </p>
                  )}
                  <p className="break-words">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-green-100' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageWindow;
