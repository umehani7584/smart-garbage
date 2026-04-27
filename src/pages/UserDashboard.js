import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Bin details data
  const binDetails = {
    "BIN-001": { location: "Street 5, Sector F-7/1", fillLevel: 85, status: "Warning", lastCollected: "2 hours ago" },
    "BIN-002": { location: "Park Road, Sector F-7/2", fillLevel: 45, status: "Normal", lastCollected: "5 hours ago" },
    "BIN-003": { location: "Market Area, Sector F-8/1", fillLevel: 95, status: "Critical", lastCollected: "1 hour ago" },
    "BIN-004": { location: "School Road, Sector F-8/2", fillLevel: 20, status: "Normal", lastCollected: "3 hours ago" },
    "BIN-005": { location: "Hospital Road, Sector G-11/1", fillLevel: 70, status: "Warning", lastCollected: "4 hours ago" },
    "BIN-006": { location: "Main Boulevard, Sector G-11/2", fillLevel: 30, status: "Normal", lastCollected: "6 hours ago" },
    "BIN-007": { location: "Community Center, Sector H-12/1", fillLevel: 55, status: "Warning", lastCollected: "3 hours ago" },
    "BIN-008": { location: "University Road, Sector H-12/2", fillLevel: 25, status: "Normal", lastCollected: "7 hours ago" },
    "BIN-009": { location: "Sports Complex, Sector I-14/1", fillLevel: 80, status: "Warning", lastCollected: "2 hours ago" },
    "BIN-010": { location: "Shopping Mall, Sector I-14/2", fillLevel: 60, status: "Warning", lastCollected: "4 hours ago" }
  };

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      // Get logged-in user from localStorage
      const userStr = localStorage.getItem('currentUser');
      console.log('localStorage user:', userStr);
      
      if (!userStr) {
        console.log('No user found in localStorage, redirecting to home');
        navigate('/');
        return;
      }

      const loggedInUser = JSON.parse(userStr);
      console.log('Logged in user email:', loggedInUser.email);
      
      try {
        // Load CSV file
        const response = await fetch('/data/users.csv');
        const csvText = await response.text();
        console.log('CSV loaded, length:', csvText.length);
        
        const rows = csvText.split('\n');
        console.log('Total rows:', rows.length);
        
        let foundUser = null;
        
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (row === '') continue;
          
          const cols = row.split(',');
          const email = cols[2]?.trim();
          console.log(`Row ${i}: email = "${email}"`);
          
          if (email === loggedInUser.email) {
            console.log('User found!');
            foundUser = {
              id: parseInt(cols[0]),
              name: cols[1]?.trim(),
              email: email,
              password: cols[3]?.trim(),
              role: cols[4]?.trim(),
              area: cols[5]?.trim(),
              assigned_bins: cols[6]?.trim() ? cols[6].trim().replace(/"/g, '').split(',') : []
            };
            break;
          }
        }
        
        if (foundUser) {
          console.log('Setting user:', foundUser.name);
          setUser(foundUser);
        } else {
          console.log('User not found in CSV, using localStorage user');
          setUser(loggedInUser);
        }
      } catch (error) {
        console.error('Error loading CSV:', error);
        setUser(loggedInUser);
      }
      
      setIsLoading(false);
    };
    
    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>No user found. Please login again.</div>;
  }

  const userBins = (user.assigned_bins || []).map(binId => ({
    id: binId,
    ...binDetails[binId]
  })).filter(bin => bin && bin.location);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome, {user.name}! 👋</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🗑️</div>
          <div>
            <h3 style={styles.statValue}>{user.assigned_bins?.length || 0}</h3>
            <p style={styles.statLabel}>Assigned Bins</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📍</div>
          <div>
            <h3 style={styles.statValue}>Sector {user.area || 'N/A'}</h3>
            <p style={styles.statLabel}>Working Area</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div>
            <h3 style={styles.statValue}>0</h3>
            <p style={styles.statLabel}>Completed Today</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <h3 style={styles.statValue}>{user.assigned_bins?.length || 0}</h3>
            <p style={styles.statLabel}>Pending Tasks</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📋 User Information</h2>
        <div style={styles.infoRow}><strong>Name:</strong> {user.name}</div>
        <div style={styles.infoRow}><strong>Email:</strong> {user.email}</div>
        <div style={styles.infoRow}><strong>Area:</strong> Sector {user.area || 'Not Assigned'}</div>
        <div style={styles.infoRow}><strong>Role:</strong> {user.role === 'admin' ? 'Administrator' : 'Sanitation Worker'}</div>
        <div style={styles.infoRow}><strong>Assigned Bins:</strong> {user.assigned_bins?.join(', ') || 'None'}</div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🗑️ Assigned Bins Details</h2>
        {userBins.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Bin ID</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Fill Level</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Last Collected</th>
              </tr>
            </thead>
            <tbody>
              {userBins.map(bin => (
                <tr key={bin.id}>
                  <td style={styles.td}><strong>{bin.id}</strong></td>
                  <td style={styles.td}>{bin.location}</td>
                  <td style={styles.td}>
                    <div style={styles.fillLevelBar}>
                      <div style={{...styles.fillLevelFill, width: `${bin.fillLevel}%`, backgroundColor: bin.fillLevel > 80 ? '#e74c3c' : bin.fillLevel > 60 ? '#f39c12' : '#2ecc71'}} />
                    </div>
                    <span>{bin.fillLevel}%</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: bin.status === 'Critical' ? '#e74c3c20' : bin.status === 'Warning' ? '#f39c1220' : '#2ecc7120',
                      color: bin.status === 'Critical' ? '#e74c3c' : bin.status === 'Warning' ? '#f39c12' : '#2ecc71'
                    }}>
                      {bin.status}
                    </span>
                  </td>
                  <td style={styles.td}>{bin.lastCollected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noData}>No bins assigned yet.</p>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📅 Today's Schedule</h2>
        <div style={styles.scheduleList}>
          <div style={styles.scheduleItem}>
            <div style={styles.scheduleTime}>08:00 AM</div>
            <div style={styles.scheduleTask}>Morning Collection - Sector {user.area}</div>
            <span style={styles.completedBadge}>Completed</span>
          </div>
          <div style={styles.scheduleItem}>
            <div style={styles.scheduleTime}>10:30 AM</div>
            <div style={styles.scheduleTask}>Market Area Collection - Sector {user.area}</div>
            <span style={styles.progressBadge}>In Progress</span>
          </div>
          <div style={styles.scheduleItem}>
            <div style={styles.scheduleTime}>01:00 PM</div>
            <div style={styles.scheduleTask}>School Road Collection - Sector {user.area}</div>
            <span style={styles.pendingBadge}>Pending</span>
          </div>
          <div style={styles.scheduleItem}>
            <div style={styles.scheduleTime}>03:30 PM</div>
            <div style={styles.scheduleTask}>Hospital Road Collection - Sector {user.area}</div>
            <span style={styles.pendingBadge}>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '100px auto 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: '#023047'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  title: {
    color: '#023047',
    fontSize: '1.8rem',
    margin: 0
  },
  logoutBtn: {
    padding: '0.6rem 1.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.2rem',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  statIcon: {
    fontSize: '2rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#023047',
    margin: 0
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#666',
    margin: 0
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    marginBottom: '2rem'
  },
  sectionTitle: {
    color: '#023047',
    fontSize: '1.2rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #00b4d8',
    paddingBottom: '0.5rem'
  },
  infoRow: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #f0f0f0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '0.8rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #00b4d8'
  },
  td: {
    padding: '0.8rem',
    borderBottom: '1px solid #f0f0f0'
  },
  fillLevelBar: {
    width: '80px',
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'inline-block',
    marginRight: '0.5rem'
  },
  fillLevelFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  statusBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    fontSize: '0.75rem',
    fontWeight: 500
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem'
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  scheduleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.8rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  scheduleTime: {
    fontWeight: 600,
    color: '#023047',
    minWidth: '80px'
  },
  scheduleTask: {
    flex: 1,
    color: '#666'
  },
  completedBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    fontSize: '0.7rem',
    backgroundColor: '#2ecc7120',
    color: '#2ecc71'
  },
  progressBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    fontSize: '0.7rem',
    backgroundColor: '#f39c1220',
    color: '#f39c12'
  },
  pendingBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    fontSize: '0.7rem',
    backgroundColor: '#95a5a620',
    color: '#7f8c8d'
  }
};

export default UserDashboard;