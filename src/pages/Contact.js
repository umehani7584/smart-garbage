import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show success popup
    setShowPopup(true);
    
    // Clear form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div style={styles.container}>
      {/* Success Popup */}
      {showPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <span style={styles.popupIcon}>✅</span>
            <h3 style={styles.popupTitle}>Message Sent!</h3>
            <p style={styles.popupText}>We'll get back to you soon.</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section style={styles.header}>
        <h1 style={styles.headerTitle}>Get in Touch</h1>
        <p style={styles.headerSubtitle}>
          Have questions about our smart garbage system? We're here to help!
        </p>
      </section>

      {/* Contact Content */}
      <div style={styles.content}>
        {/* Contact Information */}
        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          
          <div style={styles.infoCard}>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📍</div>
              <div style={styles.infoDetails}>
                <h3 style={styles.infoLabel}>Visit Us</h3>
                <p style={styles.infoText}>
                  National University of Modern Languages<br />
                  Sector H-9, Islamabad<br />
                  Pakistan
                </p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📧</div>
              <div style={styles.infoDetails}>
                <h3 style={styles.infoLabel}>Email Us</h3>
                <p style={styles.infoText}>info@smartgarbage.com</p>
                <p style={styles.infoText}>support@smartgarbage.com</p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📞</div>
              <div style={styles.infoDetails}>
                <h3 style={styles.infoLabel}>Call Us</h3>
                <p style={styles.infoText}>+92 300 1234567</p>
                <p style={styles.infoText}>+92 51 1234567</p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>🕒</div>
              <div style={styles.infoDetails}>
                <h3 style={styles.infoLabel}>Working Hours</h3>
                <p style={styles.infoText}>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p style={styles.infoText}>Saturday: 10:00 AM - 2:00 PM</p>
                <p style={styles.infoText}>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={styles.socialSection}>
            <h3 style={styles.socialTitle}>Follow Us</h3>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink}>📘</a>
              <a href="#" style={styles.socialLink}>🐦</a>
              <a href="#" style={styles.socialLink}>📷</a>
              <a href="#" style={styles.socialLink}>🔗</a>
              <a href="#" style={styles.socialLink}>💼</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Send us a Message</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Your Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email Address <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Subject <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Message <span style={styles.required}>*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or question..."
                style={styles.textarea}
                rows="6"
                required
              />
            </div>

            <button type="submit" style={styles.submitBtn}>
              Send Message <span style={styles.sendIcon}>→</span>
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <section style={styles.mapSection}>
        <h2 style={styles.sectionTitle}>Find Us Here</h2>
        <div style={styles.mapContainer}>
          {/* Using a placeholder map - replace with actual Google Maps iframe */}
          <div style={styles.mapPlaceholder}>
            <div style={styles.mapOverlay}>
              <span style={styles.mapIcon}>🗺️</span>
              <p style={styles.mapText}>NUML Islamabad</p>
              <p style={styles.mapSubtext}>Sector H-9, Islamabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section style={styles.faqSection}>
        <h2 style={styles.sectionTitle}>Quick Answers</h2>
        <div style={styles.faqGrid}>
          <div style={styles.faqItem}>
            <div style={styles.faqQuestion}>❓ How does the smart bin work?</div>
            <p style={styles.faqAnswer}>Our bins use IoT sensors to monitor fill levels, weight, and gas emissions in real-time.</p>
          </div>
          
          <div style={styles.faqItem}>
            <div style={styles.faqQuestion}>❓ What is the response time?</div>
            <p style={styles.faqAnswer}>We typically respond within 24 hours on business days.</p>
          </div>
          
          <div style={styles.faqItem}>
            <div style={styles.faqQuestion}>❓ Do you offer demo?</div>
            <p style={styles.faqAnswer}>Yes! Contact us to schedule a live demo of our system.</p>
          </div>
          
          <div style={styles.faqItem}>
            <div style={styles.faqQuestion}>❓ Is there mobile app?</div>
            <p style={styles.faqAnswer}>Our web dashboard is mobile-responsive and works on all devices.</p>
          </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative'
  },

  // Popup Styles
  popup: {
    position: 'fixed',
    top: '100px',
    right: '20px',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease'
  },
  popupContent: {
    background: colors.white,
    padding: '1.5rem 2rem',
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0,180,216,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderLeft: `5px solid ${colors.primary}`
  },
  popupIcon: {
    fontSize: '2rem'
  },
  popupTitle: {
    fontSize: '1.2rem',
    color: colors.dark,
    marginBottom: '0.2rem'
  },
  popupText: {
    color: '#666'
  },

  // Header
  header: {
    textAlign: 'center',
    marginBottom: '4rem'
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

  // Content
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '3rem',
    marginBottom: '4rem'
  },

  // Info Section
  infoSection: {
    background: colors.light,
    padding: '2.5rem',
    borderRadius: '20px'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: colors.dark,
    marginBottom: '2rem',
    position: 'relative'
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginBottom: '2rem'
  },
  infoItem: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start'
  },
  infoIcon: {
    fontSize: '2rem',
    background: colors.white,
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  infoDetails: {
    flex: 1
  },
  infoLabel: {
    fontSize: '1.2rem',
    color: colors.dark,
    marginBottom: '0.3rem'
  },
  infoText: {
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '0.2rem'
  },

  // Social Section
  socialSection: {
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '2px solid rgba(0,0,0,0.05)'
  },
  socialTitle: {
    fontSize: '1.2rem',
    color: colors.dark,
    marginBottom: '1rem'
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  socialLink: {
    fontSize: '1.8rem',
    textDecoration: 'none',
    color: '#666',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },

  // Form Section
  formSection: {
    background: colors.white,
    padding: '2.5rem',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '1rem',
    fontWeight: 600,
    color: colors.dark
  },
  required: {
    color: '#dc3545'
  },
  input: {
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none'
  },
  textarea: {
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.3s',
    outline: 'none'
  },
  submitBtn: {
    padding: '1.2rem',
    background: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  sendIcon: {
    transition: 'transform 0.3s'
  },

  // Map Section
  mapSection: {
    marginBottom: '4rem'
  },
  mapContainer: {
    height: '400px',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    background: colors.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  mapOverlay: {
    textAlign: 'center',
    color: colors.white
  },
  mapIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem'
  },
  mapText: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.3rem'
  },
  mapSubtext: {
    fontSize: '1rem',
    opacity: 0.9
  },

  // FAQ Section
  faqSection: {
    marginBottom: '2rem'
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem'
  },
  faqItem: {
    background: colors.light,
    padding: '1.5rem',
    borderRadius: '15px',
    transition: 'all 0.3s'
  },
  faqQuestion: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: colors.dark,
    marginBottom: '0.5rem'
  },
  faqAnswer: {
    color: '#666',
    lineHeight: 1.6
  }
};

// Add animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  input:hover, textarea:hover {
    border-color: ${colors.primary} !important;
  }
  
  input:focus, textarea:focus {
    border-color: ${colors.primary} !important;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.1) !important;
  }
  
  .submit-btn:hover {
    background: ${colors.secondary} !important;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.3);
  }
  
  .submit-btn:hover .send-icon {
    transform: translateX(5px);
  }
  
  .social-link:hover {
    color: ${colors.primary} !important;
    transform: translateY(-3px);
  }
  
  .info-item:hover .info-icon {
    background: ${colors.primary};
    color: white;
    transform: scale(1.1);
  }
  
  .faq-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.1);
  }
  
  @media (max-width: 768px) {
    .content {
      grid-template-columns: 1fr !important;
    }
    
    .faq-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Contact;