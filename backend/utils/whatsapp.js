const axios = require('axios');

class WhatsAppAPI {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v17.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_TOKEN;
  }

  // Send text message to a single number
  async sendTextMessage(phoneNumber, message) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  // Send image message to a single number
  async sendImageMessage(phoneNumber, imageUrl, caption = '') {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'image',
          image: {
            link: imageUrl,
            caption: caption
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp image');
    }
  }

  // Send message to multiple numbers
  async sendBulkMessage(phoneNumbers, message, imageUrl = null) {
    const results = [];
    const errors = [];

    for (const phoneNumber of phoneNumbers) {
      try {
        if (imageUrl) {
          await this.sendImageMessage(phoneNumber, imageUrl, message);
        } else {
          await this.sendTextMessage(phoneNumber, message);
        }
        results.push({ phoneNumber, status: 'success' });
      } catch (error) {
        errors.push({ phoneNumber, status: 'failed', error: error.message });
      }
    }

    return { results, errors };
  }

  // Validate phone number format
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming +1 for US)
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }
    
    return cleaned;
  }
}

module.exports = new WhatsAppAPI();
