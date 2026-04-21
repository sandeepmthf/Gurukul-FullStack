import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../imports/Screenshot_2026-04-16_at_1.54.58_PM-removebg-preview.png';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrolled(scrollTop > 20);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-[100] transition-all duration-300"
        style={{ 
          width: `${scrollProgress}%`,
          boxShadow: '0 0 10px rgba(107, 89, 64, 0.5)'
        }}
      />

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${ 
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-2xl border-b border-border/50'
            : 'bg-white'
        }`}
        style={{ fontFamily: 'var(--font-family-display)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Animation */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group relative"
            >
              <div className="relative w-14 h-14 flex items-center justify-center">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ animation: 'glow-pulse 3s ease-in-out infinite' }} />
                <img
                  src={logo}
                  alt="Gurukul Logo"
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg] relative z-10"
                />
              </div>
              <div className="text-left">
                <div className="font-black text-lg leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                  GURUKUL
                </div>
                <div className="text-[10px] text-secondary font-semibold tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
                  THE INSTITUTE
                </div>
              </div>
            </button>

            {/* Desktop Navigation with Animations */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                onClick={() => onNavigate('home')}
                active={currentPage === 'home'}
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => onNavigate('about')}
                active={currentPage === 'about'}
              >
                About
              </NavLink>
              <NavLink
                onClick={() => onNavigate('courses')}
                active={currentPage === 'courses'}
              >
                Courses
              </NavLink>
              <NavLink
                onClick={() => onNavigate('dashboard')}
                active={currentPage === 'dashboard'}
              >
                Student Panel
              </NavLink>
              
              {!isAuthenticated ? (
                <>
                  <NavLink
                    onClick={() => onNavigate('login')}
                    active={currentPage === 'login'}
                  >
                    Login
                  </NavLink>
                  <button
                    onClick={() => onNavigate('register')}
                    className="ml-2 relative bg-gradient-to-r from-[#6b5940] to-[#6d7a5f] hover:from-[#6b5940]/90 hover:to-[#6d7a5f]/90 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden group"
                    style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">Register Now</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { logout(); onNavigate('login'); }}
                  className="ml-2 relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 overflow-hidden group"
                >
                  <span className="relative z-10">Logout</span>
                </button>
              )}
            </nav>

            {/* Mobile Menu Button with Animation */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-all duration-300 relative group"
              aria-label="Menu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg
                className={`w-6 h-6 text-primary transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu with Slide Animation */}
          {menuOpen && (
            <nav
              className="md:hidden mt-4 pb-2 space-y-2 border-t border-border pt-4"
              style={{ animation: 'slide-up 0.4s ease-out' }}
            >
              <MobileNavButton
                onClick={() => { onNavigate('home'); setMenuOpen(false); }}
                active={currentPage === 'home'}
              >
                Home
              </MobileNavButton>
              <MobileNavButton
                onClick={() => { onNavigate('about'); setMenuOpen(false); }}
                active={currentPage === 'about'}
              >
                About
              </MobileNavButton>
              <MobileNavButton
                onClick={() => { onNavigate('courses'); setMenuOpen(false); }}
                active={currentPage === 'courses'}
              >
                Courses
              </MobileNavButton>
              <MobileNavButton
                onClick={() => { onNavigate('dashboard'); setMenuOpen(false); }}
                active={currentPage === 'dashboard'}
              >
                Student Panel
              </MobileNavButton>
              
              {!isAuthenticated ? (
                <>
                  <MobileNavButton
                    onClick={() => { onNavigate('login'); setMenuOpen(false); }}
                    active={currentPage === 'login'}
                  >
                    Login
                  </MobileNavButton>
                  <button
                    onClick={() => { onNavigate('register'); setMenuOpen(false); }}
                    className="w-full bg-gradient-to-r from-[#6b5940] to-[#6d7a5f] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">Register Now</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { logout(); onNavigate('login'); setMenuOpen(false); }}
                  className="w-full mt-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                >
                  <span className="relative z-10">Logout</span>
                </button>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

function NavLink({
  onClick,
  children,
  active
}: {
  onClick: () => void;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 relative group overflow-hidden ${
        active
          ? 'text-white'
          : 'text-muted-foreground hover:text-primary'
      }`}
    >
      {/* Active background with animation */}
      {active && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl"
          style={{ animation: 'gradient-shift 10s ease infinite' }}
        />
      )}
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-muted/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function MobileNavButton({
  onClick,
  children,
  active
}: {
  onClick: () => void;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
        active
          ? 'text-white shadow-lg'
          : 'bg-muted text-foreground hover:bg-muted/70'
      }`}
    >
      {active && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"
          style={{ 
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 8s ease infinite'
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
