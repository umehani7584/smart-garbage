import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginCard({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const navigate = useNavigate();

  // ✅ Helper: Parse CSV line properly
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let foundUser = null;

      // ✅ FIX 1: Check CSV first
      try {
        const response = await fetch('/data/users.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(l => l.trim());

        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          const userEmail = cols[2] ? cols[2].trim().replace(/"/g, '') : '';
          const userPassword = cols[3] ? cols[3].trim().replace(/"/g, '') : '';

          if (userEmail === email && userPassword === password) {
            foundUser = {
              id: parseInt(cols[0]) || i,
              name: cols[1] ? cols[1].trim() : 'User',
              email: userEmail,
              password: userPassword,
              role: cols[4] ? cols[4].trim() : 'user',
              area: cols[5] ? cols[5].trim() : 'Unknown',
              assigned_bins: []
            };
            break;
          }
        }
      } catch (csvError) {
        console.log('CSV login attempt failed, checking localStorage...');
      }

      // ✅ FIX 2: If not found in CSV, check localStorage (localWorkers)
      if (!foundUser) {
        const localWorkers = JSON.parse(localStorage.getItem('localWorkers') || '[]');
        for (let worker of localWorkers) {
          if (worker.email === email && worker.password === password) {
            foundUser = {
              id: worker.id,
              name: worker.name,
              email: worker.email,
              password: worker.password,
              role: worker.role,
              area: worker.area,
              assigned_bins: worker.assigned_bins || []
            };
            break;
          }
        }
      }

      if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        localStorage.setItem('user', JSON.stringify(foundUser));
        onClose();

        if (foundUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to login. Please try again later.');
    }

    setLoading(false);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail.trim() === '') return;
    setForgotMsg(`A password reset link has been sent to ${forgotEmail}. Please check your inbox.`);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>

        {/* ── FORGOT PASSWORD VIEW ── */}
        {showForgot ? (
          <>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🔑</span>
              <h2 style={styles.title}>Forgot Password</h2>
            </div>
            <p style={styles.subtitle}>Enter your email to reset your password</p>

            {forgotMsg ? (
              <div style={styles.successBox}>
                <span>✅</span>
                <span>{forgotMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={styles.input}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" style={styles.submitBtn}>
                  Send Reset Link
                </button>
              </form>
            )}

            <div style={styles.footer}>
              <button onClick={() => { setShowForgot(false); setForgotMsg(''); setForgotEmail(''); }} style={styles.linkBtn}>
                ← Back to Login
              </button>
            </div>
          </>
        ) : (

        /* ── NORMAL LOGIN VIEW ── */
        <>
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
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={styles.forgotBtn}
              >
                Forgot Password?
              </button>
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
        </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  card: { background: '#ffffff', padding: '2rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '420px', position: 'relative' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' },
  logo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', marginTop: '0.5rem' },
  logoIcon: { fontSize: '2rem' },
  title: { fontSize: '1.5rem', color: '#023047', margin: 0 },
  subtitle: { fontSize: '0.9rem', color: '#666', textAlign: 'center', marginBottom: '1.5rem' },
  errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' },
  errorIcon: { fontSize: '1rem' },
  successBox: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#023047' },
  input: { padding: '0.7rem 1rem', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '0.95rem', outline: 'none' },
  submitBtn: { padding: '0.8rem', background: '#00b4d8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
  forgotBtn: { background: 'none', border: 'none', color: '#00b4d8', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, textAlign: 'right', padding: 0, marginTop: '2px', alignSelf: 'flex-end' },
  footer: { marginTop: '1.2rem', textAlign: 'center' },
  footerText: { fontSize: '0.85rem', color: '#666' },
  linkBtn: { background: 'none', border: 'none', color: '#00b4d8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }
};

export default LoginCard;