
import { supabase } from "@/integrations/supabase/client";
import { MessageType } from "@/components/ChatMessage";

/**
 * Sends a message to the AI webhook and returns the AI's response
 * @param message The user's message
 * @param conversationId The ID of the conversation
 * @returns The AI's response message
 */
export const sendMessageToWebhook = async (
  message: string,
  conversationId: string
): Promise<MessageType> => {
  // Get the current user
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("User not authenticated");
  
  const userId = userData.user.id;
  
  try {
    const { data, error } = await supabase.functions.invoke("chat-webhook", {
      body: {
        chatInput: message,
        conversationId,
        userId
      }
    });

    if (error) {
      console.error("Error calling webhook:", error);
      throw error;
    }

    // The edge function returns the AI message that was saved to the database
    return {
      id: data.message.id,
      content: data.message.content,
      sender: data.message.sender as 'user' | 'ai',
      timestamp: new Date(data.message.timestamp)
    };
  } catch (error) {
    console.error("Error sending message to webhook:", error);
    throw error;
  }
};
