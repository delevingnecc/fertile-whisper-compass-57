
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage, { MessageType } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import WelcomeScreen from '@/components/WelcomeScreen';
import FloatingElephant from '@/components/FloatingElephant';
import { useAuth } from '@/contexts/AuthProvider';
import { getProfile } from '@/integrations/supabase/profiles';
import { createConversation, getMessages, saveMessage } from '@/services/chatService';
import { sendMessageToWebhook } from '@/services/webhookService';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Home = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [assistantName] = useState('Eve');
  const [userName, setUserName] = useState('Anonymous User');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const initRef = useRef(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Prevent multiple initializations and ensure user exists
    if (!user || initRef.current) return;
    
    const fetchUserProfile = async () => {
      try {
        initRef.current = true;
        console.log('Fetching user profile for:', user.id);
        
        // Check if user is anonymous to decide if we should create a default profile
        const isAnonymous = user.app_metadata?.is_anonymous || 
                            user.email?.includes('@anonymous.user');
        
        // Get profile, create a default one for anonymous users if it doesn't exist
        const profile = await getProfile(user.id, isAnonymous);
        
        if (profile) {
          setUserName(profile.name);

          // Check if the user has ALREADY dismissed the welcome screen before
          // If they have, then we can load the conversation
          const hasVisitedChat = localStorage.getItem('hasVisitedChat') === 'true';
          if (hasVisitedChat) {
            console.log('User has visited chat before, loading conversation');
            setShowWelcome(false);
            
            // Load existing conversation or create a new one
            const storedConversationId = localStorage.getItem('currentConversationId');
            if (storedConversationId) {
              setConversationId(storedConversationId);
              try {
                await loadMessages(storedConversationId);
              } catch (error) {
                console.error('Failed to load messages, creating new conversation', error);
                await initializeNewConversation();
              }
            } else {
              await initializeNewConversation();
            }
          } else {
            console.log('First time user, showing welcome screen');
            setShowWelcome(true);
            // Don't initialize conversation until welcome screen is dismissed
          }
        } else if (isAnonymous) {
          // For anonymous users, same logic - show welcome screen first if they haven't seen it
          const hasVisitedChat = localStorage.getItem('hasVisitedChat') === 'true';
          if (hasVisitedChat) {
            setShowWelcome(false);
            await initializeNewConversation();
          } else {
            console.log('First time anonymous user, showing welcome screen');
            setShowWelcome(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // Even on error, respect the welcome screen visibility rule
        const hasVisitedChat = localStorage.getItem('hasVisitedChat') === 'true';
        if (hasVisitedChat && !conversationId) {
          setShowWelcome(false);
          initializeNewConversation().catch(err => {
            console.error('Failed to initialize conversation after profile fetch error:', err);
            toast({
              title: 'Error',
              description: 'Failed to start a conversation',
              variant: 'destructive'
            });
          });
        }
      }
    };
    
    fetchUserProfile();
  }, [user, toast, conversationId]);

  const loadMessages = async (convId: string) => {
    try {
      setIsLoading(true);
      const chatMessages = await getMessages(convId);

      // If no messages found, add a welcome message
      if (chatMessages.length === 0) {
        await initializeNewConversation();
      } else {
        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Don't show error toast here to prevent cascading errors
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNewConversation = async () => {
    try {
      const newConversationId = await createConversation();
      setConversationId(newConversationId);
      localStorage.setItem('currentConversationId', newConversationId);

      // Create welcome message
      const welcomeMessage = `Hello! I'm Eve, your fertility companion. How are you feeling today?`;
      const savedMessage = await saveMessage(newConversationId, welcomeMessage, 'ai');
      
      setMessages([savedMessage]);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create a new conversation',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;
    const newUserMessage: MessageType = {
      id: 'temp-' + Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    try {
      // Send message to webhook and get AI response
      const aiResponse = await sendMessageToWebhook(content, conversationId);

      // Update messages with the AI response
      setMessages(prev => [...prev.filter(msg => msg.id !== newUserMessage.id), {
        id: 'user-' + Date.now().toString(),
        content: content,
        sender: 'user',
        timestamp: new Date()
      }, aiResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = async () => {
    console.log('Get started clicked, initializing conversation');
    // Mark that the user has seen the welcome screen
    localStorage.setItem('hasVisitedChat', 'true');
    setShowWelcome(false);

    // Initialize a new conversation
    await initializeNewConversation();
  };

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-20 px-4 py-6 chat-gradient-bg scrollbar-hidden h-full">
        <div className="max-w-none mx-auto">
          {messages.length === 0 ? (
            <FloatingElephant />
          ) : (
            <>
              {messages.map(message => <ChatMessage key={message.id} message={message} assistantName={assistantName} userName={userName} />)}
              {isLoading && (
                <div className="flex items-center space-x-2 ml-10">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0ms"}}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "200ms"}}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "400ms"}}></div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-16'} left-0 right-0`}>
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Home;
