# 🚗 Motor Rewinding Shop - MERN Stack Web Application

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive web application for motor rewinding shops built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features include customer management, WhatsApp messaging integration, admin dashboard, and responsive design.

## ✨ Features

### 🏠 Landing Page
- **Professional Design**: Modern, responsive landing page with Tailwind CSS
- **Contact Form**: Customer inquiry submission with validation
- **WhatsApp Integration**: Direct chat button for instant customer support
- **vCard Download**: Easy contact saving for customers
- **Service Showcase**: Highlight repair services and expertise

### 🔐 Admin Dashboard
- **Secure Authentication**: JWT-based admin login system
- **Mass Messaging**: Send WhatsApp messages to all customers
- **Customer Management**: View and manage customer database
- **Message Tracking**: Monitor customer inquiries and responses
- **Settings Management**: Admin profile and password management

### 📱 WhatsApp Integration
- **Cloud API**: WhatsApp Business API integration
- **Bulk Messaging**: Send messages to multiple customers
- **Media Support**: Send text and image messages
- **Status Tracking**: Monitor message delivery status

### 🛠 Technical Features
- **MERN Stack**: Full-stack JavaScript development
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization
- **Security**: JWT authentication and input validation
- **Scalable Architecture**: Modular code structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- WhatsApp Business API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Malaviya24/Motor-Repairshop.git
   cd Motor-Repairshop
   ```
np
2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment variables
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB and WhatsApp credentials
   
   # Frontend environment variables
   cd ../frontend
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Database Setup**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start backend server (Terminal 1)
   cd backend
   npm start
   
   # Start frontend server (Terminal 2)
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Login: http://localhost:3000/login

## 📋 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
WHATSAPP_TOKEN=your_whatsapp_cloud_api_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WHATSAPP_NUMBER=+1234567890
REACT_APP_SHOP_NAME=Motor Rewinding Shop
REACT_APP_SHOP_EMAIL=info@motorrepairshop.com
REACT_APP_SHOP_PHONE=+1 (234) 567-8900
REACT_APP_SHOP_ADDRESS=123 Main Street, City, State 12345
```

## 🗂 Project Structure

```
Motor-Repairshop/
├── backend/                 # Node.js + Express server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── scripts/            # Database seeding
│   └── server.js           # Main server file
├── frontend/               # React.js application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── SETUP.md               # Detailed setup guide
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `POST /api/admin/change-password` - Change admin password

### Customer Management
- `POST /api/contact` - Submit contact form
- `GET /api/customers` - Get all customers
- `PUT /api/customers/:id` - Update customer

### Messaging
- `GET /api/messages` - Get customer messages
- `POST /api/messages/send-bulk` - Send bulk WhatsApp messages
- `PUT /api/messages/:id/reply` - Mark message as replied

## 🎨 Technologies Used

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### DevOps & Tools
- **Git** - Version control
- **npm** - Package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Backend Deployment (Render/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build commands
4. Deploy to cloud platform

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [SETUP.md](SETUP.md) file for detailed setup instructions
2. Review the troubleshooting section
3. Open an issue on GitHub
4. Contact the development team

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [MongoDB](https://mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp) for messaging

---

**Made with ❤️ for motor rewinding shops worldwide**

⭐ **Star this repository if you find it helpful!**
