import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiCalendar, FiUpload, FiFileText } from 'react-icons/fi';

function SignupCard({ onClose, onSwitchToLogin }) {
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
  const navigate = useNavigate();

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

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
    
    // Validation
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

    // Simulate signup delay
    setTimeout(() => {
      alert("✅ Registration successful! Please login.");
      onClose();
      if (onSwitchToLogin) {
        onSwitchToLogin();
      } else {
        window.dispatchEvent(new CustomEvent('openLogin'));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    onClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      window.dispatchEvent(new CustomEvent('openLogin'));
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={{...styles.card, maxWidth: '700px'}}>
        <button onClick={onClose} style={styles.closeBtn} disabled={isLoading}>✕</button>
        
        <div style={styles.content}>
          <p style={styles.welcomeBack}>👷 Join Our Team</p>
          <h2 style={styles.heading}>Worker Registration</h2>
          <p style={styles.subheading}>Fill your details to become part of Smart Garbage System</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Personal Information */}
            <h3 style={styles.sectionTitle}>
              <FiUser style={styles.sectionIcon} /> Personal Information
            </h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name *</label>
              <div style={styles.inputWrapper}>
                <FiUser style={styles.inputIcon} />
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
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address *</label>
              <div style={styles.inputWrapper}>
                <FiMail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="worker@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>CNIC Number *</label>
              <div style={styles.inputWrapper}>
                <FiFileText style={styles.inputIcon} />
                <input
                  type="text"
                  name="cnic"
                  placeholder="1234512345671 (13 digits)"
                  value={formData.cnic}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
              <small style={styles.hint}>13 digits without dashes</small>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number *</label>
              <div style={styles.inputWrapper}>
                <FiPhone style={styles.inputIcon} />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="03XXXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Birth *</label>
              <div style={styles.dateRow}>
                <div style={styles.dateWrapper}>
                  <FiCalendar style={styles.dateIcon} />
                  <select
                    name="dobDay"
                    value={formData.dobDay}
                    onChange={handleChange}
                    style={styles.dateSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.dateWrapper}>
                  <select
                    name="dobMonth"
                    value={formData.dobMonth}
                    onChange={handleChange}
                    style={styles.dateSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={month} value={(index + 1).toString().padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.dateWrapper}>
                  <select
                    name="dobYear"
                    value={formData.dobYear}
                    onChange={handleChange}
                    style={styles.dateSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <h3 style={styles.sectionTitle}>
              <FiFileText style={styles.sectionIcon} /> Employment Details
            </h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Joining Date *</label>
              <div style={styles.dateRow}>
                <div style={styles.dateWrapper}>
                  <FiCalendar style={styles.dateIcon} />
                  <select
                    name="joiningDay"
                    value={formData.joiningDay}
                    onChange={handleChange}
                    style={styles.dateSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.dateWrapper}>
                  <select
                    name="joiningMonth"
                    value={formData.joiningMonth}
                    onChange={handleChange}
                    style={styles.dateSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                      <option key={month} value={(index + 1).toString().padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.dateWrapper}>
                  <select
                    name="joiningYear"
                    value={formData.joiningYear}
                    onChange={handleChange}
                    style={styles.dateSelect}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <h3 style={styles.sectionTitle}>
              <FiPhone style={styles.sectionIcon} /> Emergency Contact
            </h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Emergency Phone Number *</label>
              <div style={styles.inputWrapper}>
                <FiPhone style={styles.inputIcon} />
                <input
                  type="tel"
                  name="emergencyPhone"
                  placeholder="03XXXXXXXXX"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Documents Upload */}
            <h3 style={styles.sectionTitle}>
              <FiUpload style={styles.sectionIcon} /> Documents Upload
            </h3>

            <div style={styles.uploadGroup}>
              <label style={styles.label}>Profile Picture *</label>
              <div style={styles.uploadBox}>
                {profilePicPreview ? (
                  <div style={styles.previewContainer}>
                    <img src={profilePicPreview} alt="Profile Preview" style={styles.previewImage} />
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData({...formData, profilePicture: null});
                        setProfilePicPreview('');
                      }}
                      style={styles.removeBtn}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadLabel}>
                    <FiUpload style={styles.uploadIcon} />
                    <span style={styles.uploadText}>Click to upload profile picture</span>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleChange}
                      style={styles.fileInput}
                      required
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>
            </div>

            <div style={styles.uploadGroup}>
              <label style={styles.label}>Employment Verification Documents *</label>
              <div style={styles.uploadBox}>
                {docPreview ? (
                  <div style={styles.docPreview}>
                    <FiFileText style={styles.docIcon} />
                    <span style={styles.docName}>{docPreview}</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData({...formData, employmentDocuments: null});
                        setDocPreview('');
                      }}
                      style={styles.removeBtn}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadLabel}>
                    <FiUpload style={styles.uploadIcon} />
                    <span style={styles.uploadText}>Upload CNIC Copy, Experience Letters, etc.</span>
                    <input
                      type="file"
                      name="employmentDocuments"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      style={styles.fileInput}
                      required
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>
              <small style={styles.hint}>Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)</small>
            </div>

            {/* Account Security */}
            <h3 style={styles.sectionTitle}>🔐 Account Security</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password *</label>
              <div style={styles.inputWrapper}>
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
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <div style={styles.inputWrapper}>
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

            <button 
              type="submit" 
              style={{
                ...styles.signupBtn,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register as Worker'} 
              {!isLoading && <span style={styles.arrow}>→</span>}
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account?{' '}
            <a 
              href="#" 
              onClick={handleLoginClick}
              style={styles.link}
            >
              Login
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
    animation: 'fadeIn 0.3s ease',
    overflow: 'auto',
    padding: '1rem'
  },
  card: {
    background: '#ffffff',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: '20px',
    position: 'relative',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    animation: 'slideUp 0.4s ease'
  },
  closeBtn: {
    position: 'sticky',
    top: '15px',
    right: '20px',
    float: 'right',
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
    padding: '2.5rem',
    clear: 'both'
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
    fontSize: '2rem',
    marginBottom: '0.3rem',
    fontWeight: 700
  },
  subheading: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '2rem'
  },
  sectionTitle: {
    color: '#023047',
    fontSize: '1.2rem',
    marginTop: '1.5rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #00b4d8',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  sectionIcon: {
    color: '#00b4d8',
    fontSize: '1.2rem'
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
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#00b4d8',
    fontSize: '1.1rem'
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.5rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s',
    outline: 'none',
    fontFamily: 'inherit'
  },
  hint: {
    color: '#666',
    fontSize: '0.8rem',
    marginTop: '0.2rem'
  },
  dateRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.5rem'
  },
  dateWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  dateIcon: {
    position: 'absolute',
    left: '10px',
    color: '#00b4d8',
    fontSize: '1rem',
    zIndex: 1
  },
  dateSelect: {
    width: '100%',
    padding: '0.8rem 0.5rem 0.8rem 2rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    appearance: 'none',
    fontFamily: 'inherit'
  },
  uploadGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  uploadBox: {
    border: '2px dashed #00b4d8',
    borderRadius: '10px',
    padding: '1rem',
    textAlign: 'center',
    backgroundColor: 'rgba(0,180,216,0.05)',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    width: '100%'
  },
  uploadIcon: {
    fontSize: '2rem',
    color: '#00b4d8'
  },
  uploadText: {
    color: '#666',
    fontSize: '0.9rem'
  },
  fileInput: {
    display: 'none'
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  previewImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #00b4d8'
  },
  docPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '100%'
  },
  docIcon: {
    fontSize: '1.5rem',
    color: '#00b4d8'
  },
  docName: {
    color: '#023047',
    fontSize: '0.9rem',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  removeBtn: {
    padding: '0.3rem 0.8rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  signupBtn: {
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
    marginTop: '2rem',
    width: '100%'
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

// Add animations and hover effects
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
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,180,216,0.3);
  }
  
  button:hover:not(:disabled) .arrow {
    transform: translateX(5px);
  }
  
  input:focus, select:focus {
    border-color: #00b4d8 !important;
    box-shadow: 0 0 0 3px rgba(0,180,216,0.1);
  }
  
  .close-btn:hover:not(:disabled) {
    background: #f0f0f0 !important;
    color: #023047 !important;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  .remove-btn:hover:not(:disabled) {
    background-color: #cc0000 !important;
  }
  
  @media (max-width: 600px) {
    .date-row {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default SignupCard;