# Motor Rewinding Shop - MERN Stack Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete MERN stack application for the motor rewinding shop, including the landing page, admin dashboard, and WhatsApp integration.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)
- **WhatsApp Business API** account - [Sign up here](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)

## 🏗️ Project Structure

```
motor-repair-shop/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── utils/              # WhatsApp API utilities
│   ├── scripts/            # Database seeding
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── index.js        # App entry point
│   └── package.json
├── README.md               # Project documentation
└── SETUP.md               # This setup guide
```

## 🔧 Installation Steps

### Step 1: Clone and Setup Project

```bash
# Clone the repository (if using git)
git clone <your-repo-url>
cd motor-repair-shop

# Or create the project structure manually
mkdir motor-repair-shop
cd motor-repair-shop
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Or create .env manually with the following content:
```

**Backend Environment Variables** (`backend/.env`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/motor-repair-shop
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/motor-repair-shop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# WhatsApp Cloud API
WHATSAPP_TOKEN=your-whatsapp-cloud-api-token
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Or create .env manually with the following content:
```

**Frontend Environment Variables** (`frontend/.env`):
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# WhatsApp Configuration
REACT_APP_WHATSAPP_NUMBER=+1234567890
REACT_APP_WHATSAPP_MESSAGE=Hello! I'm interested in your motor rewinding services.

# Shop Information
REACT_APP_SHOP_NAME=Motor Rewinding Shop
REACT_APP_SHOP_ADDRESS=123 Main Street, City, State 12345
REACT_APP_SHOP_PHONE=+1234567890
REACT_APP_SHOP_EMAIL=info@motorrepairshop.com
```

### Step 4: Database Setup

```bash
# Navigate to backend directory
cd ../backend

# Seed the database with default admin user
npm run seed
```

This creates a default admin user:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

### Step 5: WhatsApp API Setup

1. **Create Facebook Developer Account**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use existing one

2. **Add WhatsApp Product**:
   - In your app dashboard, click "Add Product"
   - Select "WhatsApp" and follow setup instructions

3. **Get API Credentials**:
   - Go to WhatsApp > Getting Started
   - Copy your `Access Token` and `Phone Number ID`
   - Add these to your `backend/.env` file

4. **Verify Phone Number**:
   - Follow the verification process for your WhatsApp Business number

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 🔐 Admin Access

1. Navigate to: http://localhost:3000/login
2. Use default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **Immediately change the password** in Settings tab

## 📱 WhatsApp Integration

### Testing WhatsApp Messages

1. **Send Test Message**:
   - Go to Admin Dashboard > Mass Messaging
   - Enter a test message
   - Click "Send to All Customers"

2. **Check Message Status**:
   - Messages are sent via WhatsApp Cloud API
   - Check your WhatsApp Business account for delivery status

### WhatsApp API Features

- ✅ **Text Messages**: Send custom text to all customers
- ✅ **Image Messages**: Upload and send images with captions
- ✅ **Bulk Messaging**: Send to multiple customers at once
- ✅ **Message Status**: Track delivery and read status

## 🛠️ API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Require Admin Login)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/profile` - Get admin profile
- `POST /api/admin/change-password` - Change admin password
- `GET /api/customers` - Get all customers
- `GET /api/customers/stats` - Get customer statistics
- `GET /api/messages` - Get all messages
- `GET /api/messages/unread` - Get unread messages
- `POST /api/messages/send` - Send mass WhatsApp message
- `PUT /api/messages/:id/reply` - Mark message as replied

## 🎨 Customization

### Landing Page Customization

Edit `frontend/src/components/LandingPage.js`:
- Update shop information
- Modify services list
- Change contact details
- Customize styling

### Admin Dashboard Customization

Edit `frontend/src/components/admin/`:
- Modify dashboard layout
- Add new features
- Customize messaging interface

### Styling Customization

Edit `frontend/tailwind.config.js`:
- Update color scheme
- Modify fonts
- Add custom animations

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

**Netlify:**
```bash
# Build the project
cd frontend
npm run build

# Deploy build folder to Netlify
# Or connect your GitHub repository
```

### Backend Deployment (Render/Heroku)

**Render:**
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push

**Heroku:**
```bash
# Install Heroku CLI
# Create new Heroku app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

### Environment Variables for Production

**Backend (Render/Heroku):**
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

**Frontend (Vercel/Netlify):**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_WHATSAPP_NUMBER=+1234567890
REACT_APP_SHOP_NAME=Your Shop Name
```

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error:**
```bash
# Check if MongoDB is running
mongod --version

# For MongoDB Atlas, ensure IP whitelist includes your IP
```

**2. WhatsApp API Errors:**
- Verify your WhatsApp token and phone number ID
- Check if your WhatsApp Business account is verified
- Ensure phone numbers are in international format

**3. JWT Authentication Issues:**
- Verify JWT_SECRET is set correctly
- Check token expiration time
- Ensure proper token format in requests

**4. CORS Errors:**
- Update CORS configuration in `backend/server.js`
- Add your frontend URL to allowed origins

### Debug Mode

**Backend:**
```bash
cd backend
DEBUG=* npm run dev
```

**Frontend:**
```bash
cd frontend
REACT_APP_DEBUG=true npm start
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check browser console and server logs for errors

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies:**
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

2. **Database Backup:**
```bash
# MongoDB backup
mongodump --db motor-repair-shop --out backup/
```

3. **Security Updates:**
- Regularly update JWT secret
- Monitor WhatsApp API usage
- Review and update admin passwords

## 📚 Additional Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**🎉 Congratulations!** Your motor rewinding shop MERN stack application is now ready to use. Remember to:

1. Change the default admin password
2. Configure your WhatsApp Business API
3. Customize the landing page for your business
4. Deploy to production when ready

Happy coding! 🚀
