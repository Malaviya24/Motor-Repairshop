const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// In-memory storage for messages (temporary)
let customerMessages = [];

// Middleware
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Contact endpoint with detailed error logging
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
    
    // Create new customer message
    const newMessage = {
      id: Date.now().toString(),
      name: name || 'Anonymous',
      phoneNumber: cleanNumber, // Store cleaned number
      message: message || 'No message provided',
      status: 'unread',
      isVerified: false,
      createdAt: new Date()
    };
    
    // Store in memory (temporary)
    customerMessages.push(newMessage);
    
    console.log('✅ Customer message stored:', newMessage.id);
    console.log('📊 Total messages stored:', customerMessages.length);
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      error: 'Failed to submit contact form',
      message: error.message
    });
  }
});

// Get all customers endpoint
app.get('/api/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    
    let filteredCustomers = customerMessages;
    
    // Apply search filter
    if (search) {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.phoneNumber?.includes(search) ||
        customer.message?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status === 'verified') {
      filteredCustomers = filteredCustomers.filter(customer => customer.isVerified);
    } else if (status === 'unverified') {
      filteredCustomers = filteredCustomers.filter(customer => !customer.isVerified);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedCustomers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCustomers.length / limit),
        totalItems: filteredCustomers.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { name, phoneNumber, isVerified = false, notes = '' } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const newCustomer = {
      id: Date.now().toString(),
      name: name || 'Anonymous',
      phoneNumber: phoneNumber.replace(/[\s\-\(\)]/g, ''),
      message: notes || 'No message provided',
      status: 'unread',
      isVerified: isVerified,
      notes: notes,
      createdAt: new Date()
    };
    
    customerMessages.push(newCustomer);
    
    console.log('✅ Customer added:', newCustomer.id);
    
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
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber, isVerified, notes } = req.body;
    
    const customerIndex = customerMessages.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customerMessages[customerIndex] = {
      ...customerMessages[customerIndex],
      name: name || customerMessages[customerIndex].name,
      phoneNumber: phoneNumber ? phoneNumber.replace(/[\s\-\(\)]/g, '') : customerMessages[customerIndex].phoneNumber,
      isVerified: isVerified !== undefined ? isVerified : customerMessages[customerIndex].isVerified,
      notes: notes !== undefined ? notes : customerMessages[customerIndex].notes
    };
    
    console.log('✅ Customer updated:', id);
    
    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customerMessages[customerIndex]
    });
  } catch (error) {
    console.error('❌ Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const customerIndex = customerMessages.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customerMessages.splice(customerIndex, 1);
    
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
app.patch('/api/customers/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;
    
    const customerIndex = customerMessages.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    customerMessages[customerIndex].isVerified = isVerified;
    
    console.log('✅ Customer verification updated:', id, isVerified);
    
    res.json({
      success: true,
      message: 'Verification status updated successfully',
      data: customerMessages[customerIndex]
    });
  } catch (error) {
    console.error('❌ Error updating verification:', error);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// Get messages with pagination and filters
app.get('/api/messages', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', search = '' } = req.query;
    
    let filteredMessages = customerMessages;
    
    // Apply status filter
    if (status === 'unread') {
      filteredMessages = filteredMessages.filter(msg => msg.status === 'unread');
    } else if (status === 'replied') {
      filteredMessages = filteredMessages.filter(msg => msg.status === 'replied');
    }
    
    // Apply search filter
    if (search) {
      filteredMessages = filteredMessages.filter(msg => 
        msg.name?.toLowerCase().includes(search.toLowerCase()) ||
        msg.phoneNumber?.includes(search) ||
        msg.message?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedMessages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredMessages.length / limit),
        totalItems: filteredMessages.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get unread messages count
app.get('/api/messages/unread', async (req, res) => {
  try {
    const unreadCount = customerMessages.filter(msg => msg.status === 'unread').length;
    
    res.json({
      success: true,
      data: {
        unreadCount: unreadCount,
        totalCount: customerMessages.length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark message as replied
app.put('/api/messages/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    
    const messageIndex = customerMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    customerMessages[messageIndex].status = 'replied';
    
    console.log('✅ Message marked as replied:', id);
    
    res.json({
      success: true,
      message: 'Message marked as replied successfully',
      data: customerMessages[messageIndex]
    });
  } catch (error) {
    console.error('❌ Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// Get customer statistics for mass messaging
app.get('/api/messages/stats', async (req, res) => {
  try {
    const totalCustomers = customerMessages.length;
    const verifiedCustomers = customerMessages.filter(customer => customer.isVerified).length;
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

// Send mass message
app.post('/api/messages/send', async (req, res) => {
  try {
    const { message, sendToVerifiedOnly = true } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    let targetCustomers = customerMessages;
    
    if (sendToVerifiedOnly) {
      targetCustomers = customerMessages.filter(customer => customer.isVerified);
    }
    
    const phoneNumbers = targetCustomers.map(customer => customer.phoneNumber);
    
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Debug server running with in-memory storage',
    totalMessages: customerMessages.length
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`💾 Messages stored in memory (temporary)`);
  console.log(`📊 MongoDB would store messages in: motor-repair-shop database`);
  console.log(`📋 Collection name: customers`);
});
