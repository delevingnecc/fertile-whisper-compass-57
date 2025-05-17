
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  
  // Get first letter of user name or use 'U' as fallback
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/assistant-${assistantName.toLowerCase()}.png`} alt={assistantName} />
            <AvatarFallback className="bg-primary-100 text-primary">
              {assistantName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className={`rounded-lg p-3 max-w-[80%] ${
        isUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
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
      
      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback className="bg-accent text-accent-foreground">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
