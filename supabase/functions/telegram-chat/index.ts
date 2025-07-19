import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ChatMessage {
  name: string;
  email: string;
  message: string;
  timestamp: string;
  sessionId: string;
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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