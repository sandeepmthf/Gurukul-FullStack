import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

interface Lecture {
  id: string;
  title: string;
  batch: string;
  subject: string;
  description: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  duration?: string;
}

const BATCHES = [
  { id: 'IIT-JEE-2024', name: 'IIT JEE 2024', color: 'from-blue-500 to-indigo-600' },
  { id: 'IIT-JEE-2025', name: 'IIT JEE 2025', color: 'from-blue-600 to-indigo-700' },
  { id: 'NEET-2024', name: 'NEET 2024', color: 'from-emerald-500 to-teal-600' },
  { id: 'NEET-2025', name: 'NEET 2025', color: 'from-emerald-600 to-teal-700' },
  { id: 'CLASS-10-2024', name: 'Class 10 - 2024', color: 'from-amber-500 to-orange-600' },
  { id: 'CLASS-12-2024', name: 'Class 12 - 2024', color: 'from-purple-500 to-pink-600' },
  { id: 'SSC-2024', name: 'SSC CGL 2024', color: 'from-rose-500 to-red-600' },
];

export default function TeacherAdminPanel({ onNavigate }: AdminPanelProps) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'upload' | 'lectures' | 'batches' | 'students'>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Get teacher's assigned subjects
  const teacherSubjects = user?.subjects || [];
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    batch: '',
    subject: '',
    description: '',
    fileName: 'No file selected',
    fileType: '',
    duration: '',
  });

  // Load lectures from localStorage
  useEffect(() => {
    const storedLectures = localStorage.getItem('gurukul_lectures');
    if (storedLectures) {
      setLectures(JSON.parse(storedLectures));
    }
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({
        ...uploadForm,
        fileName: file.name,
        fileType: file.type,
      });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      title: uploadForm.title,
      batch: uploadForm.batch,
      subject: uploadForm.subject,
      description: uploadForm.description,
      fileName: uploadForm.fileName,
      fileType: uploadForm.fileType,
      uploadDate: new Date().toISOString(),
      uploadedBy: user?.name || 'Teacher',
      duration: uploadForm.duration,
    };

    const updatedLectures = [...lectures, newLecture];
    setLectures(updatedLectures);
    localStorage.setItem('gurukul_lectures', JSON.stringify(updatedLectures));

    // Show success message
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);

    // Reset form
    setUploadForm({
      title: '',
      batch: '',
      subject: '',
      description: '',
      fileName: 'No file selected',
      fileType: '',
      duration: '',
    });
    
    // Switch to lectures view
    setTimeout(() => setActiveSection('lectures'), 2000);
  };

  const handleDeleteLecture = (id: string) => {
    const updatedLectures = lectures.filter((l) => l.id !== id);
    setLectures(updatedLectures);
    localStorage.setItem('gurukul_lectures', JSON.stringify(updatedLectures));
  };

  const filteredLectures = selectedBatch === 'all' 
    ? lectures 
    : lectures.filter((l) => l.batch === selectedBatch);

  const getBatchStats = () => {
    return BATCHES.map((batch) => ({
      ...batch,
      lectureCount: lectures.filter((l) => l.batch === batch.id).length,
    }));
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                👨‍🏫
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                  Teacher Panel
                </h2>
                <p className="text-xs text-white/70">{user?.name}</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('home')} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shadow-sm"
              title="Return to Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
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
            active={activeSection === 'lectures'}
            onClick={() => {
              setActiveSection('lectures');
              setSidebarOpen(false);
            }}
            icon="🎥"
          >
            My Lectures
          </NavButton>
          <NavButton
            active={activeSection === 'batches'}
            onClick={() => {
              setActiveSection('batches');
              setSidebarOpen(false);
            }}
            icon="📚"
          >
            Batches
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
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
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
          <h1 className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>
            Teacher Panel
          </h1>
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
          {/* Upload Lecture Section */}
          {activeSection === 'upload' && (
            <div className="max-w-3xl">
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Upload New Lecture
              </h2>
              <p className="text-muted-foreground mb-8">Share knowledge with your students</p>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
                <form className="space-y-6" onSubmit={handleUploadSubmit}>
                  {/* Lecture Title */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📝</span>
                      Lecture Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      required
                      placeholder="e.g., Newton's Laws of Motion"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Batch Selection */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">🎓</span>
                      Select Batch *
                    </label>
                    <select 
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                      value={uploadForm.batch}
                      onChange={(e) => setUploadForm({ ...uploadForm, batch: e.target.value })}
                      required
                    >
                      <option value="">Select Batch</option>
                      {BATCHES.map((batch) => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      Subject *
                    </label>
                    <select 
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                      value={uploadForm.subject}
                      onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                      required
                    >
                      <option value="">Select Subject</option>
                      {teacherSubjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Brief description of the lecture content"
                      rows={3}
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">⏱️</span>
                      Duration (optional)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.duration}
                      onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                      placeholder="e.g., 45 mins"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">🎥</span>
                      Video/PDF File *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        required
                        accept="video/*,.pdf"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="block border-3 border-dashed border-border hover:border-accent/50 rounded-2xl p-12 text-center bg-gradient-to-br from-muted/30 to-background transition-all cursor-pointer group"
                      >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                          {uploadForm.fileName !== 'No file selected' ? '✅' : '📹'}
                        </div>
                        <p className="font-semibold text-primary mb-1">
                          {uploadForm.fileName !== 'No file selected' ? uploadForm.fileName : 'Click to upload file'}
                        </p>
                        <p className="text-sm text-muted-foreground">MP4, MOV, PDF up to 500MB</p>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload Lecture</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Lectures Section */}
          {activeSection === 'lectures' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                    My Lectures
                  </h2>
                  <p className="text-muted-foreground">Manage your uploaded content</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-4 py-3 border-2 border-border rounded-xl bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                  >
                    <option value="all">All Batches</option>
                    {BATCHES.map((batch) => (
                      <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredLectures.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-border">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="font-bold text-2xl text-primary mb-2">No lectures yet</h3>
                  <p className="text-muted-foreground mb-6">Start uploading lectures to share with your students</p>
                  <button
                    onClick={() => setActiveSection('upload')}
                    className="bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all"
                  >
                    Upload First Lecture
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="bg-white rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                              BATCHES.find((b) => b.id === lecture.batch)?.color || 'from-gray-500 to-gray-600'
                            }`}>
                              {BATCHES.find((b) => b.id === lecture.batch)?.name}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                              {lecture.subject}
                            </span>
                          </div>
                          <h3 className="font-bold text-xl text-primary mb-2">
                            {lecture.title}
                          </h3>
                          {lecture.description && (
                            <p className="text-sm text-muted-foreground mb-3">{lecture.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              📁 {lecture.fileName}
                            </span>
                            {lecture.duration && (
                              <span className="flex items-center gap-1">
                                ⏱️ {lecture.duration}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              📅 {new Date(lecture.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteLecture(lecture.id)}
                          className="p-3 hover:bg-red-50 rounded-xl transition-all group"
                          title="Delete lecture"
                        >
                          <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Batches Section */}
          {activeSection === 'batches' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Batch Overview
              </h2>
              <p className="text-muted-foreground mb-8">View lecture statistics by batch</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getBatchStats().map((batch) => (
                  <div
                    key={batch.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${batch.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                      🎓
                    </div>
                    <h3 className="font-bold text-xl text-primary mb-2">
                      {batch.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>🎥</span>
                        <span>{batch.lectureCount} Lectures</span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBatch(batch.id);
                        setActiveSection('lectures');
                      }}
                      className="w-full mt-4 bg-muted hover:bg-muted/70 text-primary font-semibold py-2.5 px-4 rounded-lg transition-all"
                    >
                      View Lectures
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Section */}
          {activeSection === 'students' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Student Management
              </h2>
              <p className="text-muted-foreground mb-8">View and manage enrolled students</p>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary to-[#0d3352] text-white">
                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                        <th className="px-6 py-4 text-left font-semibold">Batch</th>
                        <th className="px-6 py-4 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-primary">Rahul Sharma</td>
                        <td className="px-6 py-4 text-muted-foreground">student@gurukul.com</td>
                        <td className="px-6 py-4 text-muted-foreground">IIT JEE 2024</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                            Active
                          </span>
                        </td>
                      </tr>
                      {/* More students would be loaded from localStorage */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Toast */}
      {uploadSuccess && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Lecture uploaded successfully!</span>
        </div>
      )}
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