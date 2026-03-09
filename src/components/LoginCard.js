import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginCard({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    // Yahan login logic ayega
    navigate('/user-dashboard');
    onClose();
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    onClose();
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      window.dispatchEvent(new CustomEvent('openSignup'));
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        
        <div style={styles.content}>
          <p style={styles.welcomeBack}>Welcome back! 👋</p>
          <h2 style={styles.heading}>Login</h2>
          <p style={styles.subheading}>Sign in to continue</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.loginBtn}>
              Login <span style={styles.arrow}>→</span>
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{' '}
            <a 
              href="#" 
              onClick={handleSignupClick}
              style={styles.link}
            >
              Sign up
            </a>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
    animation: 'fadeIn 0.3s ease'
  },
  card: {
    background: '#ffffff',
    width: '90%',
    maxWidth: '450px',
    borderRadius: '20px',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    animation: 'slideUp 0.4s ease'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.3s'
  },
  content: {
    padding: '2.5rem'
  },
  welcomeBack: {
    color: '#00b4d8',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    fontWeight: 500,
    letterSpacing: '0.5px'
  },
  heading: {
    color: '#023047',
    fontSize: '2.2rem',
    marginBottom: '0.3rem',
    fontWeight: 700
  },
  subheading: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    color: '#023047',
    fontSize: '0.9rem',
    fontWeight: 600
  },
  input: {
    padding: '0.8rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    width: '100%'
  },
  loginBtn: {
    background: '#00b4d8',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s',
    marginTop: '1rem'
  },
  arrow: {
    transition: 'transform 0.3s',
    fontSize: '1.2rem'
  },
  footerText: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#666',
    fontSize: '0.95rem'
  },
  link: {
    color: '#00b4d8',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 0.3s'
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
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.3);
  }
  
  .login-btn:hover .arrow {
    transform: translateX(5px);
  }
  
  input:focus {
    border-color: #00b4d8 !important;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.1);
  }
  
  .close-btn:hover {
    background: #f0f0f0;
    color: #023047;
  }
  
  a:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(styleSheet);

export default LoginCard;