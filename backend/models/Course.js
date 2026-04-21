import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ['Class 6-8', 'Class 9-10', 'IIT JEE', 'NEET', 'SSC', 'Police', 'Other'],
    default: 'Other'
  },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
