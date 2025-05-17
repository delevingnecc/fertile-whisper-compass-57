
import { supabase } from "@/integrations/supabase/client";
import { MessageType } from "@/components/ChatMessage";
import { useAuth } from "@/contexts/AuthProvider";

// Types for our database entities
export interface Conversation {
  id: string;
  title: string | null;
  created_at: Date;
  updated_at: Date;
}

// Create a new conversation
export const createConversation = async (title?: string): Promise<string> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      title: title || `Conversation ${new Date().toLocaleString()}`,
      user_id: userData.user.id
    })
    .select('id')
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }

  return data.id;
};

// Get all conversations for the current user
export const getConversations = async (): Promise<Conversation[]> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }

  return data.map(conv => ({
    ...conv,
    created_at: new Date(conv.created_at),
    updated_at: new Date(conv.updated_at)
  }));
};

// Get messages for a specific conversation
export const getMessages = async (conversationId: string): Promise<MessageType[]> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("User not authenticated");
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userData.user.id)
    .order('created_at');

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  return data.map(message => ({
    id: message.id,
    content: message.content,
    sender: message.sender as 'user' | 'ai',
    timestamp: new Date(message.created_at)
  }));
};

// Save a new message
export const saveMessage = async (
  conversationId: string, 
  content: string, 
  sender: 'user' | 'ai'
): Promise<MessageType> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("User not authenticated");
  
  const newMessage = {
    conversation_id: conversationId,
    content,
    sender,
    user_id: userData.user.id
  };

  const { data, error } = await supabase
    .from('chat_messages')
    .insert(newMessage)
    .select('*')
    .single();

  if (error) {
    console.error("Error saving message:", error);
    throw error;
  }

  return {
    id: data.id,
    content: data.content,
    sender: data.sender as 'user' | 'ai',
    timestamp: new Date(data.created_at)
  };
};
