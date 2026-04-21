import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import User from './models/User.js';
import Course from './models/Course.js';
import { protect } from './middleware/authMiddleware.js';
import { adminProtect } from './middleware/adminMiddleware.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://www.gurukultheinstitute.in',
  'https://gurukultheinstitute.in',
  'https://gurukul-fullstack.vercel.app',
  'https://gurukul-full-stack.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminProtect, adminRoutes);

// Get user profile (protected by JWT)
app.get('/api/user/profile', protect, async (req, res) => {
  try {
    const user = req.user; // populated by auth middleware
    return res.json({
      success: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        batch: user.batch || '',
        role: 'student',
        isVerified: user.isVerified,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/student/batches', protect, async (_req, res) => {
  try {
    const courses = await Course.find({}).lean();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = Number(process.env.PORT || 5001);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to connect database:', error.message);
    process.exit(1);
  });
