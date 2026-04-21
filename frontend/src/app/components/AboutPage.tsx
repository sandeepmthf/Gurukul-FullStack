import founderPhoto from '../../imports/founder-director.png';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const founderHighlights = [
  'More than 14 years of experience in education',
  'Ex - DPS Faculty',
  'Ex - G.D. Goenka Faculty',
  'Founder & Director: Er. Pushpendra Rathi (M.Sc, B.Tech, B.Ed.)',
];

const instituteStrengths = [
  'Experienced Faculty',
  'Regular Test and Doubt Sessions',
  'Advanced Study Material',
  'Girl Child and Sibling Discount',
  'Free Demo Classes',
  'Computer and English Speaking Course Available',
];

const instituteCredibility = [
  'Under the guidance of Er. Pushpendra Rathi (M.Sc, B.Tech, B.Ed.)',
  'More than 14 years of experience in education',
  'Ex - DPS Faculty',
  'Ex - G.D. Goenka Faculty',
  'Saidpur near Scholars Inter College, Modinagar (GZB)',
];

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const handleRegistration = () => {
    const formUrl = 'https://forms.gle/WJna1fJUWfNc91Sn7';
    window.open(formUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-[#0d3352] to-primary text-white">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 -left-20 w-80 h-80 bg-secondary rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-accent rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite 1.5s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-secondary font-semibold mb-3 tracking-wide">Know the vision behind Gurukul</p>
              <h1
                className="font-black text-4xl md:text-5xl leading-tight"
                style={{ fontFamily: 'var(--font-family-display)' }}
              >
                About Gurukul The Institute
              </h1>
              <p className="mt-4 text-white/85 max-w-2xl text-base md:text-lg">
                We are committed to disciplined, value-driven, and result-oriented education for every learner.
              </p>
            </div>

            <button
              onClick={() => onNavigate('courses')}
              className="bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl px-5 py-3 font-semibold transition-all"
            >
              Explore Courses →
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div
            className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-xl"
            style={{ animation: 'fadeInUp 0.65s ease-out' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👨‍🏫</span>
              <h2 className="font-bold text-2xl text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>
                Founder & Director
              </h2>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border mb-5 bg-muted/20">
              <img
                src={founderPhoto}
                alt="Founder and Director - Er. Pushpendra Rathi"
                className="w-full h-auto object-cover"
              />
            </div>

            <h3 className="font-bold text-xl text-primary mb-1">Er. Pushpendra Rathi</h3>
            <p className="text-sm text-muted-foreground mb-5">M.Sc, B.Tech, B.Ed.</p>
            <ul className="space-y-3">
              {founderHighlights.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-foreground"
                  style={{ animation: `fadeInUp 0.45s ease-out ${index * 0.1 + 0.15}s backwards` }}
                >
                  <span className="mt-1 text-emerald-600">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-xl"
            style={{ animation: 'fadeInUp 0.65s ease-out 0.15s backwards' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏫</span>
              <h2 className="font-bold text-2xl text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>
                Institute Credibility
              </h2>
            </div>

            <p className="text-muted-foreground mb-5">
              Gurukul The Institute is built to support students through structured preparation,
              consistent mentoring, and practical academic guidance.
            </p>

            <h3 className="font-semibold text-primary mb-3">Facilities & Promise</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {instituteStrengths.map((point, index) => (
                <li
                  key={point}
                  className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-primary"
                  style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.08 + 0.25}s backwards` }}
                >
                  ⭐ {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 md:p-5">
              <h4 className="font-semibold text-primary mb-3">Credibility & Leadership</h4>
              <ul className="space-y-2">
                {instituteCredibility.map((point, index) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-foreground"
                    style={{ animation: `fadeInUp 0.35s ease-out ${index * 0.07 + 0.25}s backwards` }}
                  >
                    <span className="text-accent mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-accent to-indigo-600 rounded-3xl p-8 md:p-10 text-white text-center shadow-2xl shadow-accent/25">
          <h3 className="font-bold text-3xl mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
            Learn Under Trusted Guidance
          </h3>
          <p className="text-white/90 mb-6 text-base md:text-lg">
            Join Gurukul and prepare with confidence, personal mentorship, and proven academic support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRegistration}
              className="bg-white text-primary hover:bg-white/90 font-bold px-6 py-3 rounded-xl transition-all"
            >
              Start Registration
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-white/15 hover:bg-white/25 border border-white/40 font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
