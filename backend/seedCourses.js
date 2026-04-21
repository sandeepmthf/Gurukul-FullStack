import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courses = [
      { title: 'Foundation Master (2026-27)', description: 'Complete board preparation', category: 'Class 9-10' },
      { title: 'JEE Achievers (2026-27)', description: 'Advanced IIT JEE physics, chemistry, and math curriculum', category: 'IIT JEE' },
      { title: 'NEET Targets (2026-27)', description: 'Medical entrance exam bio and physical sciences prep', category: 'NEET' }
    ];

    for (let course of courses) {
      const existing = await Course.findOne({ title: course.title });
      if (!existing) {
        await Course.create(course);
        console.log(`Created course: ${course.title}`);
      }
    }

    console.log('Courses seeding finished!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding courses:', error);
    mongoose.disconnect();
  }
};

seedCourses();
