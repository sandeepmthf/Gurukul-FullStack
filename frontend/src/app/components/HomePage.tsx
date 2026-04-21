import logo from '../../imports/image.png';
import { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#8A7650] via-[#7a6848] to-[#8A7650]" style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 15s ease infinite' }}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8E977D] rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite, scale-pulse 10s ease-in-out infinite' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#DBCEA5] rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite 2s, scale-pulse 12s ease-in-out infinite 1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8E977D] rounded-full blur-3xl" style={{ animation: 'float 7s ease-in-out infinite 1s, scale-pulse 9s ease-in-out infinite 2s' }} />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8" style={{ animation: 'slide-in-left 1s ease-out' }}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20" style={{ animation: 'fadeIn 1s ease-out 0.5s backwards' }}>
                <span className="w-2 h-2 bg-secondary rounded-full" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                <span className="text-sm font-medium">Trusted by 500+ Students</span>
              </div>

              <div style={{ fontFamily: 'var(--font-family-display)' }}>
                <h1 className="font-black text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s backwards' }}>
                  <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                    Transform Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#ECE7D1] via-[#DBCEA5] to-[#ECE7D1] bg-clip-text text-transparent inline-block" style={{ animation: 'fadeInUp 0.8s ease-out 0.4s backwards, scale-pulse 3s ease-in-out infinite 1s' }}>
                    Future Today
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 font-medium mb-2" style={{ animation: 'fadeInUp 0.8s ease-out 0.6s backwards' }}>
                  Best Coaching Institute in Saidpur
                </p>
                <p className="text-lg text-white/60" style={{ animation: 'fadeInUp 0.8s ease-out 0.7s backwards' }}>
                  Excellence in Education • Expert Faculty • Proven Results
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4" style={{ animation: 'fadeInUp 0.8s ease-out 0.8s backwards' }}>
                <button
                  onClick={() => onNavigate('register')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#8E977D] via-[#9ca88a] to-[#8E977D] bg-[length:200%_100%] hover:bg-right text-white font-bold rounded-full shadow-2xl shadow-[#8E977D]/30 transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:shadow-[#8E977D]/50 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: 'shimmer 3s infinite' }} />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>Start Your Journey</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border-2 border-white/30 transition-all duration-300 hover:scale-105 hover:border-white/50"
                >
                  Explore Courses
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8" style={{ animation: 'fadeInUp 0.8s ease-out 1s backwards' }}>
                <StatCard number="500+" label="Students" delay="1.1s" />
                <StatCard number="15+" label="Courses" delay="1.2s" />
                <StatCard number="100%" label="Results" delay="1.3s" />
              </div>
            </div>

            {/* Right Side - Logo & Visual */}
            <div className="relative lg:block" style={{ animation: 'slide-in-right 1s ease-out 0.3s backwards' }}>
              <div className="relative">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite, rotate-slow 30s linear infinite' }} />

                {/* Logo Container with Hover Effect */}
                <div 
                  className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-12 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-white/30 cursor-pointer group"
                  onMouseEnter={() => setShowStudentPopup(true)}
                  onMouseLeave={() => setShowStudentPopup(false)}
                >
                  <img
                    src={logo}
                    alt="Gurukul Logo"
                    className="w-full max-w-md mx-auto drop-shadow-2xl"
                    style={{ animation: 'float 4s ease-in-out infinite' }}
                  />

                  {/* Student Popup Animation */}
                  {showStudentPopup && (
                    <div 
                      className="absolute -bottom-32 -right-32 z-50"
                      style={{ animation: 'slide-in-right 0.5s ease-out' }}
                    >
                      {/* Student Image with Walking Animation */}
                      <div className="relative">
                        <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl" style={{ animation: 'bounce-slow 2s ease-in-out infinite' }}>
                          <img
                            src="https://images.unsplash.com/photo-1764662366894-fd7fa31f5d36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzdHVkZW50JTIwd2Fsa2luZyUyMHNjaG9vbCUyMGJhZ3xlbnwxfHx8fDE3NzYzMjg1NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Student"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Animated Arrow pointing to Gurukul */}
                        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ animation: 'slide-in-left 1s ease-out infinite' }}>
                          <svg className="w-16 h-16 text-white drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white text-sm font-bold drop-shadow-lg mt-2 bg-[#8E977D] px-3 py-1 rounded-full">Gurukul</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60" style={{ animation: 'fadeIn 1s ease-out 1.5s backwards' }}>
          <span className="text-sm">Scroll to explore</span>
          <svg className="w-6 h-6" style={{ animation: 'bounce-slow 2s ease-in-out infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white py-8 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FeatureBadge icon="👨‍🏫" text="Expert Teachers" />
            <FeatureBadge icon="💰" text="Affordable Fees" />
            <FeatureBadge icon="📱" text="Hybrid Learning" />
            <FeatureBadge icon="⚡" text="Fast Track" />
          </div>
        </div>
      </section>

      {/* Courses Section - Enhanced */}
      <section className="px-4 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="text-center mb-16" style={{ fontFamily: 'var(--font-family-display)' }}>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold mb-4">
            <span>🎓</span>
            <span>Popular Courses</span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl text-primary mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert-led courses designed to help you achieve your academic and career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernCourseCard
            icon="📖"
            title="School"
            subtitle="6-12"
            description="All Subjects"
            color="from-blue-500 to-cyan-500"
            onClick={() => onNavigate('courses')}
            delay="0s"
          />
          <ModernCourseCard
            icon="🎓"
            title="IIT JEE"
            subtitle="Engineering"
            description="Mains & Advanced"
            color="from-purple-500 to-pink-500"
            onClick={() => onNavigate('courses')}
            delay="0.1s"
          />
          <ModernCourseCard
            icon="⚕️"
            title="NEET"
            subtitle="Medical"
            description="Complete Prep"
            color="from-emerald-500 to-teal-500"
            onClick={() => onNavigate('courses')}
            delay="0.2s"
          />
          <ModernCourseCard
            icon="👮"
            title="SSC/Police"
            subtitle="Govt Jobs"
            description="Complete Guide"
            color="from-orange-500 to-red-500"
            onClick={() => onNavigate('courses')}
            delay="0.3s"
          />
        </div>
      </section>

      {/* Why Choose Us - Redesigned */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16" style={{ fontFamily: 'var(--font-family-display)' }}>
            <h2 className="font-bold text-4xl md:text-5xl text-primary mb-4">
              Why Students Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of successful students who transformed their future with Gurukul
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedFeatureCard
              icon="👨‍🏫"
              title="Expert Teachers"
              subtitle="10+ years experience"
              color="from-blue-500 to-cyan-500"
              delay="0s"
            />
            <EnhancedFeatureCard
              icon="💰"
              title="Affordable Fees"
              subtitle="Starting ₹2,000/month"
              color="from-emerald-500 to-teal-500"
              delay="0.1s"
            />
            <EnhancedFeatureCard
              icon="📱"
              title="Hybrid Learning"
              subtitle="Online + Offline"
              color="from-purple-500 to-pink-500"
              delay="0.2s"
            />
            <EnhancedFeatureCard
              icon="🏆"
              title="100% Results"
              subtitle="Proven track record"
              color="from-orange-500 to-red-500"
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#8A7650] to-[#7a6848] rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[#8E977D] rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#DBCEA5] rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="text-6xl mb-6">⭐⭐⭐⭐⭐</div>
            <p className="text-2xl md:text-3xl font-bold mb-4 italic" style={{ fontFamily: 'var(--font-family-display)' }}>
              "Best coaching institute in the area. The teachers are very supportive and the study material is excellent!"
            </p>
            <p className="text-lg text-white/80">- Successful Student, Class 12</p>
          </div>
        </div>
      </section>

      {/* Motivational Section */}
      <section className="relative px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-secondary/10 to-secondary/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        <div className="max-w-4xl mx-auto text-center relative z-10" style={{ fontFamily: 'var(--font-family-display)' }}>
          <p className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            ज्ञान परमं बलम्
          </p>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
            Knowledge is Supreme Power
          </p>
        </div>
      </section>

      {/* Contact Form - Enhanced */}
      <section className="px-4 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-primary mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
            Ready to Start?
          </h2>
          <p className="text-lg text-muted-foreground">Get in touch with us and begin your journey to success</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-border">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <FormInput label="Name" placeholder="Your name" type="text" icon="👤" />
              <FormInput label="Mobile Number" placeholder="10 digit number" type="tel" icon="📱" />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span>Course</span>
              </label>
              <select className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-base">
                <option>Select a course</option>
                <option>School (6-12)</option>
                <option>IIT JEE</option>
                <option>NEET</option>
                <option>SSC / Police</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Submit Enquiry</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label, delay }: { number: string; label: string; delay: string }) {
  return (
    <div className="text-center" style={{ animation: `fadeInUp 0.8s ease-out ${delay} backwards` }}>
      <div className="font-bold text-3xl md:text-4xl mb-1 text-secondary" style={{ fontFamily: 'var(--font-family-display)' }}>{number}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-primary">{text}</span>
    </div>
  );
}

function ModernCourseCard({ icon, title, subtitle, description, color, onClick, delay }: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  onClick: () => void;
  delay: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-border overflow-hidden"
      style={{ animation: `fadeInUp 0.6s ease-out ${delay} backwards` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10 text-left">
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="font-bold text-xl text-primary mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>{title}</h3>
        <p className="text-sm text-muted-foreground font-semibold mb-1">{subtitle}</p>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
        <div className={`inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          <span>Learn More</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </button>
  );
}

function EnhancedFeatureCard({ icon, title, subtitle, color, delay }: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  delay: string;
}) {
  return (
    <div
      className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border overflow-hidden"
      style={{ animation: `fadeInUp 0.6s ease-out ${delay} backwards` }}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
          {icon}
        </div>
        <h3 className="font-bold text-xl text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, type, icon }: { label: string; placeholder: string; type: string; icon: string }) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-base"
      />
    </div>
  );
}