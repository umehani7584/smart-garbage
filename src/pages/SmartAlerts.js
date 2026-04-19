import React from 'react';
import { Link } from 'react-router-dom';

function SmartAlerts() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Smart Alerts System</h1>
        <p style={styles.heroSubtitle}>
          Real-time notifications for critical situations
        </p>
      </section>

      {/* Content */}
      <div style={styles.content}>
        {/* Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔔 How Alerts Work</h2>
          <p style={styles.cardText}>
            Our smart alert system monitors bin data in real-time and triggers notifications
            when certain thresholds are crossed. This ensures timely action and prevents
            hazardous situations.
          </p>
        </div>

        {/* Alert Types */}
        <h2 style={styles.sectionTitle}>Types of Alerts</h2>
        <div style={styles.alertsGrid}>
          <div style={styles.alertCard}>
            <div style={styles.alertIcon}>⚠️</div>
            <h3 style={styles.alertTitle}>Bin Full Alert</h3>
            <p style={styles.alertDesc}>
              Triggered when fill level exceeds 90%. Notifies collection team immediately.
            </p>
            <div style={styles.alertThreshold}>
              Threshold: &gt; 90% fill level
            </div>
          </div>

          <div style={styles.alertCard}>
            <div style={styles.alertIcon}>🔥</div>
            <h3 style={styles.alertTitle}>High Temperature Alert</h3>
            <p style={styles.alertDesc}>
              Triggered when temperature exceeds 50°C. Indicates possible fire hazard.
            </p>
            <div style={styles.alertThreshold}>
              Threshold: &gt; 50°C
            </div>
          </div>

          <div style={styles.alertCard}>
            <div style={styles.alertIcon}>💨</div>
            <h3 style={styles.alertTitle}>Gas Detection Alert</h3>
            <p style={styles.alertDesc}>
              Triggered when harmful gas levels exceed 500ppm. Requires immediate attention.
            </p>
            <div style={styles.alertThreshold}>
              Threshold: &gt; 500ppm
            </div>
          </div>

          <div style={styles.alertCard}>
            <div style={styles.alertIcon}>⚖️</div>
            <h3 style={styles.alertTitle}>Weight Limit Alert</h3>
            <p style={styles.alertDesc}>
              Triggered when bin weight exceeds 40kg. Prevents overloading.
            </p>
            <div style={styles.alertThreshold}>
              Threshold: &gt; 40kg
            </div>
          </div>
        </div>

        {/* Alert Methods */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📱 Alert Delivery Methods</h2>
          <div style={styles.methodsGrid}>
            <div style={styles.methodCard}>
              <div style={styles.methodIcon}>📧</div>
              <h3>Email Notifications</h3>
              <p>Automated emails sent to registered users and admins</p>
            </div>
            <div style={styles.methodCard}>
              <div style={styles.methodIcon}>📱</div>
              <h3>SMS Alerts</h3>
              <p>Text messages for critical alerts requiring immediate action</p>
            </div>
            <div style={styles.methodCard}>
              <div style={styles.methodIcon}>🔔</div>
              <h3>Dashboard Notifications</h3>
              <p>Real-time popup notifications on the web dashboard</p>
            </div>
            <div style={styles.methodCard}>
              <div style={styles.methodIcon}>🔊</div>
              <h3>Buzzer Alert</h3>
              <p>Local buzzer on the bin for immediate nearby notification</p>
            </div>
          </div>
        </div>

        {/* Alert Flow */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔄 Alert Generation Flow</h2>
          <div style={styles.alertFlow}>
            <div style={styles.alertFlowStep}>
              <div style={styles.alertFlowNum}>1</div>
              <div>Sensor reads data</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.alertFlowStep}>
              <div style={styles.alertFlowNum}>2</div>
              <div>ESP32 sends to Flask</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.alertFlowStep}>
              <div style={styles.alertFlowNum}>3</div>
              <div>Check thresholds</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.alertFlowStep}>
              <div style={styles.alertFlowNum}>4</div>
              <div>Trigger alert</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.alertFlowStep}>
              <div style={styles.alertFlowNum}>5</div>
              <div>Notify users</div>
            </div>
          </div>
        </div>

        {/* Color Codes */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎨 Alert Priority Levels</h2>
          <div style={styles.priorityLevels}>
            <div style={{...styles.priority, backgroundColor: '#2ecc71', color: 'white'}}>
              🟢 Low Priority - Normal (0-70% fill)
            </div>
            <div style={{...styles.priority, backgroundColor: '#f39c12', color: 'white'}}>
              🟡 Medium Priority - Warning (71-89% fill)
            </div>
            <div style={{...styles.priority, backgroundColor: '#e74c3c', color: 'white'}}>
              🔴 High Priority - Critical (90%+ fill / Hazardous conditions)
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link to="/" style={styles.backButton}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)',
    borderRadius: '30px',
    color: 'white',
    marginBottom: '3rem'
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#023047',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  card: {
    background: '#f8f9fa',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#023047',
    marginBottom: '1rem'
  },
  cardText: {
    fontSize: '1rem',
    lineHeight: 1.8,
    color: '#666'
  },
  alertsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  alertCard: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '15px',
    textAlign: 'center',
    transition: 'transform 0.3s'
  },
  alertIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem'
  },
  alertTitle: {
    fontSize: '1.2rem',
    color: '#023047',
    marginBottom: '0.5rem'
  },
  alertDesc: {
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '0.5rem'
  },
  alertThreshold: {
    fontSize: '0.8rem',
    color: '#00b4d8',
    fontWeight: 'bold'
  },
  methodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  methodCard: {
    padding: '1rem',
    background: 'white',
    borderRadius: '10px',
    textAlign: 'center'
  },
  methodIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  alertFlow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  alertFlowStep: {
    textAlign: 'center',
    padding: '1rem',
    background: 'white',
    borderRadius: '10px',
    minWidth: '100px'
  },
  alertFlowNum: {
    width: '30px',
    height: '30px',
    background: '#00b4d8',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.5rem',
    fontWeight: 'bold'
  },
  flowArrow: {
    fontSize: '1.5rem',
    color: '#00b4d8'
  },
  priorityLevels: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  priority: {
    padding: '1rem',
    borderRadius: '10px',
    textAlign: 'center'
  },
  backButton: {
    display: 'inline-block',
    textAlign: 'center',
    padding: '1rem 2rem',
    background: '#00b4d8',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    marginTop: '1rem',
    transition: 'all 0.3s'
  }
};

export default SmartAlerts;