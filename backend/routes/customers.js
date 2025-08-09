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
    const verifiedCustomers = await Customer.countDocuments({ isVerified: true });
    const unverifiedCustomers = await Customer.countDocuments({ isVerified: false });
    
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
        verifiedCustomers,
        unverifiedCustomers,
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

// POST /api/customers - Add new customer (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, phoneNumber, isVerified, notes } = req.body;

    // Validate phone number
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({
        error: 'Phone number is required'
      });
    }

    // Check if phone number already exists
    const existingCustomer = await Customer.findOne({ phoneNumber: phoneNumber.trim() });
    if (existingCustomer) {
      return res.status(400).json({
        error: 'Customer with this phone number already exists'
      });
    }

    const customer = new Customer({
      name: name?.trim() || '',
      phoneNumber: phoneNumber.trim(),
      isVerified: isVerified || false,
      notes: notes?.trim() || ''
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: customer
    });

  } catch (error) {
    console.error('Add customer error:', error);
    res.status(500).json({
      error: 'Failed to add customer',
      message: 'Please try again later'
    });
  }
});

// PUT /api/customers/:id - Update customer (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, phoneNumber, isVerified, notes } = req.body;
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    // Check if phone number is being changed and if it already exists
    if (phoneNumber && phoneNumber.trim() !== customer.phoneNumber) {
      const existingCustomer = await Customer.findOne({ 
        phoneNumber: phoneNumber.trim(),
        _id: { $ne: customerId }
      });
      if (existingCustomer) {
        return res.status(400).json({
          error: 'Customer with this phone number already exists'
        });
      }
    }

    customer.name = name?.trim() || '';
    customer.phoneNumber = phoneNumber?.trim() || customer.phoneNumber;
    customer.isVerified = isVerified !== undefined ? isVerified : customer.isVerified;
    customer.notes = notes?.trim() || '';

    await customer.save();

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });

  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      error: 'Failed to update customer',
      message: 'Please try again later'
    });
  }
});

// DELETE /api/customers/:id - Delete customer (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      error: 'Failed to delete customer',
      message: 'Please try again later'
    });
  }
});

// PATCH /api/customers/:id/verify - Toggle verification status (admin only)
router.patch('/:id/verify', auth, async (req, res) => {
  try {
    const customerId = req.params.id;
    const { isVerified } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    customer.isVerified = isVerified;
    await customer.save();

    res.json({
      success: true,
      message: 'Verification status updated',
      data: customer
    });

  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({
      error: 'Failed to update verification status',
      message: 'Please try again later'
    });
  }
});

module.exports = router;
