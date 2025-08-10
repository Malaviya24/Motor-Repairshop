# 🚀 Motor Repair Shop - Production Deployment Guide

This guide will help you deploy the Motor Repair Shop application to production for your customers.

## 📋 Prerequisites

- **GitHub Account** - For code repository
- **MongoDB Atlas Account** - For database
- **Vercel Account** - For frontend hosting (free)
- **Render Account** - For backend hosting (free tier available)
- **Domain Name** (optional) - For custom domain

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account or sign in
3. Create a new cluster (M0 Free tier is sufficient)
4. Choose your preferred region

### 2. Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create a user with **Read and write to any database** permissions
4. Save the username and password

### 3. Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. For development: Click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production: Add your server IP addresses

### 4. Get Connection String
1. Go to **Clusters** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend for Production
1. Update `frontend/.env` with production API URL:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_WHATSAPP_NUMBER=+919879825692
REACT_APP_SHOP_NAME=Universal Electric Motor Rewinding
REACT_APP_SHOP_PHONE=+919879825692
```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click **New Project**
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variables in Vercel dashboard
6. Click **Deploy**

### 3. Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Configure DNS as instructed

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend for Production
1. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/motor-repair-shop?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production
```

### 2. Deploy to Render
1. Go to [Render](https://render.com) and sign up/login
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `motor-repair-shop-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables in Render dashboard
6. Click **Create Web Service**

### 3. Seed the Database
1. In Render dashboard, go to your service
2. Click **Shell** tab
3. Run the seed script:
```bash
cd backend
npm install
node scripts/seed.js
```

## 🔐 Security Configuration

### 1. Update Admin Credentials
1. After deployment, login with default credentials:
   - Username: `admin`
   - Password: `admin123`
2. Change the password immediately in the admin dashboard

### 2. Environment Variables
Make sure these are set in your hosting platforms:

**Frontend (Vercel):**
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_WHATSAPP_NUMBER=+919879825692
REACT_APP_SHOP_NAME=Universal Electric Motor Rewinding
REACT_APP_SHOP_PHONE=+919879825692
```

**Backend (Render):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/motor-repair-shop?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production
```

## 📱 WhatsApp Business API Setup

### 1. Create WhatsApp Business Account
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create a new app
3. Add WhatsApp Business API product
4. Configure your phone number

### 2. Update Backend Configuration
1. Get your WhatsApp API credentials
2. Update `backend/.env`:
```env
WHATSAPP_TOKEN=your_whatsapp_cloud_api_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
```

### 3. Update Mass Messaging
The mass messaging feature will work with real WhatsApp API once configured.

## 🚀 Testing Your Deployment

### 1. Test Frontend
1. Visit your Vercel URL
2. Test the contact form
3. Test the admin login
4. Test all admin features

### 2. Test Backend
1. Visit `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"OK","message":"Motor Repair Shop API is running"}`

### 3. Test Database
1. Login to admin panel
2. Check if customer messages are being stored
3. Test customer management features

## 📊 Monitoring & Maintenance

### 1. Monitor Logs
- **Vercel**: Check deployment logs in dashboard
- **Render**: Monitor service logs and metrics
- **MongoDB Atlas**: Monitor database performance

### 2. Regular Backups
- MongoDB Atlas provides automatic backups
- Consider manual backups for critical data

### 3. Performance Optimization
- Monitor API response times
- Optimize database queries if needed
- Consider CDN for static assets

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend domain
   - Check environment variables

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings
   - Clear browser cache and localStorage

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors in code

## 📞 Support

If you encounter issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally first before deploying
4. Contact your hosting provider's support

## 🎉 Success!

Once deployed, your Motor Repair Shop website will be:
- ✅ **Live and accessible** to customers worldwide
- ✅ **Secure** with proper authentication
- ✅ **Scalable** with cloud hosting
- ✅ **Maintainable** with proper monitoring
- ✅ **Professional** and ready for business

Your customers can now:
- Visit your website
- Submit contact forms
- Download your contact information
- Chat on WhatsApp
- Access your services information

You can:
- Manage customers through the admin panel
- Send mass messages
- Track customer interactions
- Monitor business performance

**Congratulations! Your Motor Repair Shop is now live and ready for customers! 🚀**
