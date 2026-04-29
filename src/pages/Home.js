import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '../components/LoginCard';
import SignupCard from '../components/SignupCard';
import { ChevronRight, TrendingUp, Zap, Shield, BarChart3, Clock, Users, AlertCircle } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [hoveredSensor, setHoveredSensor] = useState(null);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920",
      title: "Smart Bin Monitoring",
      description: "Never let bins overflow with real-time fill-level tracking"
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

  const sensors = [
    { icon: "📏", name: "Ultrasonic", detail: "HC-SR04", info: "Measures bin fill level" },
    { icon: "⚖️", name: "Load Cell", detail: "HX711", info: "Detects weight changes" },
    { icon: "🌡️", name: "DHT11", detail: "Temp/Humidity", info: "Monitors temp & humidity" },
    { icon: "💨", name: "MQ-135", detail: "Gas Sensor", info: "Detects gas emissions" },
    { icon: "👁️", name: "IR Sensor", detail: "Detection", info: "Detects human presence" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

  const handleLoginClick = () => setShowLogin(true);
  const switchToLogin = () => { setShowSignup(false); setShowLogin(true); };
  const switchToSignup = () => { setShowLogin(false); setShowSignup(true); };

  const navigateToSensorInstallation = () => navigate('/sensor-installation');
  const navigateToDataCollection = () => navigate('/data-collection');
  const navigateToDatabaseProcessing = () => navigate('/database-processing');
  const navigateToSmartAlerts = () => navigate('/smart-alerts');

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
              <button onClick={handleLoginClick} style={styles.learnMoreBtn}>
                View Dashboard <ChevronRight size={18} />
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
            { icon: BarChart3, title: "Bin Monitoring", desc: "Real-time fill level tracking", color: "#00b4d8" },
            { icon: Zap, title: "Weight Detection", desc: "Measure waste weight instantly", color: "#0077b6" },
            { icon: AlertCircle, title: "Temperature Sensing", desc: "Prevent fire hazards", color: "#00b4d8" },
            { icon: Shield, title: "Gas Detection", desc: "Harmful emissions alert", color: "#0077b6" },
            { icon: TrendingUp, title: "Instant Alerts", desc: "Full bin notifications", color: "#00b4d8" },
            { icon: Clock, title: "Live Monitoring", desc: "Real-time data access", color: "#0077b6" }
          ].map((feature, index) => (
            <div key={index} className="feature-card" style={styles.featureCard}>
              <div style={{...styles.featureIconWrapper, backgroundColor: `${feature.color}15`}}>
                <feature.icon size={32} color={feature.color} />
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Flow */}
      <section style={styles.flowDiagram}>
        <h2 style={styles.sectionTitle}>System Architecture & Data Flow</h2>
        
        {/* BLUE FLOW SUMMARY LINE WITH TEXT - AT TOP */}
        <div style={styles.flowSummary}>
          Sensors → ESP32 → WiFi → Flask API → MySQL → React Dashboard
        </div>

        {/* ARROW DOWN */}
        <div style={styles.arrowContainer}>
          <div style={styles.arrowDown}>↓</div>
        </div>

        {/* HARDWARE LAYER WITH RED DOTTED BOX */}
        <div style={styles.layerWithBox}>
          <div style={styles.layer}>
            <div style={styles.layerTitle}>🔧 HARDWARE LAYER</div>
            <div style={styles.sensorsGrid}>
              {sensors.map((sensor, i) => (
                <div 
                  key={i} 
                  className="sensor-box" 
                  style={styles.sensorBox}
                  onMouseEnter={() => setHoveredSensor(i)}
                  onMouseLeave={() => setHoveredSensor(null)}
                >
                  <div style={styles.sensorIcon}>{sensor.icon}</div>
                  <div style={styles.sensorName}>{sensor.name}</div>
                  <div style={styles.sensorDetail}>{sensor.detail}</div>
                  
                  {/* TOOLTIP ON HOVER - WHITE BG BLACK TEXT */}
                  {hoveredSensor === i && (
                    <div style={styles.tooltip}>
                      {sensor.info}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div style={styles.arrowDown}>▼</div>
            
            <div className="center-box" style={styles.centerBox}>
              <div style={styles.centerIcon}>📡</div>
              <div style={styles.centerTitle}>ESP32 Microcontroller</div>
              <div style={styles.centerDetail}>Data Collection & Processing | WiFi</div>
            </div>
          </div>
        </div>

        {/* ARROW DOWN */}
        <div style={styles.arrowContainer}>
          <div style={styles.arrowDown}>↓</div>
        </div>

        {/* BACKEND LAYER WITH RED DOTTED BOX */}
        <div style={styles.layerWithBox}>
          <div style={styles.layer}>
            <div style={styles.layerTitle}>💻 BACKEND LAYER</div>
            <div style={styles.backendGrid}>
              <div className="backend-box" style={styles.backendBox}>
                <div style={styles.backendIcon}>🐍</div>
                <div style={styles.backendTitle}>Flask Server</div>
                <div style={styles.backendDetail}>Python REST API</div>
                <div style={styles.backendEndpoint}>POST /api/bins/update</div>
              </div>
              <div style={styles.arrowRight}>→</div>
              <div className="backend-box" style={styles.backendBox}>
                <div style={styles.backendIcon}>🗄️</div>
                <div style={styles.backendTitle}>MySQL Database</div>
                <div style={styles.backendDetail}>Data Storage</div>
                <div style={styles.backendEndpoint}>Users | Bins | Collections</div>
              </div>
            </div>
          </div>
        </div>

        {/* ARROW DOWN */}
        <div style={styles.arrowContainer}>
          <div style={styles.arrowDown}>↓</div>
        </div>

        {/* FRONTEND LAYER WITH RED DOTTED BOX */}
        <div style={styles.layerWithBox}>
          <div style={styles.layer}>
            <div style={styles.layerTitle}>🎨 FRONTEND LAYER</div>
            <div style={styles.frontendGrid}>
              <div className="frontend-box" style={styles.frontendBox}>
                <div style={styles.frontendIcon}>⚛️</div>
                <div style={styles.frontendTitle}>React Dashboard</div>
                <div style={styles.frontendDetail}>Real-time Monitoring</div>
              </div>
              <div className="frontend-box" style={styles.frontendBox}>
                <div style={styles.frontendIcon}>📊</div>
                <div style={styles.frontendTitle}>Live Analytics</div>
                <div style={styles.frontendDetail}>Charts & Graphs</div>
              </div>
              <div className="frontend-box" style={styles.frontendBox}>
                <div style={styles.frontendIcon}>🔔</div>
                <div style={styles.frontendTitle}>Smart Alerts</div>
                <div style={styles.frontendDetail}>Email | SMS | Dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefits}>
        <h2 style={styles.sectionTitle}>Environmental & Economic Impact</h2>
        <div style={styles.benefitsGrid}>
          {[
            { icon: "⛽", stat: "40%", title: "Fuel Reduction", desc: "Optimized routes", color: "#00b4d8" },
            { icon: "🗑️", stat: "95%", title: "Overflow Prevention", desc: "Real-time monitoring", color: "#0077b6" },
            { icon: "🌍", stat: "30%", title: "Carbon Footprint", desc: "CO2 reduction", color: "#00b4d8" },
            { icon: "⏱️", stat: "50%", title: "Time Efficiency", desc: "Smart scheduling", color: "#0077b6" },
            { icon: "💰", stat: "35%", title: "Cost Savings", desc: "Reduced operational costs", color: "#00b4d8" },
            { icon: "🏥", stat: "60%", title: "Health Benefits", desc: "Waste-related issues", color: "#0077b6" }
          ].map((item, index) => (
            <div key={index} className="benefit-card" style={styles.benefitCard}>
              <div style={{...styles.benefitIconWrapper, backgroundColor: `${item.color}15`}}>
                <div style={{...styles.benefitIcon, color: item.color}}>
                  {item.icon}
                </div>
              </div>
              <h3 style={styles.benefitStat}>{item.stat}</h3>
              <h4 style={styles.benefitTitle}>{item.title}</h4>
              <p style={styles.benefitDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section - SMALL CARDS, NO SCROLL */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsContainer}>
          {[
            { step: "01", title: "Sensor Installation", desc: "IoT sensors in bins", icon: "🔧", onClick: navigateToSensorInstallation },
            { step: "02", title: "Data Collection", desc: "Real-time data", icon: "📡", onClick: navigateToDataCollection },
            { step: "03", title: "Database Processing", desc: "Data storage & analysis", icon: "💾", onClick: navigateToDatabaseProcessing },
            { step: "04", title: "Smart Alerts", desc: "Instant notifications", icon: "🔔", onClick: navigateToSmartAlerts }
          ].map((item, index) => (
            <div key={index} className="step-card clickable-step" style={styles.stepCard} onClick={item.onClick}>
              <div style={styles.stepNumber}>{item.step}</div>
              <div style={styles.stepIcon}>{item.icon}</div>
              <h3 style={styles.stepTitle}>{item.title}</h3>
              <p style={styles.stepDesc}>{item.desc}</p>
              <div style={styles.clickHint}>Learn more →</div>
              {index < 3 && <div style={styles.stepLine}>→</div>}
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

      {showLogin && <LoginCard onClose={() => setShowLogin(false)} onSwitchToSignup={switchToSignup} />}
      {showSignup && <SignupCard onClose={() => setShowSignup(false)} onSwitchToLogin={switchToLogin} />}
    </div>
  );
}

// STYLES
const styles = {
  hero: { marginTop: '90px', height: '90vh', position: 'relative', overflow: 'hidden' },
  slide: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  slideContent: { textAlign: 'center', color: '#ffffff', maxWidth: '900px', padding: '0 2rem' },
  slideTitle: { fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem', animation: 'fadeInUp 1s', fontWeight: 700 },
  slideDescription: { fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', marginBottom: '2rem', animation: 'fadeInUp 1s 0.3s both', opacity: 0.95 },
  learnMoreBtn: { padding: '1rem 2.5rem', background: '#00b4d8', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeInUp 1s 0.6s both', transition: 'all 0.3s', fontWeight: 600 },
  sliderDots: { position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', zIndex: 10 },
  dot: { width: '14px', height: '14px', borderRadius: '50%', border: '2px solid white', cursor: 'pointer', transition: 'all 0.3s' },

  // Features
  features: { padding: '3rem 2rem', background: '#f8f9fa' },
  sectionTitle: { textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#023047', marginBottom: '2rem', fontWeight: 700 },
  featuresGrid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  featureCard: { background: '#ffffff', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'all 0.3s', border: '1px solid rgba(0,180,216,0.1)', cursor: 'pointer' },
  featureIconWrapper: { width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', transition: 'all 0.3s' },
  featureTitle: { color: '#023047', marginBottom: '0.3rem', fontSize: '1.1rem', fontWeight: 600 },
  featureDesc: { color: '#666', lineHeight: 1.5, fontSize: '0.85rem' },

  // Flow Diagram
  flowDiagram: { padding: '3rem 2rem', background: '#ffffff' },
  
  // BLUE FLOW SUMMARY LINE WITH TEXT - AT TOP
  flowSummary: { textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)', color: 'white', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, maxWidth: '1200px', margin: '0 auto 1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },

  // ARROW CONTAINER
  arrowContainer: { textAlign: 'center', margin: '1rem 0' },

  // ARROWS
  arrowDown: { fontSize: '2rem', color: '#00b4d8', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,180,216,0.3)' },

  // RED DOTTED BOX WRAPPER
  layerWithBox: { maxWidth: '1200px', margin: '0 auto 1.5rem', padding: '1.5rem', border: '2px dashed #dc3545', borderRadius: '12px', backgroundColor: 'rgba(220, 53, 69, 0.02)' },

  layer: { background: '#f8f9fa', borderRadius: '16px', padding: '1.5rem', marginBottom: '0rem', border: '1px solid rgba(0,180,216,0.1)' },
  layerTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#023047', marginBottom: '1rem', textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '2px solid #00b4d8', display: 'inline-block', width: 'auto', margin: '0 auto 1rem auto' },
  sensorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' },
  sensorBox: { background: 'white', padding: '0.6rem', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s', cursor: 'pointer', position: 'relative' },
  sensorIcon: { fontSize: '1.5rem', marginBottom: '0.2rem' },
  sensorName: { fontWeight: 'bold', color: '#023047', fontSize: '0.75rem' },
  sensorDetail: { fontSize: '0.65rem', color: '#666' },
  tooltip: { position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', background: '#ffffff', color: '#000000', padding: '0.7rem 0.9rem', borderRadius: '6px', fontSize: '0.65rem', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', textAlign: 'center', width: 'max-content', maxWidth: '150px', border: '1px solid #ddd', lineHeight: '1.3', wordWrap: 'break-word' },
  centerBox: { background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', color: 'white', transition: 'all 0.3s', margin: '1rem 0' },
  centerIcon: { fontSize: '2.5rem', marginBottom: '0.3rem' },
  centerTitle: { fontSize: '1.1rem', fontWeight: 'bold' },
  centerDetail: { fontSize: '0.8rem', opacity: 0.9 },
  backendGrid: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' },
  backendBox: { background: 'white', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', minWidth: '180px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s', cursor: 'pointer' },
  backendIcon: { fontSize: '2rem', marginBottom: '0.3rem' },
  backendTitle: { fontWeight: 'bold', color: '#023047', fontSize: '0.95rem' },
  backendDetail: { fontSize: '0.75rem', color: '#666' },
  backendEndpoint: { fontSize: '0.65rem', color: '#00b4d8', marginTop: '0.3rem', fontFamily: 'monospace' },
  arrowRight: { fontSize: '1.5rem', color: '#00b4d8', fontWeight: 'bold' },
  frontendGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' },
  frontendBox: { background: 'white', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s', cursor: 'pointer' },
  frontendIcon: { fontSize: '2rem', marginBottom: '0.3rem' },
  frontendTitle: { fontWeight: 'bold', color: '#023047', fontSize: '0.95rem' },
  frontendDetail: { fontSize: '0.75rem', color: '#666' },

  // Benefits
  benefits: { padding: '3rem 2rem', background: '#f8f9fa' },
  benefitsGrid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  benefitCard: { background: '#ffffff', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'all 0.3s', border: '1px solid rgba(0,180,216,0.1)', cursor: 'pointer' },
  benefitIconWrapper: { width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem', transition: 'all 0.3s' },
  benefitIcon: { fontSize: '1.8rem', transition: 'transform 0.3s' },
  benefitStat: { fontSize: '2rem', color: '#00b4d8', marginBottom: '0.3rem', fontWeight: 700 },
  benefitTitle: { fontSize: '1rem', color: '#023047', marginBottom: '0.3rem', fontWeight: 600 },
  benefitDesc: { color: '#666', lineHeight: 1.5, fontSize: '0.8rem' },

  // How It Works - SMALLER CARDS NO SCROLL
  howItWorks: { padding: '3rem 2rem', background: '#ffffff' },
  stepsContainer: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  stepCard: { background: '#f8f9fa', padding: '1.2rem 0.8rem', borderRadius: '12px', textAlign: 'center', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid rgba(0,180,216,0.1)' },
  stepNumber: { position: 'absolute', top: '-10px', left: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: 'rgba(0,180,216,0.15)' },
  stepIcon: { fontSize: '2.2rem', marginBottom: '0.5rem', marginTop: '0.3rem' },
  stepTitle: { fontSize: '0.9rem', color: '#023047', marginBottom: '0.4rem', fontWeight: 600 },
  stepDesc: { color: '#666', lineHeight: 1.4, fontSize: '0.75rem' },
  stepLine: { position: 'absolute', top: '50%', right: '-17px', fontSize: '1.2rem', color: '#00b4d8', transform: 'translateY(-50%)', fontWeight: 'bold' },
  clickHint: { marginTop: '0.6rem', fontSize: '0.65rem', color: '#00b4d8', fontWeight: 500 },

  // Stats
  stats: { background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)', padding: '2.5rem 2rem' },
  statsGrid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', textAlign: 'center' },
  statItem: { color: '#ffffff' },
  statIcon: { fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' },
  statNumber: { fontSize: '2.2rem', marginBottom: '0.2rem', fontWeight: 700 },
  statLabel: { fontSize: '0.95rem', opacity: 0.9 }
};

// Hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  button:hover { transform: translateY(-2px); }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0,180,216,0.2);
  }
  
  .benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0,180,216,0.2);
  }
  
  .step-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,180,216,0.15);
    background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);
  }
  
  .sensor-box:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0,180,216,0.2);
    border: 1px solid #00b4d8;
    background: linear-gradient(135deg, #ffffff 0%, #f0f9fb 100%);
  }
  
  .backend-box:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0,180,216,0.2);
    border: 1px solid #00b4d8;
  }
  
  .frontend-box:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0,180,216,0.2);
    border: 1px solid #00b4d8;
  }
  
  .center-box:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 25px rgba(0,180,216,0.3);
  }
`;
document.head.appendChild(styleSheet);

export default Home;