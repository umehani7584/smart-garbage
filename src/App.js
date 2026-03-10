import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Colors (reusable)
const colors = {
  primary: '#00b4d8',
  secondary: '#0077b6',
  dark: '#023047',
  light: '#f8f9fa',
  white: '#ffffff',
  gradient: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)'
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div style={styles.container}>
        {/* Navigation Bar */}
        <nav style={styles.navbar}>
          <div style={styles.navContent}>
            <Link to="/" style={styles.logo}>
              <span style={styles.logoIcon}>♻️</span>
              <span style={styles.logoText}>Smart Garbage System</span>
            </Link>

            {/* Desktop Menu */}
            <div style={styles.desktopMenu}>
              <Link to="/" style={styles.navLink}>Home</Link>
              <Link to="/about" style={styles.navLink}>About</Link>
              <Link to="/contact" style={styles.navLink}>Contact</Link>
              <Link to="/policies" style={styles.navLink}>Policies</Link>
            </div>

            {/* Desktop Buttons */}
            <div style={styles.desktopButtons}>
              <Link to="/">
                <button 
                  style={styles.loginBtn}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('openLogin'));
                  }}
                >
                  Login
                </button>
              </Link>
              <Link to="/">
                <button 
                  style={styles.signupBtn}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('openSignup'));
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button style={styles.mobileMenuBtn} onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div style={styles.mobileMenu}>
              <Link to="/" style={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/about" style={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" style={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link to="/policies" style={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>Policies</Link>
              <hr style={styles.mobileDivider} />
              <Link 
                to="/" 
                style={styles.mobileNavLink} 
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('openLogin'));
                }}
              >
                Login
              </Link>
              <Link 
                to="/" 
                style={styles.mobileNavLink} 
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('openSignup'));
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Page Content */}
        <div style={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerTitle}>♻️ Smart Garbage System</h3>
              <p style={styles.footerText}>IoT-enabled waste management solutions for cleaner, greener cities.</p>
            </div>
            
            <div style={styles.footerSection}>
              <h4 style={styles.footerSubtitle}>Quick Links</h4>
              <Link to="/about" style={styles.footerLink}>About Us</Link>
              <Link to="/contact" style={styles.footerLink}>Contact</Link>
              <Link to="/policies" style={styles.footerLink}>Privacy Policy</Link>
            </div>
            
            <div style={styles.footerSection}>
              <h4 style={styles.footerSubtitle}>Contact</h4>
              <p style={styles.footerText}>📧 info@smartgarbage.com</p>
              <p style={styles.footerText}>📞 +92 300 1234567</p>
              <p style={styles.footerText}>📍 Islamabad, Pakistan</p>
            </div>
          </div>
          
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>© 2024 Smart Garbage System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    color: '#333'
  },
  navbar: {
    background: colors.white,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    padding: '0.5rem 0'
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  logoIcon: {
    fontSize: '2.5rem'
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: colors.gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px'
  },
  desktopMenu: {
    display: 'flex',
    gap: '3rem'
  },
  navLink: {
    textDecoration: 'none',
    color: colors.dark,
    fontWeight: 600,
    transition: 'color 0.3s',
    fontSize: '1.3rem',
    cursor: 'pointer'
  },
  desktopButtons: {
    display: 'flex',
    gap: '1.5rem'
  },
  loginBtn: {
    padding: '0.8rem 2.2rem',
    border: `3px solid ${colors.primary}`,
    borderRadius: '10px',
    background: 'transparent',
    color: colors.primary,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '1.2rem',
    letterSpacing: '0.5px'
  },
  signupBtn: {
    padding: '0.8rem 2.2rem',
    border: 'none',
    borderRadius: '10px',
    background: colors.primary,
    color: colors.white,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '1.2rem',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(0,180,216,0.3)'
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '2.2rem',
    cursor: 'pointer',
    color: colors.dark
  },
  mobileMenu: {
    padding: '1.5rem',
    background: colors.white,
    borderTop: `2px solid ${colors.light}`
  },
  mobileNavLink: {
    display: 'block',
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    color: colors.dark,
    fontSize: '1.3rem',
    fontWeight: 600
  },
  mobileDivider: {
    margin: '1rem 0',
    border: 'none',
    borderTop: `2px solid ${colors.light}`
  },
  pageContent: {
    minHeight: 'calc(100vh - 400px)',
    marginTop: '90px'
  },
  footer: {
    background: colors.dark,
    color: colors.white,
    padding: '4rem 2rem 2rem',
    marginTop: '4rem'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  footerTitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: colors.white,
    fontWeight: 700
  },
  footerSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: colors.white
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.8,
    margin: '0.2rem 0'
  },
  footerLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    margin: '0.3rem 0',
    transition: 'color 0.3s',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  copyright: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1rem'
  }
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .nav-link:hover {
    color: ${colors.primary} !important;
  }
  
  .login-btn:hover {
    background: ${colors.primary} !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,180,216,0.3);
  }
  
  .signup-btn:hover {
    background: ${colors.secondary} !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,119,182,0.3);
  }
  
  .footer-link:hover {
    color: white !important;
  }
  
  @media (max-width: 768px) {
    .desktop-menu, .desktop-buttons {
      display: none !important;
    }
    .mobile-menu-btn {
      display: block !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default App;