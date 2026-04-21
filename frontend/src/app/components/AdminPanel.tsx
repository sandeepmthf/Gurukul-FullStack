import { useState, useEffect } from 'react';
import { getAdminCourses, getAdminStudents, getAdminEnquiries, uploadAdminLecture } from '../../services/api';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<'upload' | 'students' | 'courses' | 'enquiries'>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States for API data
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Upload Form State
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureCourseId, setLectureCourseId] = useState('');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('');

  // Fetch data
  useEffect(() => {
    getAdminCourses().then(res => setCourses(res.data)).catch(console.error);
    getAdminStudents().then(res => setStudents(res.data)).catch(console.error);
    getAdminEnquiries().then(res => setEnquiries(res.data)).catch(console.error);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle || !lectureCourseId || !lectureVideoUrl) return alert("Please fill all fields!");
    setIsUploading(true);
    try {
      await uploadAdminLecture({ title: lectureTitle, courseId: lectureCourseId, videoUrl: lectureVideoUrl });
      alert("Lecture uploaded successfully!");
      setLectureTitle('');
      setLectureVideoUrl('');
    } catch (err) {
      alert("Failed to upload lecture");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-muted via-background to-muted">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-primary via-[#0d2f4d] to-[#0A2540] text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static shadow-2xl`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-xl">
              👨‍💼
            </div>
            <div>
              <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>Admin Panel</h2>
              <p className="text-xs text-white/60">Dashboard Control</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavButton
            active={activeSection === 'upload'}
            onClick={() => {
              setActiveSection('upload');
              setSidebarOpen(false);
            }}
            icon="📤"
          >
            Upload Lecture
          </NavButton>
          <NavButton
            active={activeSection === 'students'}
            onClick={() => {
              setActiveSection('students');
              setSidebarOpen(false);
            }}
            icon="👥"
          >
            Students
          </NavButton>
          <NavButton
            active={activeSection === 'courses'}
            onClick={() => {
              setActiveSection('courses');
              setSidebarOpen(false);
            }}
            icon="📚"
          >
            Courses
          </NavButton>
          <NavButton
            active={activeSection === 'enquiries'}
            onClick={() => {
              setActiveSection('enquiries');
              setSidebarOpen(false);
            }}
            icon="📨"
          >
            Enquiries
          </NavButton>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-border p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <h1 className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="p-6 lg:p-10">
          {activeSection === 'upload' && (
            <div className="max-w-3xl">
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Upload New Lecture
              </h2>
              <p className="text-muted-foreground mb-8">Add new video content</p>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
                <form className="space-y-6" onSubmit={handleUpload}>
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📝</span>
                      Lecture Title
                    </label>
                    <input
                      type="text"
                      value={lectureTitle}
                      onChange={e => setLectureTitle(e.target.value)}
                      placeholder="Enter lecture title"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      Select Course
                    </label>
                    <select 
                      value={lectureCourseId}
                      onChange={e => setLectureCourseId(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course: any) => (
                        <option key={course._id} value={course._id}>{course.title} ({course.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      Video URL (mp4 link for now)
                    </label>
                    <input
                      type="text"
                      value={lectureVideoUrl}
                      onChange={e => setLectureVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>{isUploading ? 'Uploading...' : 'Upload Lecture'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'students' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Students List
              </h2>
              <p className="text-muted-foreground mb-8">Manage enrolled students</p>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary to-[#0d3352] text-white">
                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Mobile</th>
                        <th className="px-6 py-4 text-left font-semibold">Course</th>
                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No students enrolled yet.</td></tr>
                      )}
                      {students.map((student: any) => (
                        <tr key={student._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-primary">{student.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{student.mobile || student.email}</td>
                          <td className="px-6 py-4 text-muted-foreground">{student.batch || 'Unassigned'}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                              {student.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Manage Courses
              </h2>
              <p className="text-muted-foreground mb-8">Course management</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 && (
                  <div className="col-span-full py-8 text-center text-muted-foreground bg-white rounded-2xl border border-border">
                    No courses available. The database is empty.
                  </div>
                )}
                {courses.map((course: any) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="font-bold text-xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                      {course.title}
                    </h3>
                    <p className="text-xs text-accent font-semibold mb-2">{course.category}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.description || "No description provided."}
                    </p>
                    <button className="w-full bg-muted hover:bg-muted/70 text-primary font-semibold py-2.5 px-4 rounded-lg transition-all">
                      Manage Content
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'enquiries' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Recent Enquiries
              </h2>
              <p className="text-muted-foreground mb-8">Student inquiries</p>

              <div className="space-y-4">
                {enquiries.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground bg-white rounded-2xl border border-border">
                    No recent enquiries.
                  </div>
                )}
                {enquiries.map((enq: any) => (
                  <div
                    key={enq._id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-primary mb-1">{enq.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>📱</span>
                          <span>{enq.mobile || enq.email}</span>
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">Account created:</span> Recently Registered
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  children
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
        active
          ? 'bg-secondary text-primary shadow-lg shadow-secondary/30'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
      style={{ fontFamily: 'var(--font-family-display)' }}
    >
      <span className="text-xl">{icon}</span>
      <span>{children}</span>
    </button>
  );
}
