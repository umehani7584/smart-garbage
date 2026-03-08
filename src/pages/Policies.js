import React, { useState } from 'react';

function Policies() {
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'terms', label: 'Terms of Service', icon: '📜' },
    { id: 'cookie', label: 'Cookie Policy', icon: '🍪' },
    { id: 'data', label: 'Data Protection', icon: '🛡️' }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <section style={styles.header}>
        <h1 style={styles.headerTitle}>Policies & Terms</h1>
        <p style={styles.headerSubtitle}>
          Learn about how we handle your data and protect your privacy
        </p>
      </section>

      {/* Last Updated */}
      <div style={styles.lastUpdated}>
        <span style={styles.updateIcon}>📅</span>
        <span style={styles.updateText}>Last Updated: March 8, 2024</span>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.activeTab : {})
            }}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Privacy Policy */}
        {activeTab === 'privacy' && (
          <div style={styles.policySection}>
            <h2 style={styles.policyTitle}>Privacy Policy</h2>
            
            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>1. Information We Collect</h3>
              <p style={styles.cardText}>
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This may include:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Name and contact information</li>
                <li style={styles.listItem}>Account credentials</li>
                <li style={styles.listItem}>Bin monitoring data and settings</li>
                <li style={styles.listItem}>Communication preferences</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>2. How We Use Your Information</h3>
              <p style={styles.cardText}>
                We use the information we collect to:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Provide and maintain our services</li>
                <li style={styles.listItem}>Monitor bin status and send alerts</li>
                <li style={styles.listItem}>Improve and personalize your experience</li>
                <li style={styles.listItem}>Communicate with you about updates</li>
                <li style={styles.listItem}>Ensure the security of our system</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>3. Data Sharing and Disclosure</h3>
              <p style={styles.cardText}>
                We do not sell your personal information. We may share your information only in these circumstances:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>With your consent</li>
                <li style={styles.listItem}>To comply with legal obligations</li>
                <li style={styles.listItem}>To protect our rights and safety</li>
                <li style={styles.listItem}>With service providers who assist in operating our system</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>4. Data Security</h3>
              <p style={styles.cardText}>
                We implement industry-standard security measures including encryption, 
                access controls, and regular security audits to protect your information.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>5. Your Rights</h3>
              <p style={styles.cardText}>
                You have the right to:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Access your personal data</li>
                <li style={styles.listItem}>Correct inaccurate data</li>
                <li style={styles.listItem}>Request deletion of your data</li>
                <li style={styles.listItem}>Object to data processing</li>
                <li style={styles.listItem}>Export your data</li>
              </ul>
            </div>
          </div>
        )}

        {/* Terms of Service */}
        {activeTab === 'terms' && (
          <div style={styles.policySection}>
            <h2 style={styles.policyTitle}>Terms of Service</h2>
            
            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>1. Acceptance of Terms</h3>
              <p style={styles.cardText}>
                By accessing and using the Smart Garbage System, you agree to be bound by these Terms 
                of Service and all applicable laws and regulations.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>2. User Accounts</h3>
              <p style={styles.cardText}>
                To use certain features, you must create an account. You are responsible for:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Maintaining account security</li>
                <li style={styles.listItem}>All activities under your account</li>
                <li style={styles.listItem}>Providing accurate information</li>
                <li style={styles.listItem}>Notifying us of unauthorized use</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>3. Acceptable Use</h3>
              <p style={styles.cardText}>
                You agree not to:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Use the service for illegal purposes</li>
                <li style={styles.listItem}>Interfere with system operations</li>
                <li style={styles.listItem}>Attempt to access unauthorized data</li>
                <li style={styles.listItem}>Share account credentials</li>
                <li style={styles.listItem}>Reverse engineer our systems</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>4. Intellectual Property</h3>
              <p style={styles.cardText}>
                All content, features, and functionality of our service are owned by Smart Garbage System 
                and are protected by intellectual property laws.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>5. Termination</h3>
              <p style={styles.cardText}>
                We may terminate or suspend your account for violations of these terms, 
                with or without notice. You may delete your account at any time.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>6. Disclaimer of Warranties</h3>
              <p style={styles.cardText}>
                Our service is provided "as is" without warranties of any kind. 
                While we strive for accuracy, we do not guarantee that the service will be 
                error-free or uninterrupted.
              </p>
            </div>
          </div>
        )}

        {/* Cookie Policy */}
        {activeTab === 'cookie' && (
          <div style={styles.policySection}>
            <h2 style={styles.policyTitle}>Cookie Policy</h2>
            
            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>What Are Cookies</h3>
              <p style={styles.cardText}>
                Cookies are small text files stored on your device when you visit our website. 
                They help us provide a better user experience and understand how you use our service.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>How We Use Cookies</h3>
              <p style={styles.cardText}>
                We use cookies for:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Keeping you logged in</li>
                <li style={styles.listItem}>Remembering your preferences</li>
                <li style={styles.listItem}>Analyzing site traffic</li>
                <li style={styles.listItem}>Improving our services</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Types of Cookies We Use</h3>
              
              <div style={styles.cookieType}>
                <h4 style={styles.cookieTypeTitle}>Essential Cookies</h4>
                <p style={styles.cookieTypeText}>Required for basic site functionality</p>
              </div>
              
              <div style={styles.cookieType}>
                <h4 style={styles.cookieTypeTitle}>Preference Cookies</h4>
                <p style={styles.cookieTypeText}>Remember your settings and choices</p>
              </div>
              
              <div style={styles.cookieType}>
                <h4 style={styles.cookieTypeTitle}>Analytics Cookies</h4>
                <p style={styles.cookieTypeText}>Help us understand how visitors use our site</p>
              </div>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Managing Cookies</h3>
              <p style={styles.cardText}>
                You can control cookies through your browser settings. However, disabling cookies 
                may affect your ability to use certain features of our service.
              </p>
            </div>
          </div>
        )}

        {/* Data Protection */}
        {activeTab === 'data' && (
          <div style={styles.policySection}>
            <h2 style={styles.policyTitle}>Data Protection</h2>
            
            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Our Commitment</h3>
              <p style={styles.cardText}>
                We are committed to protecting your personal data and respecting your privacy. 
                Our data protection practices comply with applicable laws and industry standards.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Data Security Measures</h3>
              <ul style={styles.list}>
                <li style={styles.listItem}>End-to-end encryption for sensitive data</li>
                <li style={styles.listItem}>Regular security audits and penetration testing</li>
                <li style={styles.listItem}>Access controls and authentication requirements</li>
                <li style={styles.listItem}>Secure data centers with backup systems</li>
                <li style={styles.listItem}>Employee training on data protection</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Data Retention</h3>
              <p style={styles.cardText}>
                We retain your data only as long as necessary to provide our services and 
                comply with legal obligations. You may request deletion of your data at any time.
              </p>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Data Breach Procedures</h3>
              <p style={styles.cardText}>
                In case of a data breach, we will:
              </p>
              <ul style={styles.list}>
                <li style={styles.listItem}>Notify affected users within 72 hours</li>
                <li style={styles.listItem}>Investigate and address the breach</li>
                <li style={styles.listItem}>Take steps to prevent future incidents</li>
                <li style={styles.listItem}>Cooperate with relevant authorities</li>
              </ul>
            </div>

            <div style={styles.policyCard}>
              <h3 style={styles.cardTitle}>Contact Our Data Protection Officer</h3>
              <p style={styles.cardText}>
                For data protection inquiries, contact our DPO at:
              </p>
              <div style={styles.contactInfo}>
                <p style={styles.contactItem}>📧 dpo@smartgarbage.com</p>
                <p style={styles.contactItem}>📞 +92 300 1234567</p>
              </div>
            </div>
          </div>
        )}
      </div>

            {/* Consent Section */}
      <section style={styles.consentSection}>
        <div style={styles.consentCard}>
          <div style={styles.consentIcon}>✅</div>
          <div style={styles.consentText}>
            <h3 style={styles.consentTitle}>By using our service, you agree to our policies</h3>
            <p style={styles.consentSubtext}>
              We're committed to transparency and protecting your data
            </p>
          </div>
          <button 
            style={styles.consentBtn}
            onClick={() => alert('Thank you for acknowledging our policies!')}
          >
            I Understand
          </button>
        </div>
      </section>
      
    </div>
  );
}

