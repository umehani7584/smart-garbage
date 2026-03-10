import React, { useState, useEffect } from 'react';
import LoginCard from '../components/LoginCard';
import SignupCard from '../components/SignupCard';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // CLEAN GARBAGE BIN IMAGES - All working!
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920",
      title: "Smart Bin Monitoring",
      description: "Never let bins overflow with real-time fill-level tracking"
    },
    {
     image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920",
      title: "Automated Waste Collection",
      description: "Efficient garbage collection with IoT sensors"
    },
    {
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1920",
      title: "Clean & Green Cities",
      description: "Making urban areas cleaner with smart technology"
    },
    {
      image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=1920",
      title: "IoT Enabled Bins",
      description: "Sensors monitor fill level, weight, temperature and gases"
    },
    {
      image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=1920",
      title: "Sustainable Waste Management",
      description: "Real-time data for efficient collection routes"
    }
  ];

  // Fixed useEffect with proper cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Handle events from navbar
  useEffect(() => {
    const handleOpenLogin = () => setShowLogin(true);
    const handleOpenSignup = () => setShowSignup(true);
    
    window.addEventListener('openLogin', handleOpenLogin);
    window.addEventListener('openSignup', handleOpenSignup);
    
    return () => {
      window.removeEventListener('openLogin', handleOpenLogin);
      window.removeEventListener('openSignup', handleOpenSignup);
    };
  }, []);

  // Handler for login button click
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // Handler for switching between cards
  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <div>
      {/* Hero Slider */}
      <section style={styles.hero}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              opacity: index === currentSlide ? 1 : 0,
              backgroundImage: `linear-gradient(135deg, rgba(0,40,30,0.8) 0%, rgba(0,70,50,0.7) 100%), url(${slide.image})`
            }}
          >
            <div style={styles.slideContent}>
              <h1 style={styles.slideTitle}>{slide.title}</h1>
              <p style={styles.slideDescription}>{slide.description}</p>
              <button 
                onClick={handleLoginClick}
                style={styles.learnMoreBtn}
              >
                View Dashboard <span style={styles.arrow}>→</span>
              </button>
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div style={styles.sliderDots}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                ...styles.dot,
                backgroundColor: index === currentSlide ? '#00b4d8' : 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Smart Features for Smart Cities</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: "📊", title: "Fill-Level Monitoring", desc: "Know exactly when bins need emptying", color: "#00b4d8" },
            { icon: "⚖️", title: "Weight Detection", desc: "Measure waste weight in real-time", color: "#0077b6" },
            { icon: "🌡️", title: "Temperature Sensing", desc: "Prevent fire hazards with heat detection", color: "#00b4d8" },
            { icon: "💨", title: "Gas Detection", desc: "Alert for harmful methane emissions", color: "#0077b6" },
            { icon: "🔔", title: "Instant Alerts", desc: "Get notified when bins are full", color: "#00b4d8" },
            { icon: "📡", title: "Live Monitoring", desc: "Real-time data from anywhere", color: "#0077b6" }
          ].map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={{...styles.featureIcon, backgroundColor: `${feature.color}20`, color: feature.color}}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          {[
            {
              step: "01",
              title: "Sensor Installation",
              desc: "IoT sensors (Ultrasonic, Load Cell, DHT11, MQ-135) are installed in each garbage bin",
              icon: "🔧"
            },
            {
              step: "02",
              title: "Data Collection",
              desc: "ESP32 microcontroller collects real-time data: fill level, weight, temperature, gas levels",
              icon: "📡"
            },
            {
              step: "03",
              title: "Cloud Processing",
              desc: "Data is sent via WiFi to Flask server and stored in MySQL database",
              icon: "☁️"
            },
            {
              step: "04",
              title: "Smart Alerts",
              desc: "Authorities get instant alerts when bins are full or hazardous gases detected",
              icon: "🔔"
            }
          ].map((item, index) => (
            <div key={index} style={styles.stepCard}>
              <div style={styles.stepNumber}>{item.step}</div>
              <div style={styles.stepIcon}>{item.icon}</div>
              <h3 style={styles.stepTitle}>{item.title}</h3>
              <p style={styles.stepDesc}>{item.desc}</p>
              {index < 3 && <div style={styles.stepLine}>→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits/Impact Section */}
      <section style={styles.benefits}>
        <h2 style={styles.sectionTitle}>Environmental & Economic Impact</h2>
        <div style={styles.benefitsGrid}>
          {[
            { 
              icon: "⛽", 
              stat: "40%", 
              title: "Fuel Reduction", 
              desc: "Optimized collection routes reduce fuel consumption by 40%",
              color: "#00b4d8"
            },
            { 
              icon: "🗑️", 
              stat: "95%", 
              title: "Overflow Prevention", 
              desc: "Real-time monitoring prevents bin overflow 95% of the time",
              color: "#0077b6"
            },
            { 
              icon: "🌍", 
              stat: "30%", 
              title: "Carbon Footprint", 
              desc: "Decrease in CO2 emissions through efficient collection",
              color: "#00b4d8"
            },
            { 
              icon: "⏱️", 
              stat: "50%", 
              title: "Time Efficiency", 
              desc: "Collection time reduced by half with smart scheduling",
              color: "#0077b6"
            },
            { 
              icon: "💰", 
              stat: "35%", 
              title: "Cost Savings", 
              desc: "Reduced operational costs for municipalities",
              color: "#00b4d8"
            },
            { 
              icon: "🏥", 
              stat: "60%", 
              title: "Health Benefits", 
              desc: "Decrease in waste-related health issues",
              color: "#0077b6"
            }
          ].map((item, index) => (
            <div key={index} style={styles.benefitCard}>
              <div style={{...styles.benefitIcon, backgroundColor: `${item.color}15`, color: item.color}}>
                {item.icon}
              </div>
              <h3 style={styles.benefitStat}>{item.stat}</h3>
              <h4 style={styles.benefitTitle}>{item.title}</h4>
              <p style={styles.benefitDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statsGrid}>
          {[
            { number: "10K+", label: "Bins Connected", icon: "🗑️" },
            { number: "50+", label: "Cities", icon: "🏙️" },
            { number: "98%", label: "Efficiency", icon: "📈" },
            { number: "24/7", label: "Monitoring", icon: "⏰" }
          ].map((stat, index) => (
            <div key={index} style={styles.statItem}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <h3 style={styles.statNumber}>{stat.number}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Modernize Your Waste Management?</h2>
          <p style={styles.ctaText}>Join 50+ municipalities already using our smart solution</p>
          <button style={styles.ctaBtn}>
            Request Demo <span style={styles.arrow}>→</span>
          </button>
        </div>
      </section>

      {/* Login Card */}
      {showLogin && (
        <LoginCard 
          onClose={() => setShowLogin(false)} 
          onSwitchToSignup={switchToSignup}
        />
      )}
      
      {/* Signup Card */}
      {showSignup && (
        <SignupCard 
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
}

// Styles for Home component
const styles = {
  hero: {
    marginTop: '90px',
    height: '90vh',
    position: 'relative',
    overflow: 'hidden'
  },
  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slideContent: {
    textAlign: 'center',
    color: '#ffffff',
    maxWidth: '900px',
    padding: '0 2rem'
  },
  slideTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    marginBottom: '1rem',
    animation: 'fadeInUp 1s',
    fontWeight: 700
  },
  slideDescription: {
    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
    marginBottom: '2rem',
    animation: 'fadeInUp 1s 0.3s both',
    opacity: 0.95
  },
  learnMoreBtn: {
    padding: '1rem 2.5rem',
    background: '#00b4d8',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    animation: 'fadeInUp 1s 0.6s both',
    transition: 'all 0.3s',
    fontWeight: 600
  },
  arrow: {
    transition: 'transform 0.3s',
    fontSize: '1.2rem'
  },
  sliderDots: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '1rem',
    zIndex: 10
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid white',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  features: {
    padding: '6rem 2rem',
    background: '#f8f9fa'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    color: '#023047',
    marginBottom: '3rem',
    fontWeight: 700
  },
  featuresGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'all 0.3s',
    border: '1px solid rgba(0,180,216,0.1)'
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '2.5rem'
  },
  featureTitle: {
    color: '#023047',
    marginBottom: '0.5rem',
    fontSize: '1.3rem'
  },
  featureDesc: {
    color: '#666',
    lineHeight: 1.6
  },
  howItWorks: {
    padding: '6rem 2rem',
    background: '#ffffff'
  },
  stepsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    flexWrap: 'wrap',
    gap: '2rem'
  },
  stepCard: {
    flex: '1',
    minWidth: '250px',
    background: '#f8f9fa',
    padding: '2.5rem 2rem',
    borderRadius: '20px',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'all 0.3s'
  },
  stepNumber: {
    position: 'absolute',
    top: '-15px',
    left: '20px',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'rgba(0,180,216,0.2)'
  },
  stepIcon: {
    fontSize: '3.5rem',
    marginBottom: '1.5rem'
  },
  stepTitle: {
    fontSize: '1.3rem',
    color: '#023047',
    marginBottom: '1rem',
    fontWeight: 600
  },
  stepDesc: {
    color: '#666',
    lineHeight: 1.6
  },
  stepLine: {
    position: 'absolute',
    top: '50%',
    right: '-30px',
    fontSize: '2rem',
    color: '#00b4d8',
    transform: 'translateY(-50%)',
    fontWeight: 'bold'
  },
  benefits: {
    padding: '6rem 2rem',
    background: '#f8f9fa'
  },
  benefitsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  benefitCard: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'all 0.3s',
    border: '1px solid rgba(0,180,216,0.1)'
  },
  benefitIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    fontSize: '2rem'
  },
  benefitStat: {
    fontSize: '2.5rem',
    color: '#00b4d8',
    marginBottom: '0.5rem',
    fontWeight: 700
  },
  benefitTitle: {
    fontSize: '1.2rem',
    color: '#023047',
    marginBottom: '0.5rem'
  },
  benefitDesc: {
    color: '#666',
    lineHeight: 1.5,
    fontSize: '0.95rem'
  },
  stats: {
    background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)',
    padding: '5rem 2rem'
  },
  statsGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    textAlign: 'center'
  },
  statItem: {
    color: '#ffffff'
  },
  statIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  },
  statNumber: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    fontWeight: 700
  },
  statLabel: {
    fontSize: '1.2rem',
    opacity: 0.9
  },
  cta: {
    padding: '6rem 2rem',
    background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)',
    textAlign: 'center'
  },
  ctaContent: {
    maxWidth: '700px',
    margin: '0 auto'
  },
  ctaTitle: {
    color: '#ffffff',
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    marginBottom: '1rem',
    fontWeight: 700
  },
  ctaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1.2rem',
    marginBottom: '2rem'
  },
  ctaBtn: {
    padding: '1.2rem 3rem',
    background: '#ffffff',
    color: '#00b4d8',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.2rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .learn-more-btn:hover,
  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,116,182,0.3);
  }
  
  .learn-more-btn:hover .arrow,
  .cta-btn:hover .arrow {
    transform: translateX(5px);
  }
  
  .feature-card:hover,
  .step-card:hover,
  .benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,180,216,0.15);
  }
  
  @media (max-width: 768px) {
    .step-line {
      display: none;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;