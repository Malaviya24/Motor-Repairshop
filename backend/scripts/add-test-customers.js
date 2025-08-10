const mongoose = require('mongoose');
const Customer = require('../models/Customer');
require('dotenv').config();

const testCustomers = [
                {
                name: 'John Smith',
                phoneNumber: '+919876543210',
                message: 'Need water pump motor repair',
                status: 'unread',
                createdAt: new Date()
              },
  {
    name: 'Sarah Johnson',
    phoneNumber: '+919876543211',
    message: 'AC motor not working properly',
    status: 'unread',
    createdAt: new Date()
  },
  {
    name: 'Mike Wilson',
    phoneNumber: '+1555123456',
    message: 'Industrial motor needs rewinding',
    status: 'replied',
    createdAt: new Date()
  },
  {
    name: 'Lisa Brown',
    phoneNumber: '+1777888999',
    message: 'Fan motor making noise',
    status: 'unread',
    createdAt: new Date()
  },
  {
    name: 'David Lee',
    phoneNumber: '+1444333222',
    message: 'Submersible pump motor issue',
    status: 'unread',
    createdAt: new Date()
  }
];

const addTestCustomers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing test customers
    await Customer.deleteMany({});
    console.log('Cleared existing customers');

    // Add test customers
    const customers = await Customer.insertMany(testCustomers);
    console.log(`Added ${customers.length} test customers:`);
    
    customers.forEach(customer => {
      console.log(`- ${customer.name}: ${customer.phoneNumber}`);
    });

    console.log('\nTest customers added successfully!');
    console.log('You can now test the mass messaging feature in the admin panel.');

  } catch (error) {
    console.error('Error adding test customers:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

addTestCustomers();
