import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBell, FiLogOut, FiMapPin, FiClock, FiTrash2, FiAlertCircle,
  FiHome, FiCalendar, FiUser, FiSettings, FiBarChart2, FiMail, FiPhone, FiBriefcase, FiMap
} from 'react-icons/fi';
import { useRealTimeData } from '../hooks/useRealTimeData';

function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertedBins, setAlertedBins] = useState([]);
  const navigate = useNavigate();

  const { binsData, loading: binsLoading } = useRealTimeData();

  const binLocations = {
    "BIN-001": { location: "Street 5, Sector F-7/1", area: "F-7" },
    "BIN-002": { location: "Park Road, Sector F-7/2", area: "F-7" },
    "BIN-003": { location: "Market Area, Sector F-8/1", area: "F-8" },
    "BIN-004": { location: "School Road, Sector F-8/2", area: "F-8" },
    "BIN-005": { location: "Hospital Road, Sector G-11/1", area: "G-11" },
    "BIN-006": { location: "Main Boulevard, Sector G-11/2", area: "G-11" },
    "BIN-007": { location: "Community Center, Sector H-12/1", area: "H-12" },
    "BIN-008": { location: "University Road, Sector H-12/2", area: "H-12" },
    "BIN-009": { location: "Sports Complex, Sector I-14/1", area: "I-14" },
    "BIN-010": { location: "Shopping Mall, Sector I-14/2", area: "I-14" }
  };

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        navigate('/');
        return;
      }

      const loggedInUser = JSON.parse(userStr);
      
      const savedAssignments = JSON.parse(localStorage.getItem('workerAssignments') || '{}');
      const userAssignments = savedAssignments[loggedInUser.id] || [];
      
      if (userAssignments.length > 0 && (!loggedInUser.assigned_bins || loggedInUser.assigned_bins.length === 0)) {
        loggedInUser.assigned_bins = userAssignments;
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      }
      
      setUser(loggedInUser);
      
      const storedNotif = JSON.parse(localStorage.getItem(`notifications_${loggedInUser.email}`) || '[]');
      setNotifications(storedNotif);
      
      setIsLoading(false);
    };
    
    loadUserData();
  }, [navigate]);

  // Real-time critical bin alert check
  useEffect(() => {
    if (!user || binsLoading || binsData.length === 0) return;

    const userBinIds = user.assigned_bins || [];
    if (userBinIds.length === 0) return;

    binsData.forEach(bin => {
      if (userBinIds.includes(bin.id)) {
        const isCritical = bin.fillLevel > 90;
        const alreadyAlerted = alertedBins.includes(bin.id);
        
        if (isCritical && !alreadyAlerted) {
          const binInfo = binLocations[bin.id] || { location: bin.location || 'Unknown', area: 'N/A' };
          const alertMessage = `🔴 CRITICAL ALERT: Bin ${bin.id} at ${binInfo.location} is ${bin.fillLevel.toFixed(0)}% full! Immediate action required.`;
          
          setToastNotification(alertMessage);
          setTimeout(() => setToastNotification(null), 8000);
          
          const newNotification = {
            id: Date.now(),
            message: alertMessage,
            time: new Date().toLocaleString(),
            read: false,
            binId: bin.id,
            type: 'critical',
            fillLevel: bin.fillLevel
          };
          
          const updatedNotifs = [newNotification, ...notifications];
          setNotifications(updatedNotifs);
          localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifs));
          setAlertedBins(prev => [...prev, bin.id]);
        } 
        else if (!isCritical && alreadyAlerted && bin.fillLevel <= 85) {
          setAlertedBins(prev => prev.filter(id => id !== bin.id));
          
          const resolvedMessage = `✅ Bin ${bin.id} is back to normal (${bin.fillLevel.toFixed(0)}% full).`;
          const resolvedNotification = {
            id: Date.now(),
            message: resolvedMessage,
            time: new Date().toLocaleString(),
            read: false,
            binId: bin.id,
            type: 'resolved'
          };
          
          const updatedNotifs = [resolvedNotification, ...notifications];
          setNotifications(updatedNotifs);
          localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifs));
        }
      }
    });
  }, [binsData, binsLoading, user, notifications, alertedBins]);

  // Listen for manual bin assignment events
  useEffect(() => {
    const handleBinAssigned = (event) => {
      console.log('📢 Assignment Event Received:', event.detail);
      
      const { message, workerId, workerEmail, binId, workerName } = event.detail;
      
      if (!user) {
        console.log('❌ No user loaded yet');
        return;
      }

      console.log('Current User ID:', user.id);
      console.log('Current User Email:', user.email);
      console.log('Event WorkerId:', workerId);
      console.log('Event WorkerEmail:', workerEmail);
      console.log('IDs Match?', workerId === user.id);
      console.log('Emails Match?', workerEmail === user.email);

      const isTargetUser = (workerId === user.id) || (workerEmail === user.email);
      
      if (isTargetUser) {
        console.log('✅ This notification is for this user!');
        
        setToastNotification(message);
        setTimeout(() => setToastNotification(null), 4000);
        
        const exists = notifications.some(n => n.binId === binId && n.type === 'assignment');
        
        if (!exists) {
          const newNotification = {
            id: Date.now(),
            message: message,
            time: new Date().toLocaleString(),
            read: false,
            binId: binId,
            type: 'assignment',
            workerName: workerName
          };
          
          const updatedNotifs = [newNotification, ...notifications];
          setNotifications(updatedNotifs);
          console.log('💾 Saving notification to localStorage:', newNotification);
          localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifs));
        } else {
          console.log('⚠️ Notification already exists, skipping duplicate');
        }
        
        if (binId && !(user.assigned_bins || []).includes(binId)) {
          console.log('📌 Adding bin to user:', binId);
          const updatedBins = [...(user.assigned_bins || []), binId];
          const updatedUser = { ...user, assigned_bins: updatedBins };
          setUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          const savedAssignments = JSON.parse(localStorage.getItem('workerAssignments') || '{}');
          savedAssignments[user.id] = updatedBins;
          localStorage.setItem('workerAssignments', JSON.stringify(savedAssignments));
        }
      } else {
        console.log('❌ This notification is NOT for this user');
      }
    };

    window.addEventListener('binAssigned', handleBinAssigned);
    
    return () => {
      window.removeEventListener('binAssigned', handleBinAssigned);
    };
  }, [user, notifications]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  const markAsRead = (notifId) => {
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

  if (isLoading || binsLoading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>No user found. Please login again.</div>;
  }

  // Get assigned bins with real-time data
  const assignedBinIds = user.assigned_bins || [];
  const userBins = assignedBinIds.map(binId => {
    const realtimeBin = binsData.find(b => b.id === binId);
    const binInfo = binLocations[binId] || { location: 'Unknown', area: user.area || 'N/A' };
    
    if (realtimeBin) {
      return {
        id: binId,
        location: binInfo.location,
        fillLevel: realtimeBin.fillLevel,
        status: realtimeBin.fillLevel > 90 ? 'Critical' : (realtimeBin.fillLevel > 70 ? 'Warning' : 'Normal'),
        lastCollected: realtimeBin.lastUpdated || 'Recently',
        area: binInfo.area,
        temperature: realtimeBin.temperature,
        gasLevel: realtimeBin.gasLevel
      };
    } else {
      return {
        id: binId,
        location: binInfo.location,
        fillLevel: 0,
        status: 'Normal',
        lastCollected: 'Not available',
        area: binInfo.area
      };
    }
  }).filter(bin => bin.id);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = userBins.filter(b => b.status === 'Critical').length;
  const avgFillLevel = userBins.length > 0 
    ? Math.round(userBins.reduce((sum, bin) => sum + bin.fillLevel, 0) / userBins.length) 
    : 0;

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
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
                <div style={styles.statIcon}>⚠️</div>
                <div>
                  <h3 style={styles.statValue}>{criticalCount}</h3>
                  <p style={styles.statLabel}>Critical Bins</p>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📊</div>
                <div>
                  <h3 style={styles.statValue}>{avgFillLevel}%</h3>
                  <p style={styles.statLabel}>Avg Fill Level</p>
                </div>
              </div>
            </div>

            {userBins.length > 0 ? (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>📊 Bin Analytics</h2>
                
                <div style={styles.chartContainer}>
                  <div style={styles.chartBars}>
                    {userBins.map(bin => (
                      <div key={bin.id} style={styles.chartBarItem}>
                        <div style={styles.chartBarLabel}>{bin.id}</div>
                        <div style={styles.chartBarWrapper}>
                          <div style={{
                            ...styles.chartBar,
                            height: `${bin.fillLevel}%`,
                            backgroundColor: bin.fillLevel > 90 ? '#e74c3c' : (bin.fillLevel > 70 ? '#f39c12' : '#2ecc71')
                          }} />
                        </div>
                        <div style={styles.chartBarValue}>{bin.fillLevel}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={styles.chartSummary}>
                  <div style={styles.summaryItem}>
                    <span>Average Fill Level</span>
                    <strong>{avgFillLevel}%</strong>
                  </div>
                  <div style={styles.summaryItem}>
                    <span>Critical</span>
                    <strong style={{color: '#e74c3c'}}>{criticalCount}</strong>
                  </div>
                  <div style={styles.summaryItem}>
                    <span>Warning</span>
                    <strong style={{color: '#f39c12'}}>{userBins.filter(b => b.status === 'Warning').length}</strong>
                  </div>
                  <div style={styles.summaryItem}>
                    <span>Normal</span>
                    <strong style={{color: '#2ecc71'}}>{userBins.filter(b => b.status === 'Normal').length}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.card}>
                <p style={styles.noData}>No bins assigned yet. Admin will assign bins to you.</p>
              </div>
            )}
          </>
        );
      
      case 'schedule':
        return (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>📅 Weekly Schedule</h2>
            <div style={styles.scheduleList}>
              <div style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>Monday</div>
                <div style={styles.scheduleTask}>Morning: Sector {user.area} Collection</div>
                <span style={styles.pendingBadge}>Pending</span>
              </div>
              <div style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>Tuesday</div>
                <div style={styles.scheduleTask}>Morning: Sector {user.area} Collection</div>
                <span style={styles.pendingBadge}>Pending</span>
              </div>
              <div style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>Wednesday</div>
                <div style={styles.scheduleTask}>Morning: Sector {user.area} Collection</div>
                <span style={styles.pendingBadge}>Pending</span>
              </div>
              <div style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>Thursday</div>
                <div style={styles.scheduleTask}>Morning: Sector {user.area} Collection</div>
                <span style={styles.pendingBadge}>Pending</span>
              </div>
              <div style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>Friday</div>
                <div style={styles.scheduleTask}>Morning: Sector {user.area} Collection</div>
                <span style={styles.pendingBadge}>Pending</span>
              </div>
            </div>
          </div>
        );
      
      case 'assignedBins':
        return (
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
                        {bin.status === 'Critical' ? '🔴 CRITICAL' : bin.status === 'Warning' ? '⚠️ Warning' : '✓ Normal'}
                      </span>
                    </div>
                    <p style={styles.binLocation}>
                      <FiMapPin size={14} style={{ marginRight: '4px' }} />
                      {bin.location}
                    </p>
                    <div style={styles.fillLevelContainer}>
                      <div style={styles.fillLevelBar}>
                        <div style={{
                          ...styles.fillLevelFill, 
                          width: `${bin.fillLevel}%`, 
                          backgroundColor: bin.fillLevel > 90 ? '#e74c3c' : (bin.fillLevel > 70 ? '#f39c12' : '#2ecc71')
                        }} />
                      </div>
                      <span style={styles.fillLevelText}>{bin.fillLevel}% full</span>
                    </div>
                    {bin.temperature && (
                      <div style={styles.binExtraInfo}>
                        🌡️ Temp: {bin.temperature}°C | 💨 Gas: {bin.gasLevel}%
                      </div>
                    )}
                    <div style={styles.binFooter}>
                      <FiClock size={14} />
                      <span>Last updated: {bin.lastCollected}</span>
                      <button style={styles.collectBtn}>Collect Now</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noData}>No bins assigned yet. Admin will assign bins to you.</p>
            )}
          </div>
        );
      
      case 'profile':
        return (
          <div style={styles.profileContainer}>
            {/* Cover Image / Header */}
            <div style={styles.profileCover}>
              <div style={styles.profileAvatarLarge}>
                {user.name.charAt(0)}
              </div>
            </div>
            
            {/* Profile Info Card */}
            <div style={styles.profileInfoCard}>
              <h2 style={styles.profileName}>{user.name}</h2>
              <p style={styles.profileRole}>Sanitation Worker</p>
              
              <div style={styles.profileStats}>
                <div style={styles.profileStat}>
                  <div style={styles.profileStatValue}>{userBins.length}</div>
                  <div style={styles.profileStatLabel}>Assigned Bins</div>
                </div>
                <div style={styles.profileStatDivider}></div>
                <div style={styles.profileStat}>
                  <div style={styles.profileStatValue}>{criticalCount}</div>
                  <div style={styles.profileStatLabel}>Active Alerts</div>
                </div>
                <div style={styles.profileStatDivider}></div>
                <div style={styles.profileStat}>
                  <div style={styles.profileStatValue}>{avgFillLevel}%</div>
                  <div style={styles.profileStatLabel}>Avg Fill Rate</div>
                </div>
              </div>
              
              <div style={styles.profileDetails}>
                <div style={styles.profileDetailItem}>
                  <div style={styles.profileDetailIcon}>
                    <FiMail size={18} />
                  </div>
                  <div style={styles.profileDetailContent}>
                    <div style={styles.profileDetailLabel}>Email Address</div>
                    <div style={styles.profileDetailValue}>{user.email}</div>
                  </div>
                </div>
                
                <div style={styles.profileDetailItem}>
                  <div style={styles.profileDetailIcon}>
                    <FiMap size={18} />
                  </div>
                  <div style={styles.profileDetailContent}>
                    <div style={styles.profileDetailLabel}>Working Area</div>
                    <div style={styles.profileDetailValue}>Sector {user.area || 'Not Assigned'}</div>
                  </div>
                </div>
                
                <div style={styles.profileDetailItem}>
                  <div style={styles.profileDetailIcon}>
                    <FiBriefcase size={18} />
                  </div>
                  <div style={styles.profileDetailContent}>
                    <div style={styles.profileDetailLabel}>Role</div>
                    <div style={styles.profileDetailValue}>Sanitation Worker</div>
                  </div>
                </div>
                
                <div style={styles.profileDetailItem}>
                  <div style={styles.profileDetailIcon}>
                    <FiUser size={18} />
                  </div>
                  <div style={styles.profileDetailContent}>
                    <div style={styles.profileDetailLabel}>Member Since</div>
                    <div style={styles.profileDetailValue}>2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>⚙️ Settings</h2>
            <div style={styles.settingItem}>
              <label>Email Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={styles.settingItem}>
              <label>Push Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={styles.settingItem}>
              <label>Dark Mode</label>
              <input type="checkbox" />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {toastNotification && (
        <div style={{
          ...styles.toastNotification,
          backgroundColor: toastNotification.includes('CRITICAL') ? '#e74c3c' : '#4caf50'
        }}>
          <span style={styles.toastIcon}>
            {toastNotification.includes('CRITICAL') ? '🔴' : '📦'}
          </span>
          <span>{toastNotification}</span>
        </div>
      )}

      {/* ===== SIDEBAR ===== */}
      <div style={{...styles.sidebar, width: sidebarOpen ? '260px' : '70px'}}>
        <div style={styles.sidebarHeader}>
          <span style={styles.logoIcon}>♻️</span>
          {sidebarOpen && <span style={styles.logoText}>Smart Garbage</span>}
          <button style={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        {/* USER DASHBOARD LABEL - BOLD AND BLACK LIKE SMART GARBAGE */}
        {sidebarOpen && (
          <div style={styles.userDashboardTitle}>
            <span style={styles.userDashboardText}>
              <FiUser size={12} /> User Dashboard
            </span>
          </div>
        )}

        <div style={styles.sidebarUser}>
          <div style={styles.sidebarAvatar}>{user.name.charAt(0)}</div>
          {sidebarOpen && (
            <div style={styles.sidebarUserInfo}>
              <h4>{user.name}</h4>
            </div>
          )}
        </div>

        <div style={styles.sidebarMenu}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={{...styles.sidebarItem, backgroundColor: activeTab === 'overview' ? 'rgba(0,180,216,0.1)' : 'transparent', color: activeTab === 'overview' ? '#00b4d8' : '#555'}}
          >
            <FiHome size={20} />
            {sidebarOpen && <span>Overview</span>}
          </button>

          <button 
            onClick={() => setActiveTab('schedule')}
            style={{...styles.sidebarItem, backgroundColor: activeTab === 'schedule' ? 'rgba(0,180,216,0.1)' : 'transparent', color: activeTab === 'schedule' ? '#00b4d8' : '#555'}}
          >
            <FiCalendar size={20} />
            {sidebarOpen && <span>Schedule</span>}
          </button>

          <button 
            onClick={() => setActiveTab('assignedBins')}
            style={{...styles.sidebarItem, backgroundColor: activeTab === 'assignedBins' ? 'rgba(0,180,216,0.1)' : 'transparent', color: activeTab === 'assignedBins' ? '#00b4d8' : '#555'}}
          >
            <FiTrash2 size={20} />
            {sidebarOpen && <span>Assigned Bins</span>}
            {criticalCount > 0 && sidebarOpen && <span style={styles.sidebarBadge}>{criticalCount}</span>}
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            style={{...styles.sidebarItem, backgroundColor: activeTab === 'profile' ? 'rgba(0,180,216,0.1)' : 'transparent', color: activeTab === 'profile' ? '#00b4d8' : '#555'}}
          >
            <FiUser size={20} />
            {sidebarOpen && <span>My Profile</span>}
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            style={{...styles.sidebarItem, backgroundColor: activeTab === 'settings' ? 'rgba(0,180,216,0.1)' : 'transparent', color: activeTab === 'settings' ? '#00b4d8' : '#555'}}
          >
            <FiSettings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>

          {/* LOGOUT BUTTON - WITH SAME STYLE AS OTHER ICONS */}
          <button 
            onClick={handleLogout}
            style={styles.sidebarItem}
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{...styles.mainContent, marginLeft: sidebarOpen ? '260px' : '70px'}}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Welcome, {user.name}! 👋</h1>
            <p style={styles.subtitle}>Sector {user.area || 'Not Assigned'}</p>
          </div>
          <div style={styles.headerActions}>
            {criticalCount > 0 && (
              <div style={styles.criticalAlert}>
                <FiAlertCircle size={18} />
                <span>{criticalCount} bins critical!</span>
              </div>
            )}
            
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
                          style={{
                            ...styles.notificationItem, 
                            opacity: notif.read ? 0.6 : 1, 
                            backgroundColor: notif.type === 'critical' ? '#fee2e2' : (notif.type === 'assignment' ? '#e3f2fd' : (notif.read ? '#f9f9f9' : '#f0f7ff')),
                            borderLeft: notif.type === 'critical' ? '3px solid #e74c3c' : (notif.type === 'assignment' ? '3px solid #00b4d8' : 'none')
                          }}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div style={styles.notificationIcon}>
                            {notif.type === 'critical' ? '🔴' : notif.type === 'assignment' ? '📦' : '📝'}
                          </div>
                          <div style={styles.notificationContent}>
                            <p style={styles.notificationMessage}>{notif.message}</p>
                            <span style={styles.notificationTime}>{notif.time}</span>
                          </div>
                          {!notif.read && <div style={styles.unreadDot}></div>}
                        </div>
                      ))
                    ) : (
                      <p style={styles.noNotifications}>No notifications yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
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
  toastNotification: {
    position: 'fixed',
    top: '100px',
    right: '20px',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 2000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    animation: 'slideInRight 0.3s ease',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  toastIcon: {
    fontSize: '1.2rem'
  },
  
  // Sidebar Styles
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    backgroundColor: '#ffffff',
    color: '#333',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflow: 'hidden',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  },
  sidebarHeader: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e0e0e0'
  },
  logoIcon: {
    fontSize: '1.8rem'
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginLeft: '0.5rem',
    color: '#333'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  sidebarUser: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '1px solid #e0e0e0'
  },
  sidebarAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#00b4d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white'
  },
  sidebarUserInfo: {
    overflow: 'hidden'
  },
  sidebarUserInfoH4: {
    margin: 0,
    fontSize: '1rem'
  },
  sidebarMenu: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem 1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    width: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
    color: '#555'
  },
  sidebarBadge: {
    position: 'absolute',
    right: '1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
    fontSize: '0.7rem',
    fontWeight: 600
  },
  // USER DASHBOARD SECTION - BOLD AND BLACK LIKE SMART GARBAGE
  userDashboardTitle: {
    padding: '0.5rem 1.5rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  userDashboardText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  // Main Content Styles
  mainContent: {
    flex: 1,
    padding: '2rem',
    transition: 'margin-left 0.3s ease',
    backgroundColor: '#f5f7fa'
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
  criticalAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500
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
    width: '380px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    marginTop: '0.5rem',
    zIndex: 1000,
    maxHeight: '450px',
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
    transition: 'background 0.3s',
    position: 'relative'
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
  unreadDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00b4d8',
    borderRadius: '50%',
    marginLeft: '8px'
  },
  noNotifications: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    fontSize: '0.85rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
    fontSize: '0.75rem',
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
  chartContainer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    marginBottom: '1rem'
  },
  chartBars: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    gap: '1rem',
    height: '200px',
    padding: '1rem 0'
  },
  chartBarItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    height: '100%'
  },
  chartBarLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#666'
  },
  chartBarWrapper: {
    flex: 1,
    width: '50px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
    height: '150px',
    overflow: 'hidden'
  },
  chartBar: {
    width: '100%',
    transition: 'height 0.5s ease',
    borderRadius: '8px 8px 0 0'
  },
  chartBarValue: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#333'
  },
  chartSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    marginTop: '1rem'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '8px'
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
  pendingBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    fontSize: '0.7rem',
    backgroundColor: '#95a5a620',
    color: '#7f8c8d'
  },
  binsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem'
  },
  binCard: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s'
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
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  fillLevelFill: {
    height: '100%',
    transition: 'width 0.5s ease'
  },
  fillLevelText: {
    fontSize: '0.75rem',
    color: '#666',
    minWidth: '45px',
    fontWeight: 500
  },
  binExtraInfo: {
    fontSize: '0.7rem',
    color: '#888',
    marginBottom: '0.5rem'
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
  },
  
  // NEW PROFILE STYLES - PROFESSIONAL & MODERN
  profileContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  profileCover: {
    background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
    borderRadius: '20px 20px 0 0',
    height: '150px',
    position: 'relative',
    marginBottom: '60px',
  },
  profileAvatarLarge: {
    position: 'absolute',
    bottom: '-50px',
    left: '40px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '4px solid white',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#00b4d8',
    background: 'white',
  },
  profileInfoCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '2rem',
    marginTop: '-20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },
  profileName: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#023047',
    margin: '0 0 0.5rem 0',
  },
  profileRole: {
    fontSize: '1rem',
    color: '#00b4d8',
    fontWeight: 500,
    margin: '0 0 1.5rem 0',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f0f0f0',
  },
  profileStats: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  profileStat: {
    textAlign: 'center',
    flex: 1,
  },
  profileStatValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#023047',
  },
  profileStatLabel: {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '0.3rem',
  },
  profileStatDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: '#e0e0e0',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  profileDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    transition: 'all 0.3s',
  },
  profileDetailIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#e3f2fd',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#00b4d8',
  },
  profileDetailContent: {
    flex: 1,
  },
  profileDetailLabel: {
    fontSize: '0.7rem',
    color: '#666',
    marginBottom: '0.2rem',
  },
  profileDetailValue: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#023047',
  },
  
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem',
    borderBottom: '1px solid #f0f0f0'
  }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .sidebar-item:hover {
    background-color: rgba(0,180,216,0.1) !important;
    color: #00b4d8 !important;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,180,216,0.15);
  }
  
  .bin-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }
  
  .collect-btn:hover {
    background: #0077b6 !important;
    transform: scale(1.05);
  }
  
  .profile-detail-item:hover {
    transform: translateX(5px);
    background-color: #e3f2fd !important;
  }
`;
document.head.appendChild(styleSheet);

export default UserDashboard;