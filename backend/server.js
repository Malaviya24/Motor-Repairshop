const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Models
const Customer = require('./models/Customer');
const Admin = require('./models/Admin');

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Motor Repair Shop API is running',
    timestamp: new Date().toISOString()
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📝 Contact form received:', req.body);
    
    const { name, phoneNumber, message } = req.body;
    
    // Validate required fields
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Clean phone number
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Validate phone number format
    if (cleanNumber.length < 10) {
      return res.status(400).json({ error: 'Please enter full phone number (minimum 10 digits)' });
    }
    
    if (!/^\+?[1-9]\d{9,14}$/.test(cleanNumber)) {
      return res.status(400).json({ error: 'Please enter a valid phone number format' });
    }
    
    if (cleanNumber.startsWith('+') && cleanNumber.length < 12) {
      return res.status(400).json({ error: 'Please enter complete number with country code' });
    }
    
    // Create new customer
    const newCustomer = new Customer({
      name: name || 'Anonymous',
      phoneNumber: cleanNumber,
      message: message || 'No message provided',
      isVerified: false,
      status: 'unread'
    });
    
    await newCustomer.save();
    
    console.log('✅ Customer message stored:', newCustomer._id);
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: newCustomer
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      error: 'Failed to submit contact form',
      message: error.message
    });
  }
});

// Admin login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Find admin user
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        username: admin.username
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get customer statistics
app.get('/api/messages/stats', authenticateToken, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const verifiedCustomers = await Customer.countDocuments({ isVerified: true });
    const unverifiedCustomers = totalCustomers - verifiedCustomers;
    
    res.json({
      success: true,
      data: {
        totalCustomers,
        verifiedCustomers,
        unverifiedCustomers
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all customers with pagination and filters
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    
    let query = {};
    
    // Apply search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Apply status filter
    if (status === 'verified') {
      query.isVerified = true;
    } else if (status === 'unverified') {
      query.isVerified = false;
    }
    
    const totalCustomers = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json({
      data: customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCustomers / limit),
        totalItems: totalCustomers,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create new customer
app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    const { name, phoneNumber, isVerified = false, notes = '' } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const newCustomer = new Customer({
      name: name || 'Anonymous',
      phoneNumber: phoneNumber.replace(/[\s\-\(\)]/g, ''),
      message: notes || 'No message provided',
      isVerified: isVerified,
      notes: notes,
      status: 'unread'
    });
    
    await newCustomer.save();
    
    console.log('✅ Customer added:', newCustomer._id);
    
    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: newCustomer
    });
  } catch (error) {
    console.error('❌ Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Update customer
app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, isVerified, notes } = req.body;
    
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customer.name = name || customer.name;
    customer.phoneNumber = phoneNumber ? phoneNumber.replace(/[\s\-\(\)]/g, '') : customer.phoneNumber;
    customer.isVerified = isVerified !== undefined ? isVerified : customer.isVerified;
    customer.notes = notes !== undefined ? notes : customer.notes;
    
    await customer.save();
    
    console.log('✅ Customer updated:', id);
    
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('❌ Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    console.log('✅ Customer deleted:', id);
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Toggle verification status
app.patch('/api/customers/:id/verify', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;
    
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customer.isVerified = isVerified;
    await customer.save();
    
    console.log('✅ Customer verification updated:', id, isVerified);
    
    res.json({
      success: true,
      message: 'Verification status updated successfully',
      data: customer
    });
  } catch (error) {
    console.error('❌ Error updating verification:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// Get messages with pagination and filters
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    
    let query = {};
    
    // Apply status filter
    if (status === 'unread') {
      query.status = 'unread';
    } else if (status === 'replied') {
      query.status = 'replied';
    }
    
    // Apply search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    
    const totalMessages = await Customer.countDocuments(query);
    const messages = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    res.json({
      data: messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalItems: totalMessages,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get unread messages count
app.get('/api/messages/unread', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await Customer.countDocuments({ status: 'unread' });
    const totalCount = await Customer.countDocuments();
    
    res.json({
      success: true,
      data: {
        unreadCount: unreadCount,
        totalCount: totalCount
      }
    });
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark message as replied
app.put('/api/messages/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Customer.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    message.status = 'replied';
    await message.save();
    
    console.log('✅ Message marked as replied:', id);
    
    res.json({
      success: true,
      message: 'Message marked as replied successfully',
      data: message
    });
  } catch (error) {
    console.error('❌ Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// Send mass message
app.post('/api/messages/send', authenticateToken, async (req, res) => {
  try {
    const { message, sendToVerifiedOnly = true } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    let query = {};
    if (sendToVerifiedOnly) {
      query.isVerified = true;
    }
    
    const customers = await Customer.find(query);
    const phoneNumbers = customers.map(customer => customer.phoneNumber);
    
    console.log(`📤 Mass message sent to ${phoneNumbers.length} customers`);
    console.log(`📝 Message: ${message}`);
    console.log(`✅ Verified only: ${sendToVerifiedOnly}`);
    
    // In a real implementation, you would send via WhatsApp API here
    // For now, we'll just log the action
    
    res.json({
      success: true,
      message: 'Mass message sent successfully',
      data: {
        totalRecipients: phoneNumbers.length,
        phoneNumbers: phoneNumbers,
        message: message,
        sendToVerifiedOnly: sendToVerifiedOnly
      }
    });
  } catch (error) {
    console.error('❌ Error sending mass message:', error);
    res.status(500).json({ error: 'Failed to send mass message' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Production server running on port ${PORT}`);
  console.log(`💾 Connected to MongoDB: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing'}`);
  console.log(`📊 Database: motor-repair-shop`);
  console.log(`📋 Collection: customers`);
});
