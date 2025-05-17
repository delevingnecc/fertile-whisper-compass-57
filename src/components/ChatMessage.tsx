
import React from 'react';
import ReactMarkdown from 'react-markdown';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ChatMessageProps = {
  message: MessageType;
  assistantName: string;
  userName?: string; // Optional user name prop
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, assistantName, userName = '' }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>      
      <div className={`rounded-lg p-3 max-w-[95%] ${
        isUser 
          ? 'bg-primary text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'
      } chat-message-${isUser ? 'user' : 'ai'}`}>
        <div className="prose prose-sm max-w-none">
          {isUser ? (
            <p className="text-white">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        <div className={`text-xs text-right mt-1 ${isUser ? 'opacity-80 text-white' : 'opacity-70'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
