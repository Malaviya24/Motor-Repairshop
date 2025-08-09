const express = require('express');
const { body, validationResult } = require('express-validator');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const whatsappAPI = require('../utils/whatsapp');
const router = express.Router();

// GET /api/messages - Get all messages (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Failed to fetch messages',
      message: 'Please try again later'
    });
  }
});

// POST /api/messages/send - Send WhatsApp message to all customers (admin only)
router.post('/send', auth, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { message, imageUrl } = req.body;

    // Get all customer phone numbers
    const customers = await Customer.find({}).select('phoneNumber');
    const phoneNumbers = customers.map(customer => 
      whatsappAPI.formatPhoneNumber(customer.phoneNumber)
    );

    if (phoneNumbers.length === 0) {
      return res.status(400).json({
        error: 'No customers found',
        message: 'Add some customers before sending messages'
      });
    }

    // Send bulk message
    const result = await whatsappAPI.sendBulkMessage(phoneNumbers, message, imageUrl);

    res.json({
      success: true,
      message: 'Messages sent successfully',
      data: {
        totalRecipients: phoneNumbers.length,
        successful: result.results.length,
        failed: result.errors.length,
        results: result.results,
        errors: result.errors
      }
    });

  } catch (error) {
    console.error('Send messages error:', error);
    res.status(500).json({
      error: 'Failed to send messages',
      message: error.message || 'Please try again later'
    });
  }
});

// PUT /api/messages/:id/reply - Mark message as replied (admin only)
router.put('/:id/reply', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        error: 'Message not found',
        message: 'The requested message does not exist'
      });
    }

    customer.status = 'replied';
    customer.updatedAt = new Date();
    await customer.save();

    res.json({
      success: true,
      message: 'Message marked as replied',
      data: {
        id: customer._id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        status: customer.status,
        updatedAt: customer.updatedAt
      }
    });

  } catch (error) {
    console.error('Mark as replied error:', error);
    res.status(500).json({
      error: 'Failed to update message status',
      message: 'Please try again later'
    });
  }
});

// GET /api/messages/unread - Get unread messages count (admin only)
router.get('/unread', auth, async (req, res) => {
  try {
    const unreadCount = await Customer.countDocuments({ status: 'unread' });
    
    res.json({
      success: true,
      data: {
        unreadCount
      }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      error: 'Failed to fetch unread count',
      message: 'Please try again later'
    });
  }
});

module.exports = router;
