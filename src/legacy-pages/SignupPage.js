import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiFileText, FiChevronRight } from 'react-icons/fi';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cnic: '',
    phoneNumber: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    joiningDay: '',
    joiningMonth: '',
    joiningYear: '',
    emergencyPhone: '',
    profilePicture: null,
    employmentDocuments: null,
    password: '',
    confirmPassword: ''
  });

  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [docPreview, setDocPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture' && files[0]) {
      setFormData({ ...formData, profilePicture: files[0] });
      setProfilePicPreview(URL.createObjectURL(files[0]));
    } 
    else if (name === 'employmentDocuments' && files[0]) {
      setFormData({ ...formData, employmentDocuments: files[0] });
      setDocPreview(files[0].name);
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      setIsLoading(false);
      return;
    }

    const cnicRegex = /^\d{13}$/;
    if (!cnicRegex.test(formData.cnic)) {
      alert("Please enter a valid 13-digit CNIC number without dashes");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Please enter a valid Pakistani phone number (03XXXXXXXXX)");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      alert("✅ Registration successful! Please login.");
      navigate('/login');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Enhanced Header */}
      <div style={styles.header}>
        {/* Left Side - Logo & Title */}
        <div style={styles.headerLeft}>
          <span style={styles.logoIcon}>♻️</span>
          <div style={styles.logoContent}>
            <h1 style={styles.logoTitle}>Smart Garbage Monitoring System</h1>
          </div>
        </div>

        {/* Right Side - Back Button */}
        <button 
          onClick={() => navigate('/')} 
          style={styles.backBtn}
        >
          Back to Home
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* Main Container - FULL WIDTH */}
      <div style={styles.mainContainer}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Create Your Account</h2>
          <p style={styles.formSubtitle}>Join our team and start managing garbage bins efficiently</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Row 1: Name & Email */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Row 2: CNIC & Phone */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>CNIC Number</label>
                <input
                  type="text"
                  name="cnic"
                  placeholder="13 digits (no dashes)"
                  value={formData.cnic}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="03001234567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth</label>
              <div style={styles.dateRow}>
                <select name="dobDay" value={formData.dobDay} onChange={handleChange} style={styles.dateSelect} required disabled={isLoading}>
                  <option value="">Day</option>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
                <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} style={styles.dateSelect} required disabled={isLoading}>
                  <option value="">Month</option>
                  {months.map((m, i) => <option key={m} value={(i+1).toString().padStart(2, '0')}>{m}</option>)}
                </select>
                <select name="dobYear" value={formData.dobYear} onChange={handleChange} style={styles.dateSelect} required disabled={isLoading}>
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Joining Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Joining Date</label>
              <div style={styles.dateRow}>
                <select name="joiningDay" value={formData.joiningDay} onChange={handleChange} style={styles.dateSelect} required disabled={isLoading}>
                  <option value="">Day</option>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
                <select name="joiningMonth" value={formData.joiningMonth} onChange={handleChange} style={styles.dateSelect} required disabled={isLoading}>
                  <option value="">Month</option>
                  {months.map((m, i) => <option key={m} value={(i+1).toString().padStart(2, '0')}>{m}</option>)}
                </select>
                <select name="joiningYear" value={formData.joiningYear} onChange={handleChange} style={styles.dateSelect} required disabled={isLoading}>
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Emergency Phone */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Emergency Phone Number</label>
              <input
                type="tel"
                name="emergencyPhone"
                placeholder="03001234567"
                value={formData.emergencyPhone}
                onChange={handleChange}
                style={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            {/* Profile Picture */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Profile Picture</label>
              <div style={styles.uploadBox}>
                {profilePicPreview ? (
                  <div style={styles.uploadPreview}>
                    <img src={profilePicPreview} alt="Profile" style={styles.previewImg} />
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({...formData, profilePicture: null});
                        setProfilePicPreview('');
                      }}
                      style={styles.removeBtn}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadLabel}>
                    <FiUpload size={24} />
                    <span>Click to upload photo</span>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleChange}
                      style={{display: 'none'}}
                      required
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Employment Documents */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Employment Documents</label>
              <div style={styles.uploadBox}>
                {docPreview ? (
                  <div style={styles.docPreview}>
                    <FiFileText size={20} />
                    <span>{docPreview}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({...formData, employmentDocuments: null});
                        setDocPreview('');
                      }}
                      style={styles.removeBtn}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadLabel}>
                    <FiUpload size={24} />
                    <span>Upload your documents</span>
                    <input
                      type="file"
                      name="employmentDocuments"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      style={{display: 'none'}}
                      required
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  minLength="8"
                  disabled={isLoading}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Creating Account...' : '✓ Create Account'}
            </button>

            {/* Login Link */}
            <p style={styles.loginPrompt}>
              Already have an account? 
              <button 
                type="button"
                onClick={() => navigate('/login')}
                style={styles.loginLink}
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        input:focus, select:focus {
          border-color: #00b4d8 !important;
          box-shadow: 0 0 0 3px rgba(0,180,216,0.1) !important;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: linear-gradient(135deg, #0077b6 0%, #005a87 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,180,216,0.4) !important;
        }

        button.backBtn:hover {
          background: #f5f7fa !important;
          transform: translateX(4px);
        }
        
        @media (max-width: 768px) {
          div[style*="header"] {
            flex-direction: column !important;
            gap: 1rem !important;
            padding: 1rem !important;
          }
          div[style*="headerLeft"] {
            width: 100% !important;
          }
          button[style*="backBtn"] {
            width: 100% !important;
            justify-content: center !important;
          }
          div[style*="formRow"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="mainContainer"] {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
    display: 'flex',
    flexDirection: 'column'
  },

  /* Enhanced Header */
  header: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fbfc 100%)',
    borderBottom: '2px solid #e8ecf1',
    padding: '1.2rem 2.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    flex: 1
  },

  logoIcon: {
    fontSize: '2.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  logoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },

  logoTitle: {
    fontSize: '1.5rem',
    color: '#023047',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.5px'
  },

  logoSubtitle: {
    fontSize: '0.8rem',
    color: '#00b4d8',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.3px'
  },

  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'white',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)',
    whiteSpace: 'nowrap'
  },

  /* Main Container - FULL WIDTH */
  mainContainer: {
    flex: 1,
    padding: '2.5rem 1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  },

  formBox: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e8ecf1',
    width: '100%',
    maxWidth: '900px'
  },

  formTitle: {
    fontSize: '1.8rem',
    color: '#023047',
    fontWeight: '800',
    margin: '0 0 0.5rem 0'
  },

  formSubtitle: {
    fontSize: '0.95rem',
    color: '#666',
    margin: '0 0 1.5rem 0'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#023047'
  },

  input: {
    padding: '0.8rem 1rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  },

  dateRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.8rem'
  },

  dateSelect: {
    padding: '0.8rem',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },

  uploadBox: {
    border: '2px dashed #00b4d8',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 180, 216, 0.03)',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    padding: 0
  },

  uploadPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%'
  },

  previewImg: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #00b4d8'
  },

  docPreview: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem',
    background: '#f5f7fa',
    borderRadius: '8px',
    width: '100%',
    color: '#023047',
    fontWeight: '500'
  },

  removeBtn: {
    padding: '0.5rem 1rem',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },

  submitBtn: {
    padding: '1rem',
    background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)'
  },

  loginPrompt: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
    margin: '1rem 0 0 0'
  },

  loginLink: {
    background: 'none',
    border: 'none',
    color: '#00b4d8',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '0.3rem',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    padding: 0
  }
};

export default SignupPage;