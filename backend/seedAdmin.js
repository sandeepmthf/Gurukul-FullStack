import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@gurukul.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists in the database.');
    } else {
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: 'admin@123',
        mobile: '9876543210',
        role: 'admin',
        isVerified: true
      });
      console.log('Admin user successfully seeded!');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding admin:', error);
    mongoose.disconnect();
  }
};

seedAdmin();
