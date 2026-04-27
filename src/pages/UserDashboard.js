import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiMapPin, FiClock, FiTrash2, FiCheckCircle } from 'react-icons/fi';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
      if (!userStr) {
        navigate('/');
        return;
      }

      const loggedInUser = JSON.parse(userStr);
      
      // Get workers data from localStorage (admin se assign hoga)
      const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
      setWorkers(storedWorkers);
      
      // Find current user in workers list (by email)
      const workerData = storedWorkers.find(w => w.email === loggedInUser.email);
      
      if (workerData) {
        setUser({
          ...loggedInUser,
          assignedBins: workerData.assignedBins || [],
          area: workerData.area || loggedInUser.area,
          status: workerData.status || 'active'
        });
      } else {
        setUser(loggedInUser);
      }
      
      // Load notifications for this user
      const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${loggedInUser.email}`) || '[]');
      setNotifications(storedNotifications);
      
      setIsLoading(false);
    };
    
    loadUserData();
  }, [navigate]);

  // Show notification when bins are assigned (realtime check)
  useEffect(() => {
    if (!user) return;
    
    // Check for new bin assignments from admin
    const checkNewAssignments = () => {
      const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
      const workerData = storedWorkers.find(w => w.email === user.email);
      
      if (workerData && workerData.assignedBins) {
        const currentBins = user.assignedBins || [];
        const newBins = workerData.assignedBins.filter(bin => !currentBins.includes(bin));
        
        if (newBins.length > 0) {
          // Add notification for new bins
          const newNotification = {
            id: Date.now(),
            message: `📦 New bin${newBins.length > 1 ? 's' : ''} assigned: ${newBins.join(', ')}`,
            time: new Date().toLocaleString(),
            read: false,
            bins: newBins
          };
          
          const updatedNotifications = [newNotification, ...notifications];
          setNotifications(updatedNotifications);
          localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
          
          // Update user with new bins
          setUser({
            ...user,
            assignedBins: workerData.assignedBins
          });
        }
      }
    };
    
    // Check every 5 seconds (realtime)
    const interval = setInterval(checkNewAssignments, 5000);
    return () => clearInterval(interval);
  }, [user, notifications]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  const markNotificationAsRead = (notifId) => {
    const updated = notifications.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify([]));
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>No user found. Please login again.</div>;
  }

  const userBins = (user.assignedBins || []).map(binId => ({
    id: binId,
    ...binDetails[binId]
  })).filter(bin => bin && bin.location);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome, {user.name}! 👋</h1>
          <p style={styles.subtitle}>Sanitation Worker - Sector {user.area || 'Not Assigned'}</p>
        </div>
        <div style={styles.headerActions}>
          {/* Notification Bell */}
          <div style={styles.notificationContainer}>
            <button 
              style={styles.notificationBell}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell size={22} />
              {unreadCount > 0 && (
                <span style={styles.notificationBadge}>{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div style={styles.notificationDropdown}>
                <div style={styles.dropdownHeader}>
                  <h4>Notifications</h4>
                  {notifications.length > 0 && (
                    <button style={styles.clearAllBtn} onClick={clearAllNotifications}>
                      Clear All
                    </button>
                  )}
                </div>
                <div style={styles.notificationList}>
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        style={{...styles.notificationItem, opacity: notif.read ? 0.6 : 1}}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div style={styles.notificationIcon}>📦</div>
                        <div style={styles.notificationContent}>
                          <p style={styles.notificationMessage}>{notif.message}</p>
                          <span style={styles.notificationTime}>{notif.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={styles.noNotifications}>No notifications yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🗑️</div>
          <div>
            <h3 style={styles.statValue}>{userBins.length}</h3>
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
            <h3 style={styles.statValue}>{userBins.length}</h3>
            <p style={styles.statLabel}>Pending Tasks</p>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
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

      {/* Assigned Bins */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>🗑️ My Assigned Bins</h2>
        {userBins.length > 0 ? (
          <div style={styles.binsGrid}>
            {userBins.map(bin => (
              <div key={bin.id} style={styles.binCard}>
                <div style={styles.binHeader}>
                  <span style={styles.binId}>{bin.id}</span>
                  <span style={{
                    ...styles.binStatus,
                    backgroundColor: bin.status === 'Critical' ? '#e74c3c20' : bin.status === 'Warning' ? '#f39c1220' : '#2ecc7120',
                    color: bin.status === 'Critical' ? '#e74c3c' : bin.status === 'Warning' ? '#f39c12' : '#2ecc71'
                  }}>
                    {bin.status === 'Critical' ? '🔴 Critical' : bin.status === 'Warning' ? '⚠️ Warning' : '✓ Normal'}
                  </span>
                </div>
                <p style={styles.binLocation}>
                  <FiMapPin size={14} style={{ marginRight: '4px' }} />
                  {bin.location}
                </p>
                <div style={styles.fillLevelContainer}>
                  <div style={styles.fillLevelBar}>
                    <div style={{...styles.fillLevelFill, width: `${bin.fillLevel}%`, backgroundColor: bin.fillLevel > 80 ? '#e74c3c' : bin.fillLevel > 60 ? '#f39c12' : '#2ecc71'}} />
                  </div>
                  <span style={styles.fillLevelText}>{bin.fillLevel}% full</span>
                </div>
                <div style={styles.binFooter}>
                  <FiClock size={14} />
                  <span>Last: {bin.lastCollected}</span>
                  <button style={styles.collectBtn}>Collect Now</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noData}>No bins assigned yet. Admin will assign bins to you.</p>
        )}
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
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    color: '#023047',
    fontSize: '1.8rem',
    margin: 0
  },
  subtitle: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0 0 0'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  notificationContainer: {
    position: 'relative'
  },
  notificationBell: {
    position: 'relative',
    padding: '0.6rem',
    backgroundColor: '#f5f7fa',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#e74c3c',
    color: 'white',
    fontSize: '0.7rem',
    padding: '0.2rem 0.4rem',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center'
  },
  notificationDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '350px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    marginTop: '0.5rem',
    zIndex: 1000,
    maxHeight: '400px',
    overflow: 'auto'
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white'
  },
  clearAllBtn: {
    background: 'none',
    border: 'none',
    color: '#00b4d8',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  notificationList: {
    padding: '0.5rem 0'
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    padding: '0.8rem 1rem',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  notificationIcon: {
    fontSize: '1.2rem'
  },
  notificationContent: {
    flex: 1
  },
  notificationMessage: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#333'
  },
  notificationTime: {
    fontSize: '0.7rem',
    color: '#999',
    marginTop: '0.2rem',
    display: 'block'
  },
  noNotifications: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    fontSize: '0.85rem'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500
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
  },
  binsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  },
  binCard: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e0e0e0'
  },
  binHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  binId: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#023047'
  },
  binStatus: {
    padding: '0.2rem 0.5rem',
    borderRadius: '5px',
    fontSize: '0.7rem',
    fontWeight: 500
  },
  binLocation: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0 0 0.8rem 0',
    display: 'flex',
    alignItems: 'center'
  },
  fillLevelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.8rem'
  },
  fillLevelBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  fillLevelFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  fillLevelText: {
    fontSize: '0.75rem',
    color: '#666',
    minWidth: '40px'
  },
  binFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.7rem',
    color: '#666'
  },
  collectBtn: {
    marginLeft: 'auto',
    padding: '0.3rem 0.8rem',
    backgroundColor: '#00b4d8',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.7rem',
    cursor: 'pointer'
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666'
  }
};

export default UserDashboard;