import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import CoursesPage from './components/CoursesPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import OTPRegistration from './components/OTPRegistration';
import OTPVerification from './components/OTPVerification';
import OTPLogin from './components/OTPLogin';
import SuccessScreen from './components/SuccessScreen';
import StudentDashboard from './components/StudentDashboard';
import TeacherAdminPanel from './components/TeacherAdminPanel';
import AdminMasterPanel from './components/AdminMasterPanel';
import Chatbot from './components/Chatbot';

type Page = 'home' | 'about' | 'courses' | 'register' | 'login' | 'forgot-password' | 'otp-register' | 'otp-verify' | 'otp-login' | 'success' | 'dashboard' | 'admin';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [successType, setSuccessType] = useState<'registration' | 'login'>('registration');

  // Protect protected routes
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentPage === 'dashboard' || currentPage === 'admin') {
        setCurrentPage('login');
      }
    }
  }, [isAuthenticated, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToVerification = (data: any) => {
    setRegistrationData(data);
    setCurrentPage('otp-verify');
  };

  const handleRegistrationSuccess = () => {
    setSuccessType('registration');
    setCurrentPage('success');
  };

  const handleLoginSuccess = () => {
    setSuccessType('login');
    setCurrentPage('success');
  };

  const handleSuccessContinue = () => {
    if (isAuthenticated && user) {
      if (user.role === 'teacher' || user.role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('dashboard');
      }
    }
  };

  const showHeaderFooter = currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'forgot-password' && currentPage !== 'register' && currentPage !== 'otp-register' && currentPage !== 'otp-verify' && currentPage !== 'otp-login' && currentPage !== 'success';

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {showHeaderFooter && <Header onNavigate={handleNavigate} currentPage={currentPage} />}

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
      {currentPage === 'courses' && <CoursesPage onNavigate={handleNavigate} />}
      {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={handleNavigate} />}
      {currentPage === 'otp-register' && <OTPRegistration onNavigate={handleNavigate} onProceedToVerification={handleProceedToVerification} />}
      {currentPage === 'otp-verify' && registrationData && <OTPVerification onNavigate={handleNavigate} registrationData={registrationData} onSuccess={handleRegistrationSuccess} />}
      {currentPage === 'otp-login' && <OTPLogin onNavigate={handleNavigate} onSuccess={handleLoginSuccess} />}
      {currentPage === 'success' && <SuccessScreen type={successType} onContinue={handleSuccessContinue} />}
      {currentPage === 'dashboard' && isAuthenticated && <StudentDashboard onNavigate={handleNavigate} />}
      {currentPage === 'admin' && isAuthenticated && user?.role === 'admin' && <AdminMasterPanel onNavigate={handleNavigate} />}
      {currentPage === 'admin' && isAuthenticated && user?.role === 'teacher' && <TeacherAdminPanel onNavigate={handleNavigate} />}

      {showHeaderFooter && <Footer />}

      {/* Chatbot - Only show on main pages */}
      {(currentPage === 'home' || currentPage === 'about' || currentPage === 'courses') && (
        <Chatbot onNavigate={handleNavigate} />
      )}

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919818034565" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-20 right-4 md:right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center cursor-pointer group"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <div className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-xl opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-gray-100 after:content-[''] after:absolute after:top-1/2 after:-right-2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-white">
          Chat with us!
        </div>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
