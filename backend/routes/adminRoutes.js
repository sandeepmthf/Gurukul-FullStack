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
    const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(10).select('name mobile email createdAt').lean();
    res.json({ success: true, data: recentStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new teacher (Admin only)
router.post('/teachers', async (req, res) => {
  try {
    const { name, email, password, mobile, subjects } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const teacher = await User.create({
      name,
      email,
      password, // In production, hash this!
      mobile,
      subjects,
      role: 'teacher',
      isVerified: true
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
