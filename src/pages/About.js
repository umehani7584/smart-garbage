import React from 'react';

function About() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>About Smart Garbage System</h1>
        <p style={styles.heroSubtitle}>
          Revolutionizing waste management through IoT technology for cleaner, smarter cities
        </p>
      </section>

      {/* Mission & Vision */}
      <section style={styles.missionSection}>
        <div style={styles.missionGrid}>
          <div style={styles.missionCard}>
            <div style={styles.missionIcon}>🎯</div>
            <h2 style={styles.missionTitle}>Our Mission</h2>
            <p style={styles.missionText}>
              To transform urban waste management through innovative IoT solutions, 
              reducing environmental impact and improving quality of life in cities 
              across Pakistan and beyond.
            </p>
          </div>
          
          <div style={styles.missionCard}>
            <div style={styles.missionIcon}>👁️</div>
            <h2 style={styles.missionTitle}>Our Vision</h2>
            <p style={styles.missionText}>
              A future where every city has smart, efficient, and sustainable waste 
              management systems that contribute to cleaner environments and healthier communities.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section style={styles.problemSection}>
        <div style={styles.problemContent}>
          <h2 style={styles.sectionTitle}>The Problem We're Solving</h2>
          <div style={styles.problemGrid}>
            <div style={styles.problemCard}>
              <span style={styles.problemIcon}>🗑️</span>
              <h3 style={styles.problemCardTitle}>Overflowing Bins</h3>
              <p style={styles.problemCardText}>
                Traditional garbage collection lacks real-time monitoring, leading to overflowing bins and unhygienic conditions.
              </p>
            </div>
            
            <div style={styles.problemCard}>
              <span style={styles.problemIcon}>⛽</span>
              <h3 style={styles.problemCardTitle}>Wasted Resources</h3>
              <p style={styles.problemCardText}>
                Collection vehicles often visit empty bins, wasting fuel, time, and labor resources.
              </p>
            </div>
            
            <div style={styles.problemCard}>
              <span style={styles.problemIcon}>💨</span>
              <h3 style={styles.problemCardTitle}>Health Hazards</h3>
              <p style={styles.problemCardText}>
                Accumulated garbage produces harmful gases and creates health risks for communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section style={styles.solutionSection}>
        <div style={styles.solutionContent}>
          <h2 style={styles.sectionTitle}>Our Smart Solution</h2>
          <p style={styles.solutionText}>
            We've developed an IoT-enabled smart garbage system that automates waste management 
            through real-time monitoring and intelligent alerts.
          </p>
          
          <div style={styles.solutionFeatures}>
            <div style={styles.solutionFeature}>
              <div style={styles.featureNumber}>01</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureTitle}>Smart Sensors</h3>
                <p style={styles.featureText}>
                  Ultrasonic, load cell, DHT11, and MQ-135 sensors monitor fill levels, 
                  weight, temperature, and gas emissions in real-time.
                </p>
              </div>
            </div>
            
            <div style={styles.solutionFeature}>
              <div style={styles.featureNumber}>02</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureTitle}>ESP32 Microcontroller</h3>
                <p style={styles.featureText}>
                  Collects and processes sensor data, then sends it via WiFi to our Flask server.
                </p>
              </div>
            </div>
            
            <div style={styles.solutionFeature}>
              <div style={styles.featureNumber}>03</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureTitle}>Cloud Database</h3>
                <p style={styles.featureText}>
                  MySQL database stores all bin data for historical analysis and reporting.
                </p>
              </div>
            </div>
            
            <div style={styles.solutionFeature}>
              <div style={styles.featureNumber}>04</div>
              <div style={styles.featureContent}>
                <h3 style={styles.featureTitle}>Web Dashboard</h3>
                <p style={styles.featureText}>
                  React-based dashboard displays real-time bin status with color-coded indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>Meet Our Team</h2>
        <p style={styles.teamSubtitle}>Final Year Project | Department of Computer Science</p>
        
        <div style={styles.teamGrid}>
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👩‍💻</div>
            <h3 style={styles.teamName}>UmmeHani</h3>
            <p style={styles.teamRole}>Developer</p>
            <p style={styles.teamId}>BSCS-MC-211</p>
            <div style={styles.teamSocial}>
              <span style={styles.socialIcon}>📧</span>
              <span style={styles.socialIcon}>🔗</span>
            </div>
          </div>
          
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👩‍💻</div>
            <h3 style={styles.teamName}>Yusra Bilal</h3>
            <p style={styles.teamRole}>Developer</p>
            <p style={styles.teamId}>BSCS-MC-246</p>
            <div style={styles.teamSocial}>
              <span style={styles.socialIcon}>📧</span>
              <span style={styles.socialIcon}>🔗</span>
            </div>
          </div>
          
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👨‍🏫</div>
            <h3 style={styles.teamName}>Faisal Hussain</h3>
            <p style={styles.teamRole}>Project Supervisor</p>
            <p style={styles.teamId}>Department of Computer Science</p>
            <div style={styles.teamSocial}>
              <span style={styles.socialIcon}>📧</span>
              <span style={styles.socialIcon}>🔗</span>
            </div>
          </div>
        </div>
      </section>

      {/* University Section */}
      <section style={styles.universitySection}>
        <div style={styles.universityContent}>
          <div style={styles.universityIcon}>🏛️</div>
          <h2 style={styles.universityTitle}>National University of Modern Languages, Islamabad</h2>
          <p style={styles.universityText}>
            Department of Computer Science<br />
            Final Year Project 2024
          </p>
          <div style={styles.universityBadge}>
            <span style={styles.badge}>IoT</span>
            <span style={styles.badge}>Smart City</span>
            <span style={styles.badge}>FYP</span>
          </div>
        </div>
      </section>

      {/* SDG Goals Section */}
      <section style={styles.sdgSection}>
        <h2 style={styles.sectionTitle}>Supporting UN Sustainable Development Goals</h2>
        <div style={styles.sdgGrid}>
          <div style={styles.sdgCard}>
            <div style={styles.sdgIcon}>🏙️</div>
            <h3 style={styles.sdgTitle}>Goal 11</h3>
            <p style={styles.sdgText}>Sustainable Cities and Communities</p>
          </div>
          
          <div style={styles.sdgCard}>
            <div style={styles.sdgIcon}>🔄</div>
            <h3 style={styles.sdgTitle}>Goal 12</h3>
            <p style={styles.sdgText}>Responsible Consumption and Production</p>
          </div>
          
          <div style={styles.sdgCard}>
            <div style={styles.sdgIcon}>🌍</div>
            <h3 style={styles.sdgTitle}>Goal 13</h3>
            <p style={styles.sdgText}>Climate Action</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Styles
