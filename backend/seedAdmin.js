import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'infogurukul.theinstitute@gmail.com';
    const adminPassword = 'Gurukul@9044';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.password = adminPassword;
      user.role = 'admin';
      user.isVerified = true;
      await user.save();
      console.log('Updated existing user to Admin.');
    } else {
      await User.create({
        name: 'Master Administrator',
        email: adminEmail,
        password: adminPassword,
        mobile: '9999999999',
        role: 'admin',
        isVerified: true
      });
      console.log('Created new Master Admin account!');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error updating admin:', error);
    mongoose.disconnect();
  }
};

updateAdmin();
