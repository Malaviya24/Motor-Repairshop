# 📱 WhatsApp Business API Setup Guide

## 🎯 Overview
This guide will help you set up WhatsApp Business API for your Motor Repair Shop application.

## 📋 Prerequisites
- Facebook Developer Account
- WhatsApp Business Account
- Verified Phone Number

## 🚀 Step-by-Step Setup

### Step 1: Create Facebook Developer Account
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Get Started" or "Log In"
3. Complete the developer registration process

### Step 2: Create a New App
1. In Facebook Developers dashboard, click "Create App"
2. Select "Business" as the app type
3. Fill in your app details:
   - **App Name**: Motor Repair Shop
   - **App Contact Email**: Your email
   - **Business Account**: Select your business account
4. Click "Create App"

### Step 3: Add WhatsApp Product
1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard

### Step 4: Get API Credentials
1. Go to WhatsApp > Getting Started
2. Note down your **Access Token** and **Phone Number ID**
3. These will be added to your `.env` file

### Step 5: Configure Webhook (Optional)
1. In WhatsApp settings, configure webhook URL
2. Add verification token
3. Subscribe to message events

### Step 6: Verify Phone Number
1. Add your business phone number
2. Complete the verification process
3. Wait for approval (usually 24-48 hours)

## 🔧 Environment Configuration

### Backend Configuration
Add these to your `backend/.env` file:

```env
# WhatsApp Cloud API Configuration
WHATSAPP_TOKEN=your_whatsapp_cloud_api_token_here
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id_here
```

### Frontend Configuration
Add this to your `frontend/.env` file:

```env
# WhatsApp Configuration
REACT_APP_WHATSAPP_NUMBER=+918866353250
```

## 🎯 Features Enabled

Once configured, you'll have access to:

### ✅ Admin Dashboard Features
- **Mass Messaging**: Send messages to all customers
- **Bulk Messaging**: Send to verified customers only
- **Message Tracking**: Monitor delivery status
- **Customer Communication**: Direct WhatsApp integration

### ✅ Landing Page Features
- **WhatsApp Chat Button**: Direct customer support
- **Contact Integration**: Seamless communication flow

## 🧪 Testing

### Test Mass Messaging
1. Login to admin dashboard
2. Go to "Mass Messaging" section
3. Enter a test message
4. Click "Send to All Customers"
5. Check WhatsApp Business app for delivery status

### Test Individual Messages
1. Go to "Customer Messages" section
2. Click "Reply" on any customer message
3. Message will be sent via WhatsApp

## 💰 Cost Information

### WhatsApp Business API Pricing
- **First 1,000 messages/month**: FREE
- **Additional messages**: $0.005 per message
- **Media messages**: $0.010 per message

### Monthly Costs (Estimated)
- **Small Business (1,000-5,000 messages)**: $0-20/month
- **Medium Business (5,000-10,000 messages)**: $20-45/month
- **Large Business (10,000+ messages)**: $45+/month

## 🔍 Troubleshooting

### Common Issues
1. **"Invalid Token" Error**
   - Verify your WhatsApp token is correct
   - Check token expiration date

2. **"Phone Number Not Verified"**
   - Complete phone number verification process
   - Wait for approval (24-48 hours)

3. **"Message Sending Failed"**
   - Check phone number format (+country code)
   - Verify customer phone numbers are valid

### Support Resources
- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Facebook Developers Support](https://developers.facebook.com/support/)
- [WhatsApp Business Help Center](https://www.whatsapp.com/business/)

## 🎉 Success Checklist

- [ ] Facebook Developer account created
- [ ] WhatsApp product added to app
- [ ] API credentials obtained
- [ ] Environment variables configured
- [ ] Phone number verified
- [ ] Test message sent successfully
- [ ] Mass messaging feature working
- [ ] Customer messages integrated

## 📞 Next Steps

1. **Complete Setup**: Follow the steps above to configure WhatsApp API
2. **Test Features**: Send test messages to verify functionality
3. **Train Staff**: Show team how to use mass messaging
4. **Monitor Usage**: Track message delivery and engagement
5. **Scale Up**: Increase messaging as business grows

---

**🎯 Ready to get started?** Follow the steps above to add WhatsApp API to your Motor Repair Shop application!
