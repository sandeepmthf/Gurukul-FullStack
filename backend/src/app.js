import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors({ origin: process.env.APP_ORIGIN || '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);

// Mock Student Dashboard Endpoints
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    data: { name: 'Demo Student', email: 'demo@student.com', role: 'student', batch: 'Batch A', mobile: '+919818034565' }
  });
});

app.get('/api/student/batches', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: 'b1', name: 'Physics Mastery', courseId: { title: 'Class 12 Physics' }, teacherId: { name: 'Prof. Sharma' }, status: 'active' },
      { _id: 'b2', name: 'Chemistry Crash Course', courseId: { title: 'Class 12 Chemistry' }, teacherId: { name: 'Dr. Arora' }, status: 'upcoming' }
    ]
  });
});

app.get('/api/student/content/:batchId', (req, res) => {
  res.json({
    success: true,
    data: [
      { title: 'Intro to Thermodynamics', type: 'lecture', fileUrl: 'https://youtube.com', createdAt: new Date() },
      { title: 'Chapter 1 Notes', type: 'notes', fileUrl: '#', createdAt: new Date() },
      { title: 'DPP #1', type: 'dpp', fileUrl: '#', createdAt: new Date() }
    ]
  });
});

app.post('/api/student/enroll', (req, res) => {
  res.json({ success: true, message: 'Successfully enrolled in batch' });
});

// Explicit 404 handler to return JSON instead of HTML
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

export default app;
