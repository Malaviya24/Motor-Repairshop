const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/customers - Get all customers (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;
    
    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get customers with pagination
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      error: 'Failed to fetch customers',
      message: 'Please try again later'
    });
  }
});

// GET /api/customers/stats - Get customer statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const unreadMessages = await Customer.countDocuments({ status: 'unread' });
    const repliedMessages = await Customer.countDocuments({ status: 'replied' });
    
    // Get customers from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCustomers = await Customer.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        totalCustomers,
        unreadMessages,
        repliedMessages,
        recentCustomers
      }
    });

  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch customer statistics',
      message: 'Please try again later'
    });
  }
});

module.exports = router;
