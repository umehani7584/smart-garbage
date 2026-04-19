import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShield } from 'react-icons/fi';

function LoginCard({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('worker'); // 'worker' or 'admin'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      // Simple validation - kuch bhi email/password kaam karega
      if (email && password) {
        // ✅ ROLE-BASED REDIRECTION - Yeh wala code
        if (selectedRole === 'admin') {
          console.log('Redirecting to Admin Dashboard');
          navigate('/admin-dashboard');  // Team member ka admin dashboard
        } else {
          console.log('Redirecting to User Dashboard');
          navigate('/user-dashboard');    // Aapka user dashboard
        }
        onClose();
      } else {
        alert('Please enter email and password');
      }
      setIsLoading(false);
    }, 1000);
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
        <button onClick={onClose} style={styles.closeBtn} disabled={isLoading}>✕</button>
        
        <div style={styles.content}>
          <p style={styles.welcomeBack}>Welcome back! 👋</p>
          <h2 style={styles.heading}>Login</h2>
          <p style={styles.subheading}>Sign in to continue</p>

          {/* Role Selection Buttons */}
          <div style={styles.roleContainer}>
            <button
              type="button"
              onClick={() => setSelectedRole('worker')}
              style={{
                ...styles.roleBtn,
                backgroundColor: selectedRole === 'worker' ? '#00b4d8' : 'white',
                color: selectedRole === 'worker' ? 'white' : '#666',
                borderColor: selectedRole === 'worker' ? '#00b4d8' : '#e0e0e0'
              }}
              disabled={isLoading}
            >
              <FiUser style={styles.roleIcon} />
              <span style={styles.roleText}>Login as Worker</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              style={{
                ...styles.roleBtn,
                backgroundColor: selectedRole === 'admin' ? '#00b4d8' : 'white',
                color: selectedRole === 'admin' ? 'white' : '#666',
                borderColor: selectedRole === 'admin' ? '#00b4d8' : '#e0e0e0'
              }}
              disabled={isLoading}
            >
              <FiShield style={styles.roleIcon} />
              <span style={styles.roleText}>Login as Admin</span>
            </button>
          </div>

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
                disabled={isLoading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.passwordInput}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordBtn}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.loginBtn,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : `Login as ${selectedRole === 'admin' ? 'Admin' : 'Worker'}`} 
              {!isLoading && <span style={styles.arrow}>→</span>}
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
    transition: 'all 0.3s',
    zIndex: 10
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
    marginBottom: '1rem',
    fontWeight: 700
  },
  subheading: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  },
  roleContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  roleBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    border: '2px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    background: 'white'
  },
  roleIcon: {
    fontSize: '1.8rem'
  },
  roleText: {
    fontSize: '0.9rem',
    fontWeight: 600
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
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  passwordInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    paddingRight: '3rem'
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#666',
    padding: '0.3rem'
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
  
  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.3);
  }
  
  .login-btn:hover:not(:disabled) .arrow {
    transform: translateX(5px);
  }
  
  input:focus {
    border-color: #00b4d8 !important;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.1);
  }
  
  .close-btn:hover:not(:disabled) {
    background: #f0f0f0;
    color: #023047;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  .role-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,180,216,0.2);
  }
  
  .show-password-btn:hover:not(:disabled) {
    color: #00b4d8;
  }
`;
document.head.appendChild(styleSheet);

export default LoginCard;