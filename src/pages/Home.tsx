
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ChatMessage, { MessageType } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Button } from '@/components/ui/button';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useAuth } from '@/contexts/AuthProvider';

// Mock initial messages
const initialMessages: MessageType[] = [
  {
    id: '1',
    content: 'Hello! I\'m Eve, your fertility companion. How are you feeling today?',
    sender: 'ai',
    timestamp: new Date(),
  },
];

const Home = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [assistantName, setAssistantName] = useState('Eve');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has completed onboarding
    // For now, we'll just show the welcome screen based on a hardcoded value
    // In a real app, this would be based on user data
    const checkOnboardingStatus = () => {
      // For mock purposes, we're setting showWelcome based on whether this is the first visit
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
      
      if (hasVisitedBefore) {
        setShowWelcome(false);
      }
      
      // Set assistant name based on user preference (mock)
      setAssistantName('Eve');
    };
    
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content: string) => {
    const newUserMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // Mock AI response with a delay
    setTimeout(() => {
      const aiResponses = [
        'I understand how you feel. Fertility journeys can be complex.',
        'That\'s a great question! Let me help you understand your cycle better.',
        'I\'m here to support you every step of the way.',
        'Based on the information you\'ve shared, I\'d recommend tracking these symptoms.',
        'Would you like me to remind you about your upcoming appointments?'
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newAiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleGetStarted = () => {
    // Mark that the user has visited before
    localStorage.setItem('hasVisitedBefore', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title={`Chat with ${assistantName}`} />
      
      <div className="flex-1 overflow-y-auto pt-16 pb-24 px-4 chat-gradient-bg scrollbar-hidden">
        <div className="max-w-lg mx-auto">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              assistantName={assistantName}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 ml-10">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
