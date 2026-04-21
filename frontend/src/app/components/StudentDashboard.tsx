import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStudentProfile, getStudentBatches, getBatchContent, enrollInCourse } from '../../services/api';
import logo from '../../imports/Screenshot_2026-04-16_at_1.54.58_PM-removebg-preview.png';

interface Batch {
  _id: string;
  name: string;
  courseId: { title: string };
  teacherId: { name: string };
  status: string;
}

interface Content {
  title: string;
  type: 'lecture' | 'notes' | 'dpp';
  fileUrl: string;
  createdAt: string;
}

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState<any>(user);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'profile'>('overview');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      onNavigate('login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [profileData, batchesData] = await Promise.all([
          getStudentProfile(user?.email),
          getStudentBatches()
        ]);
        
        if (profileData?.data) {
          setProfile(profileData.data);
        }
        setBatches(batchesData.data || batchesData || []);
      } catch (err: any) {
        // Silently fall back to auth context user data
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onNavigate, user]);

  const handleBatchClick = async (batchId: string) => {
    setSelectedBatch(batchId);
    setLoading(true);
    setContent([]);
    try {
      const contentData = await getBatchContent(batchId);
      setContent(contentData.data || contentData || []);
    } catch (err: any) {
      setError("Failed to load batch content");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  // Use profile from API if available, fall back to auth context user
  const displayName = profile?.name || user?.name || 'Student';
  const displayEmail = profile?.email || user?.email || 'Not provided';
  const displayMobile = profile?.mobile || user?.mobile || '';
  const displayBatch = profile?.batch || user?.batch || '';
  const displayRole = (profile?.role || user?.role || 'student').toUpperCase();
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // Format batch name for display
  const formatBatchName = (batch: string) => {
    if (!batch) return '';
    return batch.replace(/-/g, ' ').replace(/(\d{4})/, ' $1');
  };

  return (
    <div className="min-h-screen bg-[#ECE7D1]">
      {/* ─── Top Navigation Bar ─── */}
      <nav className="bg-white border-b border-[#DBCEA5] px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm p-1">
              <img src={logo} alt="Gurukul" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#8A7650] tracking-tight" style={{ fontFamily: 'var(--font-family-display)' }}>GURUKUL</div>
              <div className="text-[10px] text-[#8E977D] font-semibold tracking-widest">THE INSTITUTE</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-[#8A7650] font-medium">
              <span>👋</span>
              <span>{displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Welcome Header ─── */}
      <div className="bg-gradient-to-br from-[#6b5940] via-[#8A7650] to-[#8E977D] text-white px-4 py-10 md:py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#DBCEA5] rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30 shadow-xl" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
              {initials}
            </div>
            <div style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
              <p className="text-[#DBCEA5] font-medium mb-1 text-sm tracking-wide">Welcome back,</p>
              <h1 className="font-bold text-3xl md:text-4xl mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>{displayName}</h1>
              <p className="text-white/70 text-sm">{displayEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation ─── */}
      <div className="bg-white border-b border-[#DBCEA5] sticky top-[60px] z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'courses', label: 'My Courses', icon: '📚' },
              { key: 'profile', label: 'Profile', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-[#8A7650] text-[#8A7650]'
                    : 'border-transparent text-[#8A7650]/50 hover:text-[#8A7650]/80 hover:border-[#DBCEA5]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content Area ─── */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Status', value: '✅ Active', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                { label: 'Role', value: displayRole, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                { label: 'Batch', value: displayBatch ? formatBatchName(displayBatch) : 'Not Assigned', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                { label: 'Courses', value: `${batches.length} Enrolled`, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} ${stat.border} border rounded-2xl p-4 md:p-5`} style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s backwards` }}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className={`font-bold text-sm md:text-base ${stat.text}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Info + Google Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Summary Card */}
              <div className="bg-white rounded-2xl border border-[#DBCEA5] p-6 shadow-sm">
                <h3 className="font-bold text-lg text-[#6b5940] mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                  <span>📋</span> Your Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-[#ECE7D1]/50">
                    <div className="w-10 h-10 bg-[#8A7650]/10 rounded-lg flex items-center justify-center text-lg">👤</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#8A7650]/60 font-semibold uppercase tracking-wider">Full Name</p>
                      <p className="text-[#6b5940] font-semibold truncate">{displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-[#ECE7D1]/50">
                    <div className="w-10 h-10 bg-[#8A7650]/10 rounded-lg flex items-center justify-center text-lg">📧</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#8A7650]/60 font-semibold uppercase tracking-wider">Email Address</p>
                      <p className="text-[#6b5940] font-semibold break-all text-sm">{displayEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-[#ECE7D1]/50">
                    <div className="w-10 h-10 bg-[#8A7650]/10 rounded-lg flex items-center justify-center text-lg">📱</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#8A7650]/60 font-semibold uppercase tracking-wider">Mobile Number</p>
                      <p className="text-[#6b5940] font-semibold">{displayMobile ? `+91 ${displayMobile}` : 'Not provided'}</p>
                    </div>
                  </div>
                  {displayBatch && (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-[#ECE7D1]/50">
                      <div className="w-10 h-10 bg-[#8A7650]/10 rounded-lg flex items-center justify-center text-lg">📚</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#8A7650]/60 font-semibold uppercase tracking-wider">Enrolled Batch</p>
                        <p className="text-[#6b5940] font-bold">{formatBatchName(displayBatch)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Registration Card */}
              <div className="bg-white rounded-2xl border border-[#DBCEA5] p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#8A7650]/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 flex-shrink-0 bg-[#ECE7D1] rounded-xl flex items-center justify-center shadow-sm text-2xl">
                      📝
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#6b5940]" style={{ fontFamily: 'var(--font-family-display)' }}>
                        Complete Admission
                      </h3>
                      <p className="text-sm text-[#8A7650]/70 mt-1">
                        Contact us on WhatsApp to complete your admission process and get enrolled in your batch.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={`https://wa.me/919818034565?text=${encodeURIComponent(`Hi, I'm ${displayName} (${displayEmail}). I've registered on the website and want to complete my admission process.`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5 text-sm"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp Us
                    </a>
                    <a 
                      href="tel:+919818034565"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#6b5940] hover:to-[#8A7650] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-[#8A7650]/30 hover:-translate-y-0.5 text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#DBCEA5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4">🔔</div>
                <h4 className="font-bold text-lg mb-2 text-[#6b5940]" style={{ fontFamily: 'var(--font-family-display)' }}>Announcements</h4>
                <p className="text-sm text-[#8A7650]/70">No new announcements at this time. Stay tuned for upcoming events!</p>
              </div>
              <div className="bg-white border border-[#DBCEA5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-4">📞</div>
                <h4 className="font-bold text-lg mb-2 text-[#6b5940]" style={{ fontFamily: 'var(--font-family-display)' }}>Need Help?</h4>
                <p className="text-sm text-[#8A7650]/70">
                  Call us at <a href="tel:+919818034565" className="text-[#8A7650] font-bold hover:underline">+91 98180 34565</a> for any queries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
            {selectedBatch ? (
              <div className="bg-white border border-[#DBCEA5] rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-xl text-[#6b5940] flex items-center gap-3" style={{ fontFamily: 'var(--font-family-display)' }}>
                    <span className="text-2xl">📚</span> Course Content
                  </h4>
                  <button onClick={() => setSelectedBatch(null)} className="text-sm font-semibold text-[#8A7650] hover:text-[#6b5940] transition-colors border border-[#DBCEA5] hover:border-[#8A7650] px-4 py-2 rounded-xl flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                </div>
                
                {loading ? (
                  <div className="py-12 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-[#8A7650] border-r-transparent border-b-transparent border-l-transparent animate-spin" /></div>
                ) : content.length === 0 ? (
                  <div className="py-12 text-center text-[#8A7650]/60 bg-[#ECE7D1]/30 rounded-2xl border border-dashed border-[#DBCEA5]">
                    <span className="text-4xl block mb-3">📭</span>
                    <p className="font-semibold">No content available for this batch yet.</p>
                    <p className="text-sm mt-1">Check back soon for lectures, notes and assignments.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {content.filter(c => c.type === 'lecture').length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-bold text-[#8A7650] uppercase tracking-wider text-xs">Lectures</h5>
                        <div className="grid gap-3">
                          {content.filter(c => c.type === 'lecture').map((c, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#ECE7D1]/40 hover:bg-[#ECE7D1]/70 border border-[#DBCEA5] p-4 rounded-xl transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">▶️</span>
                                <span className="font-semibold text-[#6b5940]">{c.title}</span>
                              </div>
                              <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-[#8A7650] hover:bg-[#6b5940] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm">Watch</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.filter(c => c.type !== 'lecture').length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-bold text-[#8A7650] uppercase tracking-wider text-xs">Study Materials</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {content.filter(c => c.type !== 'lecture').map((c, i) => (
                            <a key={i} href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#ECE7D1]/40 hover:bg-[#ECE7D1]/70 border border-[#DBCEA5] p-4 rounded-xl transition-colors">
                              <span className="text-xl">{c.type === 'notes' ? '📝' : '✏️'}</span>
                              <div>
                                <div className="font-semibold text-[#6b5940] line-clamp-1">{c.title}</div>
                                <div className="text-xs text-[#8A7650]/60 uppercase font-bold tracking-wider mt-1">{c.type}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="font-bold text-xl text-[#6b5940] flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                    <span className="text-2xl">🎒</span> My Enrolled Batches
                  </h3>
                </div>

                {loading ? (
                  <div className="py-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-[#8A7650] border-r-transparent border-b-transparent border-l-transparent animate-spin" /></div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl text-sm font-semibold">{error}</div>
                ) : batches.length === 0 ? (
                  <div className="bg-white border border-[#DBCEA5] rounded-2xl p-10 text-center shadow-sm">
                    <span className="text-5xl block mb-4">📦</span>
                    <h4 className="font-bold text-xl text-[#6b5940] mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>No Active Batches</h4>
                    <p className="text-[#8A7650]/70 max-w-md mx-auto">
                      Your enrolled courses will automatically appear here once approved by the institute. Please complete your official registration form.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batches.map((batch) => (
                      <button 
                        key={batch._id} 
                        onClick={() => handleBatchClick(batch._id)}
                        className="bg-white border-2 border-[#DBCEA5] hover:border-[#8A7650]/40 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-left group hover:-translate-y-1 relative overflow-hidden"
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#8A7650] to-[#8E977D] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-[#ECE7D1] text-[#8A7650] rounded-xl flex items-center justify-center text-2xl shadow-sm">📘</div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${batch.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {batch.status || 'Active'}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg mb-1 text-[#6b5940] line-clamp-1">{batch.courseId?.title || batch.name}</h4>
                        <p className="text-sm font-semibold text-[#8A7650]/60 mb-3">By: {batch.teacherId?.name || 'Assigned Instructor'}</p>
                        <div className="flex items-center font-bold text-sm text-[#8A7650] group-hover:text-[#6b5940] transition-colors">
                          View Content <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-[#DBCEA5] shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="h-28 bg-gradient-to-r from-[#6b5940] via-[#8A7650] to-[#8E977D] relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-8 w-20 h-20 bg-white rounded-full blur-2xl" />
                </div>
              </div>
              
              {/* Avatar */}
              <div className="px-6 -mt-12 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-tr from-[#8A7650] to-[#6b5940] rounded-2xl flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-xl">
                  {initials}
                </div>
              </div>

              {/* Info */}
              <div className="px-6 pt-4 pb-6">
                <h2 className="font-bold text-2xl text-[#6b5940] mb-0.5" style={{ fontFamily: 'var(--font-family-display)' }}>{displayName}</h2>
                <p className="text-sm text-[#8A7650]/60 font-semibold">{displayRole} • Gurukul The Institute</p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-[#DBCEA5] p-6 shadow-sm">
              <h3 className="font-bold text-lg text-[#6b5940] mb-5" style={{ fontFamily: 'var(--font-family-display)' }}>Personal Information</h3>
              <div className="space-y-1">
                {[
                  { icon: '👤', label: 'Full Name', value: displayName },
                  { icon: '📧', label: 'Email Address', value: displayEmail },
                  { icon: '📱', label: 'Mobile Number', value: displayMobile ? `+91 ${displayMobile}` : 'Not provided' },
                  { icon: '📚', label: 'Batch', value: displayBatch ? formatBatchName(displayBatch) : 'Not assigned' },
                  { icon: '🎓', label: 'Role', value: displayRole },
                  { icon: '✅', label: 'Verification', value: profile?.isVerified ? 'Email Verified' : 'Pending' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-[#ECE7D1]/40 transition-colors">
                    <div className="w-10 h-10 bg-[#ECE7D1] rounded-lg flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#8A7650]/50 font-semibold uppercase tracking-wider">{item.label}</p>
                      <p className="text-[#6b5940] font-semibold break-all">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-gradient-to-r from-[#ECE7D1] to-[#DBCEA5] rounded-2xl border border-[#DBCEA5] p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white text-2xl shadow-sm">💬</div>
                <div className="flex-1">
                  <p className="font-bold text-[#6b5940]">Need to update your information?</p>
                  <p className="text-sm text-[#8A7650]/70">Contact us on WhatsApp or call us to make changes.</p>
                </div>
                <a
                  href="https://wa.me/919818034565"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm flex-shrink-0"
                >
                  Chat
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
