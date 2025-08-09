const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Customer.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminPassword = 'admin123'; // Change this in production!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@universalmotorrewinding.com',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('👨‍💼 Admin user created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@universalmotorrewinding.com');

    // Create some sample customers
    const sampleCustomers = [
      {
        name: 'John Smith',
        phoneNumber: '+918866353250',
        message: 'Need repair for water pump motor',
        isVerified: true,
        status: 'unread',
        notes: 'Regular customer'
      },
      {
        name: 'Sarah Johnson',
        phoneNumber: '+919876543210',
        message: 'AC motor not working properly',
        isVerified: false,
        status: 'unread',
        notes: 'New customer'
      },
      {
        name: 'Mike Wilson',
        phoneNumber: '+919876543211',
        message: 'Industrial motor repair needed',
        isVerified: true,
        status: 'replied',
        notes: 'Priority customer'
      }
    ];

    for (const customerData of sampleCustomers) {
      const customer = new Customer(customerData);
      await customer.save();
    }

    console.log('👥 Sample customers created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the admin password in production!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
