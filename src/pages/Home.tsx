
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ChatMessage, { MessageType } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useAuth } from '@/contexts/AuthProvider';
import { getProfile } from '@/integrations/supabase/profiles';
import { createConversation, getMessages, saveMessage } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [assistantName, setAssistantName] = useState('Eve');
  const [userName, setUserName] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile(user.id);

        if (profile) {
          // Set user name from profile
          setUserName(profile.name);

          // Check if this is the first time loading the chat
          const hasVisitedBefore = localStorage.getItem('hasVisitedChat');
          if (hasVisitedBefore) {
            setShowWelcome(false);
            
            // Get or create a conversation
            const storedConversationId = localStorage.getItem('currentConversationId');
            if (storedConversationId) {
              setConversationId(storedConversationId);
              loadMessages(storedConversationId);
            } else {
              initializeNewConversation();
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user profile',
          variant: 'destructive',
        });
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const loadMessages = async (convId: string) => {
    try {
      setIsLoading(true);
      const chatMessages = await getMessages(convId);
      
      // If no messages found, add a welcome message
      if (chatMessages.length === 0) {
        const welcomeMessage: MessageType = {
          id: 'welcome',
          content: `Hello! I'm Eve, your fertility companion. How are you feeling today?`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        
        // Save welcome message to database
        await saveMessage(convId, welcomeMessage.content, welcomeMessage.sender);
      } else {
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNewConversation = async () => {
    try {
      const newConversationId = await createConversation();
      setConversationId(newConversationId);
      localStorage.setItem('currentConversationId', newConversationId);
      
      // Add welcome message
      const welcomeMessage: MessageType = {
        id: 'welcome',
        content: `Hello! I'm Eve, your fertility companion. How are you feeling today?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      // Save welcome message to database
      await saveMessage(newConversationId, welcomeMessage.content, welcomeMessage.sender);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create a new conversation',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    const newUserMessage: MessageType = {
      id: 'temp-' + Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Save user message to database
      const savedUserMessage = await saveMessage(conversationId, content, 'user');
      
      // Replace temporary message with saved message
      setMessages(prev => 
        prev.map(msg => msg.id === newUserMessage.id ? savedUserMessage : msg)
      );
      
      // Mock AI response with a delay (this would be replaced with actual AI integration)
      setTimeout(async () => {
        const aiResponses = [
          `I understand how you feel, ${userName || 'there'}. Fertility journeys can be complex.`,
          'That\'s a great question! Let me help you understand your cycle better.',
          'I\'m here to support you every step of the way.',
          'Based on the information you\'ve shared, I\'d recommend tracking these symptoms.',
          'Would you like me to remind you about your upcoming appointments?'
        ];

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        // Save AI response to database
        const savedAiMessage = await saveMessage(conversationId, randomResponse, 'ai');
        
        // Add AI response to messages
        setMessages((prev) => [...prev, savedAiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleGetStarted = async () => {
    // Mark that the user has visited the chat before
    localStorage.setItem('hasVisitedChat', 'true');
    setShowWelcome(false);
    
    // Initialize a new conversation
    await initializeNewConversation();
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
