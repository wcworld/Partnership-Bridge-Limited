// Cloudflare Worker for Telegram Form Submissions
// Deploy this to Cloudflare Workers

const TELEGRAM_BOT_TOKEN = '8046760645:AAG6AzkM1jzrJ-mNI3JDY93kTLQLLmYtfUg';
const TELEGRAM_CHAT_ID = '7755725611';

async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
  
  return response.json();
}

function formatContactForm(data) {
  return `
🔔 <b>New Contact Form Submission</b>

👤 <b>Name:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
📱 <b>Phone:</b> ${data.phone}
🏢 <b>Service:</b> ${data.service}
💬 <b>Message:</b> ${data.message}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}
`;
}

function formatQuoteForm(data) {
  return `
💰 <b>New Quote Request</b>

👤 <b>Name:</b> ${data.firstName} ${data.lastName}
📧 <b>Email:</b> ${data.email}
📱 <b>Phone:</b> ${data.phone}
🏢 <b>Company:</b> ${data.company}

💼 <b>Loan Details:</b>
• Type: ${data.loanType}
• Amount: £${data.loanAmount}
• Purpose: ${data.loanPurpose}

🏭 <b>Business Info:</b>
• Industry: ${data.industry}
• Turnover: £${data.annualTurnover}
• Time in Business: ${data.timeInBusiness}
• Employees: ${data.employees}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}
`;
}

function formatEligibilityForm(data) {
  return `
✅ <b>New Eligibility Check</b>

👤 <b>Personal Details:</b>
• Name: ${data.firstName} ${data.lastName}
• Email: ${data.email}
• Phone: ${data.phone}

💼 <b>Loan Details:</b>
• Amount: £${data.loanAmount}
• Purpose: ${data.loanPurpose}

🏭 <b>Business Info:</b>
• Name: ${data.businessName}
• Industry: ${data.industry}
• Turnover: £${data.annualTurnover}
• Time in Business: ${data.timeInBusiness}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}
`;
}

function formatAppointmentForm(data) {
  return `
📅 <b>New Appointment Scheduled</b>

👤 <b>Client Details:</b>
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}

📆 <b>Appointment Details:</b>
• Date: ${data.date}
• Time: ${data.time}
• Service: ${data.service || 'General Consultation'}
• Duration: 30 minutes
• Type: Online consultation

💬 <b>Notes:</b> ${data.message || 'No additional notes'}

⏰ <b>Scheduled:</b> ${new Date().toLocaleString()}
`;
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      let message = '';

      // Determine form type and format message accordingly
      switch (data.formType) {
        case 'contact':
          message = formatContactForm(data);
          break;
        case 'quote':
          message = formatQuoteForm(data);
          break;
        case 'eligibility':
          message = formatEligibilityForm(data);
          break;
        case 'appointment':
          message = formatAppointmentForm(data);
          break;
        default:
          message = `
🔔 <b>New Form Submission</b>

${Object.entries(data)
  .filter(([key]) => key !== 'formType')
  .map(([key, value]) => `<b>${key}:</b> ${value}`)
  .join('\n')}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}
`;
      }

      const telegramResponse = await sendToTelegram(message);
      
      if (telegramResponse.ok) {
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } else {
        throw new Error('Telegram API error');
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};