
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type ChatMessageProps = {
  message: MessageType;
  assistantName: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, assistantName }) => {
  const isUser = message.sender === 'user';
  
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
      
      <div className={isUser ? 'chat-message-user' : 'chat-message-ai'}>
        <p>{message.content}</p>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback className="bg-accent text-accent-foreground">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
