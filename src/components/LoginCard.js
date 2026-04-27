import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    try {
      const response = await fetch('/data/users.csv');
      const csvText = await response.text();
      const rows = csvText.split('\n');
      let foundUser = null;
      
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (row === '') continue;
        
        const cols = row.split(',');
        const userEmail = cols[2] ? cols[2].trim().replace(/"/g, '') : '';
        const userPassword = cols[3] ? cols[3].trim().replace(/"/g, '') : '';
        
        if (userEmail === email && userPassword === password) {
          foundUser = {
            id: parseInt(cols[0]) || i,
            name: cols[1] ? cols[1].trim() : 'User',
            email: userEmail,
            role: cols[4] ? cols[4].trim() : 'user',
            area: cols[5] ? cols[5].trim() : 'Unknown',
            assigned_bins: []
          };
          break;
        }
      }
      
      if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        localStorage.setItem('user', JSON.stringify(foundUser));
        onClose();
        
        // ✅ FIX: Use navigate instead of window.location
        if (foundUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('CSV load error:', err);
      setError('Unable to login. Please try again later.');
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
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
    zIndex: 2000
  },
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#666'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    marginTop: '0.5rem'
  },
  logoIcon: { fontSize: '2rem' },
  title: { fontSize: '1.5rem', color: '#023047', margin: 0 },
  subtitle: { fontSize: '0.9rem', color: '#666', textAlign: 'center', marginBottom: '1.5rem' },
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
  errorIcon: { fontSize: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#023047' },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '0.95rem',
    outline: 'none'
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
    marginTop: '0.5rem'
  },
  footer: { marginTop: '1.2rem', textAlign: 'center' },
  footerText: { fontSize: '0.85rem', color: '#666' },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#00b4d8',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600
  }
};

export default LoginCard;