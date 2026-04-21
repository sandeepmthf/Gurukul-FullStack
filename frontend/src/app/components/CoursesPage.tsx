import { useState, useEffect, useRef } from 'react';

interface CoursesPageProps {
  onNavigate: (page: string) => void;
}

const courses = [
  {
    id: 1,
    name: 'Class 6-8 (All Subjects)',
    category: 'school',
    fee: '₹2,000',
    period: 'month',
    duration: '1 Year',
    icon: '📖',
    color: 'from-[#6b5940] to-[#8A7650]',
    bgPattern: 'from-[#6b5940]/10 to-[#8A7650]/5',
    features: ['Math, Science, English', 'Practice Tests', 'Doubt Sessions']
  },
  {
    id: 2,
    name: 'Class 9-10 (All Subjects)',
    category: 'school',
    fee: '₹3,000',
    period: 'month',
    duration: '1 Year',
    icon: '📖',
    color: 'from-[#6d7a5f] to-[#8E977D]',
    bgPattern: 'from-[#6d7a5f]/10 to-[#8E977D]/5',
    features: ['Board Exam Prep', 'All Subjects', 'Study Material']
  },
  {
    id: 3,
    name: 'Class 11-12 (PCM)',
    category: 'school',
    fee: '₹4,000',
    period: 'month',
    duration: '2 Years',
    icon: '📐',
    color: 'from-[#8A7650] to-[#6b5940]',
    bgPattern: 'from-[#8A7650]/10 to-[#6b5940]/5',
    features: ['Physics, Chemistry, Math', 'Board + JEE Foundation', 'Weekly Tests']
  },
  {
    id: 4,
    name: 'IIT JEE Mains + Advanced',
    category: 'jee',
    fee: '₹5,000',
    period: 'month',
    duration: '2 Years',
    icon: '🎓',
    color: 'from-[#6b5940] to-[#5a4d3a]',
    bgPattern: 'from-[#6b5940]/10 to-[#5a4d3a]/5',
    features: ['Complete JEE Syllabus', 'Mock Tests', 'Expert Faculty']
  },
  {
    id: 5,
    name: 'NEET Preparation',
    category: 'neet',
    fee: '₹5,000',
    period: 'month',
    duration: '2 Years',
    icon: '⚕️',
    color: 'from-[#6d7a5f] to-[#5a6b4d]',
    bgPattern: 'from-[#6d7a5f]/10 to-[#5a6b4d]/5',
    features: ['Biology, Physics, Chemistry', 'NEET Mock Tests', 'Previous Year Papers']
  },
  {
    id: 6,
    name: 'SSC CGL / CHSL',
    category: 'ssc',
    fee: '₹2,500',
    period: 'month',
    duration: '6 Months',
    icon: '📄',
    color: 'from-[#DBCEA5] to-[#c4b890]',
    bgPattern: 'from-[#DBCEA5]/10 to-[#c4b890]/5',
    features: ['Quantitative Aptitude', 'Reasoning', 'General Awareness']
  },
  {
    id: 7,
    name: 'Police Constable',
    category: 'police',
    fee: '₹2,000',
    period: 'month',
    duration: '4 Months',
    icon: '👮',
    color: 'from-[#8A7650] to-[#7a6848]',
    bgPattern: 'from-[#8A7650]/10 to-[#7a6848]/5',
    features: ['Written Exam Prep', 'Physical Training', 'Interview Guidance']
  }
];

export default function CoursesPage({ onNavigate }: CoursesPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Intersection Observer for scroll animations
      cardRefs.current.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8;
          
          if (isVisible && !visibleCards.includes(index)) {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 100);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCards]);

  const handleEnroll = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onNavigate('register');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden"
         style={{ fontFamily: 'var(--font-family-sans)' }}>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" 
             style={{ animation: 'float 15s ease-in-out infinite, morph 20s ease-in-out infinite' }} />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" 
             style={{ animation: 'float 20s ease-in-out infinite 5s, morph 25s ease-in-out infinite 3s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl" 
             style={{ animation: 'float 18s ease-in-out infinite 2s, morph 22s ease-in-out infinite 7s' }} />
      </div>

      {/* Parallax Header */}
      <div className="bg-gradient-to-br from-primary via-[#5a4d3a] to-secondary text-white px-4 py-24 text-center relative overflow-hidden"
           style={{ 
             transform: `translateY(${scrollY * 0.3}px)`,
             backgroundSize: '200% 200%',
             animation: 'gradient-shift 15s ease infinite'
           }}>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.05) 2px, transparent 2px)',
          backgroundSize: '60px 60px',
          animation: 'slide-in-right 30s linear infinite'
        }} />

        {/* Floating Shapes */}
        <div className="absolute top-10 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" 
             style={{ animation: 'float 8s ease-in-out infinite, scale-pulse 6s ease-in-out infinite' }} />
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" 
             style={{ animation: 'float 10s ease-in-out infinite 2s, scale-pulse 8s ease-in-out infinite 1s' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 mb-6"
               style={{ animation: 'fade-in-up-scroll 0.8s ease-out' }}>
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm font-semibold">Premium Coaching Programs</span>
          </div>

          <h1 className="font-black mb-4" 
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-family-display)',
                animation: 'fade-in-up-scroll 0.8s ease-out 0.2s backwards',
                background: 'linear-gradient(135deg, #ffffff 0%, #ECE7D1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Our Courses & Programs
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
             style={{ animation: 'fade-in-up-scroll 0.8s ease-out 0.4s backwards' }}>
            Choose from our comprehensive range of courses designed for students from Class 6 to competitive exams
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-4 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border overflow-hidden relative"
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards` }}
              ref={el => cardRefs.current[index] = el}
            >
              {/* Gradient Background Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{course.icon}</div>

                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-primary mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
                      {course.name}
                    </h3>

                    {/* Price Tag */}
                    <div className={`inline-flex items-baseline gap-1 bg-gradient-to-r ${course.color} px-4 py-2 rounded-full`}>
                      <span className="text-2xl font-bold text-white">{course.fee}</span>
                      <span className="text-sm text-white/90">/{course.period}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {course.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Duration: {course.duration}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleEnroll}
                  className={`w-full bg-gradient-to-r ${course.color} hover:shadow-xl text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg`}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" style={{ animation: 'scaleIn 0.4s ease-out' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
              Great Choice!
            </h2>
            <p className="text-muted-foreground">
              Redirecting to Registration...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}