// Colors
const colors = {
  primary: '#00b4d8',
  secondary: '#0077b6',
  dark: '#023047',
  light: '#f8f9fa',
  white: '#ffffff',
  gradient: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)'
};

// Styles
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem'
  },

  // Header
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  headerTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    color: colors.dark,
    marginBottom: '1rem',
    fontWeight: 700
  },
  headerSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    maxWidth: '700px',
    margin: '0 auto'
  },

  // Last Updated
  lastUpdated: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '3rem',
    color: '#666'
  },
  updateIcon: {
    fontSize: '1.2rem'
  },
  updateText: {
    fontSize: '1rem'
  },

  // Tab Navigation
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  tabButton: {
    padding: '1rem 2rem',
    background: colors.light,
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  activeTab: {
    background: colors.primary,
    color: colors.white
  },
  tabIcon: {
    fontSize: '1.2rem'
  },
  tabLabel: {
    fontWeight: 500
  },

  // Content
  content: {
    marginBottom: '4rem'
  },
  policySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  policyTitle: {
    fontSize: '2.5rem',
    color: colors.dark,
    marginBottom: '1rem'
  },
  policyCard: {
    background: colors.light,
    padding: '2rem',
    borderRadius: '15px',
    transition: 'transform 0.3s'
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: colors.dark,
    marginBottom: '1rem'
  },
  cardText: {
    color: '#666',
    lineHeight: 1.8,
    marginBottom: '1rem'
  },
  list: {
    paddingLeft: '2rem',
    color: '#666'
  },
  listItem: {
    lineHeight: 1.8,
    marginBottom: '0.3rem'
  },

  // Cookie Types
  cookieType: {
    marginBottom: '1rem',
    padding: '1rem',
    background: colors.white,
    borderRadius: '8px'
  },
  cookieTypeTitle: {
    fontSize: '1.1rem',
    color: colors.dark,
    marginBottom: '0.3rem'
  },
  cookieTypeText: {
    color: '#666'
  },

  // Contact Info
  contactInfo: {
    marginTop: '1rem',
    padding: '1rem',
    background: colors.white,
    borderRadius: '8px'
  },
  contactItem: {
    color: '#666',
    marginBottom: '0.3rem'
  },

  // Consent Section
  consentSection: {
    marginTop: '4rem'
  },
  consentCard: {
    background: colors.gradient,
    padding: '2.5rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    color: colors.white
  },
  consentIcon: {
    fontSize: '3rem'
  },
  consentText: {
    flex: 1
  },
  consentTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.3rem'
  },
  consentSubtext: {
    opacity: 0.9
  },
  consentBtn: {
    padding: '1rem 2.5rem',
    background: colors.white,
    color: colors.primary,
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s'
  }
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .tab-button:hover {
    background: ${colors.primary}20 !important;
    transform: translateY(-2px);
  }
  
  .active-tab:hover {
    background: ${colors.primary} !important;
  }
  
  .policy-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.1);
  }
  
  .consent-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255,255,255,0.3);
  }
  
  @media (max-width: 768px) {
    .consent-card {
      flex-direction: column;
      text-align: center;
    }
    
    .tab-container {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Policies;