const colors = {
  primary: '#00b4d8',
  secondary: '#0077b6',
  dark: '#023047',
  light: '#f8f9fa',
  white: '#ffffff',
  gradient: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)'
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },

  // Hero Section
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: colors.gradient,
    borderRadius: '30px',
    color: colors.white,
    marginBottom: '4rem'
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    marginBottom: '1rem',
    fontWeight: 700
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    opacity: 0.95,
    maxWidth: '800px',
    margin: '0 auto'
  },

  // Mission Section
  missionSection: {
    marginBottom: '4rem'
  },
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem'
  },
  missionCard: {
    background: colors.light,
    padding: '3rem',
    borderRadius: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s'
  },
  missionIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem'
  },
  missionTitle: {
    fontSize: '2rem',
    color: colors.dark,
    marginBottom: '1rem'
  },
  missionText: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: 1.8
  },

  // Problem Section
  problemSection: {
    marginBottom: '4rem',
    background: colors.light,
    padding: '4rem 2rem',
    borderRadius: '30px'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: '3rem'
  },
  problemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  problemCard: {
    background: colors.white,
    padding: '2rem',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
  },
  problemIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  problemCardTitle: {
    fontSize: '1.3rem',
    color: colors.dark,
    marginBottom: '0.5rem'
  },
  problemCardText: {
    color: '#666',
    lineHeight: 1.6
  },

  // Solution Section
  solutionSection: {
    marginBottom: '4rem'
  },
  solutionContent: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  solutionText: {
    fontSize: '1.2rem',
    color: '#666',
    textAlign: 'center',
    lineHeight: 1.8,
    marginBottom: '3rem'
  },
  solutionFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  solutionFeature: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start',
    background: colors.light,
    padding: '2rem',
    borderRadius: '15px'
  },
  featureNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: colors.primary,
    minWidth: '70px'
  },
  featureContent: {
    flex: 1
  },
  featureTitle: {
    fontSize: '1.4rem',
    color: colors.dark,
    marginBottom: '0.5rem'
  },
  featureText: {
    color: '#666',
    lineHeight: 1.6
  },

  // Team Section
  teamSection: {
    marginBottom: '4rem',
    textAlign: 'center'
  },
  teamSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '3rem'
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  teamCard: {
    background: colors.light,
    padding: '2rem',
    borderRadius: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s'
  },
  teamAvatar: {
    fontSize: '5rem',
    marginBottom: '1rem'
  },
  teamName: {
    fontSize: '1.5rem',
    color: colors.dark,
    marginBottom: '0.3rem'
  },
  teamRole: {
    color: colors.primary,
    fontWeight: 600,
    marginBottom: '0.3rem'
  },
  teamId: {
    color: '#666',
    marginBottom: '1rem'
  },
  teamSocial: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  socialIcon: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.3s'
  },

  // University Section
  universitySection: {
    marginBottom: '4rem',
    background: colors.gradient,
    padding: '4rem',
    borderRadius: '30px',
    color: colors.white,
    textAlign: 'center'
  },
  universityIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  universityTitle: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  universityText: {
    fontSize: '1.2rem',
    opacity: 0.95,
    marginBottom: '2rem'
  },
  universityBadge: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  badge: {
    padding: '0.5rem 1.5rem',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50px',
    fontSize: '1rem'
  },

  // SDG Section
  sdgSection: {
    marginBottom: '4rem'
  },
  sdgGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  sdgCard: {
    background: colors.light,
    padding: '2rem',
    borderRadius: '15px',
    textAlign: 'center'
  },
  sdgIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  sdgTitle: {
    fontSize: '1.3rem',
    color: colors.dark,
    marginBottom: '0.5rem'
  },
  sdgText: {
    color: '#666'
  }
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .mission-card:hover,
  .team-card:hover,
  .sdg-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,180,216,0.15);
  }
  
  .social-icon:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  
  .solution-feature:hover {
    transform: translateX(10px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.1);
  }
  
  @media (max-width: 768px) {
    .mission-grid,
    .problem-grid,
    .team-grid,
    .sdg-grid {
      grid-template-columns: 1fr !important;
    }
    
    .solution-feature {
      flex-direction: column;
      text-align: center;
    }
  }
`;
document.head.appendChild(styleSheet);

export default About;