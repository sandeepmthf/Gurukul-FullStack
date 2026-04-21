import express from 'express';
import Course from '../models/Course.js';
import Lecture from '../models/Lecture.js';
import User from '../models/User.js';

const router = express.Router();

// Get all courses (Public/Admin can use, we will mount it openly or loosely protected)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().lean();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new course (Admin only)
router.post('/courses', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }

    const course = await Course.create({ title, description, category });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload/Create a new lecture (Admin only)
router.post('/lectures', async (req, res) => {
  try {
    const { title, courseId, videoUrl } = req.body;
    if (!title || !courseId || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title, courseId, and videoUrl are required' });
    }

    const lecture = await Lecture.create({ title, courseId, videoUrl });
    res.status(201).json({ success: true, data: lecture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all students (Admin only)
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').lean();
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recent enquiries (Mocked or using User registrations for now)
router.get('/enquiries', async (req, res) => {
  try {
    // Just fetch recently created users to mock inquiries
    const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(10).select('name mobile email createdAt').lean();
    res.json({ success: true, data: recentStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
