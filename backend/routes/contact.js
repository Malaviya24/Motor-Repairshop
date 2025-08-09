const express = require('express');
const { body, validationResult } = require('express-validator');
const Customer = require('../models/Customer');
const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phoneNumber')
    .trim()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please enter a valid phone number'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, phoneNumber, message } = req.body;

    // Create new customer
    const customer = new Customer({
      name,
      phoneNumber,
      message,
      status: 'unread'
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: customer._id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        status: customer.status,
        createdAt: customer.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      error: 'Failed to submit contact form',
      message: 'Please try again later'
    });
  }
});

module.exports = router;
