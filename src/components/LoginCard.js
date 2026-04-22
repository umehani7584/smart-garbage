import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUserWithLocal } from '../utils/csvParser';

function LoginCard({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // CSV + LocalStorage se user authenticate karo
    const user = await loginUserWithLocal(email, password);

    if (user) {
      // Login successful
      localStorage.setItem('user', JSON.stringify(user));
      
      // Close the popup
      onClose();
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeBtn}>✕</button>

        <div style={styles.logo}>
          <span style={styles.logoIcon}>♻️</span>
          <h2 style={styles.title}>Welcome Back</h2>
        </div>
        
        <p style={styles.subtitle}>Login to your account</p>
        
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} style={styles.linkBtn}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    animation: 'fadeIn 0.3s ease'
  },
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    animation: 'slideUp 0.3s ease'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#666',
    transition: 'color 0.3s'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    marginTop: '0.5rem'
  },
  logoIcon: {
    fontSize: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#023047',
    margin: 0
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem'
  },
  errorIcon: {
    fontSize: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#023047'
  },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  submitBtn: {
    padding: '0.8rem',
    background: '#00b4d8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '0.5rem'
  },
  footer: {
    marginTop: '1.2rem',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '0.85rem',
    color: '#666'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#00b4d8',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600
  }
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  input:focus {
    border-color: #00b4d8 !important;
  }
  
  .submit-btn:hover {
    background: #0077b6 !important;
  }
  
  .close-btn:hover {
    color: #e74c3c !important;
  }
`;
document.head.appendChild(styleSheet);

export default LoginCard;