import React, { useEffect, useRef } from 'react';

const MessageWindow = ({ messages, selectedChat, username }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-6 space-y-4">
      {!selectedChat ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">Select a chat to start messaging</p>
            <p className="text-gray-400 text-sm mt-2">Choose a user or group from the sidebar</p>
          </div>
        </div>
      ) : (
        <>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No messages yet</p>
                <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isSystem ? 'justify-center' : msg.isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {msg.isSystem ? (
                  <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div className={`max-w-md ${msg.isOwn ? 'order-2' : 'order-1'}`}>
                    {!msg.isOwn && (
                      <p className="text-xs font-semibold text-gray-600 mb-1 ml-3">
                        {msg.sender}
                      </p>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-md ${
                        msg.isOwn
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
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
