import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
