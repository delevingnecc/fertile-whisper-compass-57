
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const webhookUrl = "https://designsynergy.app.n8n.cloud/webhook/bf4dd093-bb02-472c-9454-7ab9af97bd1d";
const bearerToken = Deno.env.get("WEBHOOK_BEARER_TOKEN") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { chatInput, conversationId, userId } = await req.json();

    // Validate required parameters
    if (!chatInput || !conversationId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing request: User ${userId} sent message in conversation ${conversationId}`);

    // Save user message to database
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') || "" },
        },
      }
    );

    // Save user's message to the database
    const { error: userMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        content: chatInput,
        sender: 'user',
        user_id: userId
      });

    if (userMessageError) {
      console.error("Error saving user message:", userMessageError);
      return new Response(
        JSON.stringify({ error: "Failed to save user message" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call the webhook with the user's message
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify({
        chatInput,
        userId
      })
    });

    if (!webhookResponse.ok) {
      console.error(`Webhook error: ${webhookResponse.status}`);
      const errorText = await webhookResponse.text();
      console.error(`Webhook response: ${errorText}`);
      
      return new Response(
        JSON.stringify({ error: "Webhook request failed" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the webhook response
    const webhookData = await webhookResponse.json();
    console.log("Webhook response received:", webhookData);
    
    // We'll use the response from the webhook as the AI's message
    const aiResponse = webhookData.response || "Sorry, I couldn't process that request.";

    // Save AI response to the database
    const { data: aiMessage, error: aiMessageError } = await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        content: aiResponse,
        sender: 'ai',
        user_id: userId
      })
      .select()
      .single();

    if (aiMessageError) {
      console.error("Error saving AI message:", aiMessageError);
      return new Response(
        JSON.stringify({ error: "Failed to save AI response" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the AI message data
    return new Response(
      JSON.stringify({
        message: {
          id: aiMessage.id,
          content: aiMessage.content,
          sender: aiMessage.sender,
          timestamp: aiMessage.created_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
