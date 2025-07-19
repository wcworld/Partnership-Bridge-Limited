import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChatMessage {
  name: string;
  email: string;
  message: string;
  timestamp: string;
  sessionId: string;
}

interface TelegramWebhook {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
    };
    text: string;
    reply_to_message?: {
      text: string;
    };
  };
}

async function sendToTelegram(message: string) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
  
  console.log('Telegram config check:', {
    hasBotToken: !!botToken,
    hasChat: !!chatId,
    chatIdType: typeof chatId,
    chatIdValue: chatId
  });
  
  if (!botToken || !chatId) {
    throw new Error('Telegram configuration missing');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  // Ensure chat_id is sent as string for Telegram API
  const payload = {
    chat_id: String(chatId),
    text: message.substring(0, 4096), // Telegram message limit
    parse_mode: 'HTML' as const
  };

  console.log('Sending to Telegram:', {
    url: url.replace(botToken, 'BOT_TOKEN_HIDDEN'),
    payload: payload
  });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  const responseText = await response.text();
  console.log('Telegram response:', {
    status: response.status,
    statusText: response.statusText,
    body: responseText
  });
  
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status} - ${responseText}`);
  }
  
  return JSON.parse(responseText);
}

function formatChatMessage(data: ChatMessage): string {
  return `
💬 <b>New Live Chat Message</b>

👤 <b>Name:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
💬 <b>Message:</b> ${data.message}

🕐 <b>Time:</b> ${data.timestamp}
🔗 <b>Session:</b> ${data.sessionId}

<i>Reply to this message to respond to the customer</i>
`;
}

async function handleTelegramWebhook(webhookData: TelegramWebhook) {
  console.log('Received Telegram webhook:', webhookData);
  
  const { message } = webhookData;
  
  // Only process replies to our bot messages
  if (message.reply_to_message && message.text) {
    const replyText = message.reply_to_message.text;
    
    // Extract session ID from the original message
    const sessionMatch = replyText.match(/🔗 <b>Session:<\/b> (.+)/);
    if (sessionMatch) {
      const sessionId = sessionMatch[1];
      
      console.log('Processing admin reply for session:', sessionId);
      
      // Store admin reply in database
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          sender_type: 'admin',
          sender_name: `${message.from.first_name}${message.from.username ? ` (@${message.from.username})` : ''}`,
          message: message.text,
          telegram_message_id: message.message_id
        });
      
      if (error) {
        console.error('Error storing admin reply:', error);
        throw error;
      }
      
      console.log('Admin reply stored successfully');
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  // Handle Telegram webhook
  if (req.method === 'POST' && url.pathname === '/webhook') {
    try {
      const webhookData: TelegramWebhook = await req.json();
      await handleTelegramWebhook(webhookData);
      
      return new Response('OK', {
        status: 200,
        headers: corsHeaders
      });
    } catch (error) {
      console.error('Error handling Telegram webhook:', error);
      return new Response('Error', {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // Handle chat message from website
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const data: ChatMessage = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Store user message in database
    const { error: dbError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: data.sessionId,
        sender_type: 'user',
        sender_name: data.name,
        sender_email: data.email,
        message: data.message
      });

    if (dbError) {
      console.error('Error storing message:', dbError);
      throw dbError;
    }

    const message = formatChatMessage(data);
    await sendToTelegram(message);

    console.log('Chat message sent to Telegram:', {
      name: data.name,
      email: data.email,
      timestamp: data.timestamp
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in telegram-chat function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});