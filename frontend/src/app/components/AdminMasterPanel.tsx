import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAdminTeachers, createAdminTeacher, getAdminStudents } from '../../services/api';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'teacher';
  subjects: string[];
  createdAt: string;
}

const ALL_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'English',
  'General Studies',
  'Reasoning',
  'Current Affairs',
  'Computer Science',
  'History',
  'Geography',
  'Economics',
];

export default function AdminMasterPanel({ onNavigate }: AdminPanelProps) {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'create-teacher' | 'teachers' | 'students' | 'lectures'>('teachers');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    subjects: [] as string[],
  });

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teachersRes, studentsRes] = await Promise.all([
          getAdminTeachers(),
          getAdminStudents()
        ]);
        setTeachers(teachersRes.data || []);
        setStudents(studentsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const handleSubjectToggle = (subject: string) => {
    if (teacherForm.subjects.includes(subject)) {
      setTeacherForm({
        ...teacherForm,
        subjects: teacherForm.subjects.filter((s) => s !== subject),
      });
    } else {
      setTeacherForm({
        ...teacherForm,
        subjects: [...teacherForm.subjects, subject],
      });
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (teacherForm.subjects.length === 0) {
      alert('Please assign at least one subject');
      return;
    }

    setLoading(true);
    try {
      const res = await createAdminTeacher(teacherForm);
      if (res.success) {
        setTeachers([res.data, ...teachers]);
        
        setSuccessMessage(`Teacher ${teacherForm.name} created successfully!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setTeacherForm({
          name: '',
          email: '',
          password: '',
          mobile: '',
          subjects: [],
        });

        setTimeout(() => setActiveSection('teachers'), 1500);
      }
    } catch (err: any) {
      alert(err.message || "Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      const updatedTeachers = teachers.filter((t) => t.id !== id);
      setTeachers(updatedTeachers);
      localStorage.setItem('gurukul_teachers', JSON.stringify(updatedTeachers));
    }
  };

  const getAllLectures = () => {
    return JSON.parse(localStorage.getItem('gurukul_lectures') || '[]');
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
                👑
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                  Admin Panel
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
            active={activeSection === 'teachers'}
            onClick={() => {
              setActiveSection('teachers');
              setSidebarOpen(false);
            }}
            icon="👨‍🏫"
          >
            All Teachers
          </NavButton>
          <NavButton
            active={activeSection === 'create-teacher'}
            onClick={() => {
              setActiveSection('create-teacher');
              setSidebarOpen(false);
            }}
            icon="➕"
          >
            Create Teacher ID
          </NavButton>
          <NavButton
            active={activeSection === 'students'}
            onClick={() => {
              setActiveSection('students');
              setSidebarOpen(false);
            }}
            icon="👥"
          >
            All Students
          </NavButton>
          <NavButton
            active={activeSection === 'lectures'}
            onClick={() => {
              setActiveSection('lectures');
              setSidebarOpen(false);
            }}
            icon="🎥"
          >
            All Lectures
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
            Admin Panel
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
          {/* Create Teacher Section */}
          {activeSection === 'create-teacher' && (
            <div className="max-w-3xl">
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Create Teacher Account
              </h2>
              <p className="text-muted-foreground mb-8">Assign subjects and create login credentials</p>

              <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
                <form className="space-y-6" onSubmit={handleCreateTeacher}>
                  {/* Teacher Name */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      Teacher Name *
                    </label>
                    <input
                      type="text"
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      required
                      placeholder="Enter teacher's full name"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📧</span>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      required
                      placeholder="teacher@gurukul.com"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">🔒</span>
                      Password *
                    </label>
                    <input
                      type="text"
                      value={teacherForm.password}
                      onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      required
                      placeholder="Create password for teacher"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📱</span>
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={teacherForm.mobile}
                      onChange={(e) => setTeacherForm({ ...teacherForm, mobile: e.target.value })}
                      required
                      placeholder="10 digit mobile number"
                      pattern="[0-9]{10}"
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Subject Assignment */}
                  <div>
                    <label className="block mb-3 font-semibold text-primary flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      Assign Subjects * <span className="text-sm text-muted-foreground font-normal">(Select at least one)</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ALL_SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => handleSubjectToggle(subject)}
                          className={`p-4 rounded-xl font-semibold text-sm transition-all border-2 ${
                            teacherForm.subjects.includes(subject)
                              ? 'bg-gradient-to-r from-accent to-indigo-600 text-white border-transparent shadow-lg'
                              : 'bg-white text-muted-foreground border-border hover:border-accent/50'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Create Teacher Account</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Teachers List Section */}
          {activeSection === 'teachers' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                    All Teachers
                  </h2>
                  <p className="text-muted-foreground">Manage teacher accounts and permissions</p>
                </div>
                <button
                  onClick={() => setActiveSection('create-teacher')}
                  className="bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <span>➕</span>
                  <span>Add Teacher</span>
                </button>
              </div>

              {teachers.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-border">
                  <div className="text-6xl mb-4">👨‍🏫</div>
                  <h3 className="font-bold text-2xl text-primary mb-2">No teachers yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first teacher account to get started</p>
                  <button
                    onClick={() => setActiveSection('create-teacher')}
                    className="bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all"
                  >
                    Create First Teacher
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="bg-white rounded-2xl shadow-lg p-6 border border-border hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-accent to-indigo-600 rounded-xl flex items-center justify-center text-2xl">
                              👨‍🏫
                            </div>
                            <div>
                              <h3 className="font-bold text-xl text-primary">{teacher.name}</h3>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>📱</span>
                              <span>{teacher.mobile}</span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>🔑</span>
                              <span>Password: {teacher.password}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary mb-2">Assigned Subjects:</p>
                            <div className="flex flex-wrap gap-2">
                              {teacher.subjects.map((subject) => (
                                <span
                                  key={subject}
                                  className="px-3 py-1 bg-gradient-to-r from-accent/10 to-indigo-600/10 text-accent border border-accent/20 rounded-full text-xs font-semibold"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="p-3 hover:bg-red-50 rounded-xl transition-all group"
                          title="Delete teacher"
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

          {/* Students Section */}
          {activeSection === 'students' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                All Students
              </h2>
              <p className="text-muted-foreground mb-8">View all registered students</p>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary to-[#0d3352] text-white">
                        <th className="px-6 py-4 text-left font-semibold">Name</th>
                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                        <th className="px-6 py-4 text-left font-semibold">Mobile</th>
                        <th className="px-6 py-4 text-left font-semibold">Batch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student: any, i: number) => (
                        <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-primary">{student.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                          <td className="px-6 py-4 text-muted-foreground">{student.mobile}</td>
                          <td className="px-6 py-4 text-muted-foreground">{student.batch || 'Not assigned'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Lectures Section */}
          {activeSection === 'lectures' && (
            <div>
              <h2 className="font-bold text-3xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                All Lectures
              </h2>
              <p className="text-muted-foreground mb-8">View all uploaded lectures by teachers</p>

              <div className="grid grid-cols-1 gap-4">
                {getAllLectures().map((lecture: any) => (
                  <div
                    key={lecture.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-border"
                  >
                    <h3 className="font-bold text-xl text-primary mb-2">{lecture.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                        {lecture.subject}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {lecture.batch}
                      </span>
                      <span>👨‍🏫 {lecture.uploadedBy}</span>
                      <span>📅 {new Date(lecture.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">{successMessage}</span>
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
