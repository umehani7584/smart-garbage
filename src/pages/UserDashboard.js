import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUser, FiBell, FiSettings, FiLogOut, 
  FiCalendar, FiMapPin, FiClock, FiTrash2, 
  FiCheckCircle, FiAlertCircle, FiBarChart2,
  FiDroplet, FiThermometer, FiWind, FiTrendingUp,
  FiDownload, FiRefreshCw, FiEye, FiEyeOff
} from 'react-icons/fi';

function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showStats, setShowStats] = useState(true);
  const navigate = useNavigate();

  // Mock data for dashboard
  const userInfo = {
    name: "Ahmed Raza",
    role: "Sanitation Worker",
    employeeId: "EMP-2024-001",
    area: "Sector F-8, Islamabad",
    joinDate: "15 March 2024",
    profilePic: null,
    rating: 4.8,
    completedTasks: 245,
    pendingTasks: 3
  };

  const notifications = [
    { id: 1, message: "Bin BIN-023 is 95% full", time: "5 min ago", type: "warning" },
    { id: 2, message: "New route assigned for today", time: "1 hour ago", type: "info" },
    { id: 3, message: "Weekly report generated", time: "3 hours ago", type: "success" },
    { id: 4, message: "Vehicle maintenance due", time: "1 day ago", type: "alert" }
  ];

  const assignedBins = [
    { id: "BIN-001", location: "Street 5, F-8/1", fillLevel: 85, status: "warning", lastCollected: "2 hours ago" },
    { id: "BIN-002", location: "Park Road, F-8/2", fillLevel: 45, status: "normal", lastCollected: "5 hours ago" },
    { id: "BIN-003", location: "Market Area, F-8/3", fillLevel: 95, status: "critical", lastCollected: "1 hour ago" },
    { id: "BIN-004", location: "School Road, F-8/4", fillLevel: 20, status: "normal", lastCollected: "3 hours ago" },
    { id: "BIN-005", location: "Hospital Road, F-8/1", fillLevel: 70, status: "warning", lastCollected: "4 hours ago" }
  ];

  const todaySchedule = [
    { time: "08:00 AM", task: "Morning Collection - Sector F-8/1", status: "completed" },
    { time: "10:30 AM", task: "Market Area Collection", status: "completed" },
    { time: "01:00 PM", task: "School Road Collection", status: "in-progress" },
    { time: "03:30 PM", task: "Hospital Road Collection", status: "pending" },
    { time: "05:00 PM", task: "Evening Reporting", status: "pending" }
  ];

  const stats = {
    weeklyCollections: 156,
    distanceCovered: "245 km",
    fuelSaved: "38 L",
    co2Reduced: "95 kg",
    avgResponseTime: "18 min",
    satisfactionRate: "94%"
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <div style={{...styles.sidebar, width: sidebarOpen ? '280px' : '80px'}}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>♻️</span>
          {sidebarOpen && <span style={styles.logoText}>Smart Garbage</span>}
        </div>

        {/* User Profile */}
        <div style={styles.userProfile}>
          <div style={styles.avatarContainer}>
            {userInfo.profilePic ? (
              <img src={userInfo.profilePic} alt="profile" style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {userInfo.name.charAt(0)}
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{userInfo.name}</h3>
              <p style={styles.userRole}>{userInfo.role}</p>
              <p style={styles.userId}>ID: {userInfo.employeeId}</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={styles.navMenu}>
          <button 
            onClick={() => setSelectedTab('overview')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'overview' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiHome style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Overview</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('tasks')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'tasks' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiTrash2 style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>My Tasks</span>}
            {sidebarOpen && <span style={styles.badge}>3</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('schedule')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'schedule' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiCalendar style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Schedule</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('bins')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'bins' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiMapPin style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Assigned Bins</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('analytics')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'analytics' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiBarChart2 style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Analytics</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('settings')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'settings' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiSettings style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Settings</span>}
          </button>
        </div>

        {/* Logout Button */}
        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FiLogOut style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Logout</span>}
          </button>
          
          {/* Toggle Sidebar Button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleBtn}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{...styles.mainContent, marginLeft: sidebarOpen ? '280px' : '80px'}}>
        
        {/* ===== TOP NAVBAR ===== */}
        <div style={styles.topNavbar}>
          <h1 style={styles.pageTitle}>Welcome back, {userInfo.name}! 👋</h1>
          
          <div style={styles.topNavActions}>
            {/* Search Bar */}
            <div style={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search tasks, bins, or reports..." 
                style={styles.searchInput}
              />
              <button style={styles.searchBtn}>🔍</button>
            </div>

            {/* Notifications */}
            <div style={styles.notificationContainer}>
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={styles.notificationBtn}
              >
                <FiBell style={styles.notificationIcon} />
                <span style={styles.notificationBadge}>4</span>
              </button>
              
              {notificationsOpen && (
                <div style={styles.notificationDropdown}>
                  <h4 style={styles.dropdownTitle}>Notifications</h4>
                  {notifications.map(notif => (
                    <div key={notif.id} style={styles.notificationItem}>
                      <div style={{...styles.notificationDot, backgroundColor: 
                        notif.type === 'warning' ? '#f39c12' :
                        notif.type === 'alert' ? '#e74c3c' :
                        notif.type === 'success' ? '#2ecc71' : '#3498db'
                      }} />
                      <div style={styles.notificationContent}>
                        <p style={styles.notificationMessage}>{notif.message}</p>
                        <span style={styles.notificationTime}>{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button style={styles.refreshBtn}>
              <FiRefreshCw style={styles.refreshIcon} />
            </button>
          </div>
        </div>

        {/* ===== DASHBOARD CONTENT ===== */}
        <div style={styles.dashboardContent}>
          
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <FiTrash2 style={styles.statIcon} />
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statValue}>{userInfo.completedTasks}</h3>
                <p style={styles.statLabel}>Total Collections</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <FiClock style={styles.statIcon} />
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statValue}>{userInfo.pendingTasks}</h3>
                <p style={styles.statLabel}>Pending Tasks</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <FiMapPin style={styles.statIcon} />
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statValue}>{assignedBins.length}</h3>
                <p style={styles.statLabel}>Assigned Bins</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIconContainer}>
                <FiTrendingUp style={styles.statIcon} />
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statValue}>{userInfo.rating} ⭐</h3>
                <p style={styles.statLabel}>Performance Rating</p>
              </div>
            </div>
          </div>

          {/* Main Grid - Two Columns */}
          <div style={styles.mainGrid}>
            {/* Left Column - Assigned Bins */}
            <div style={styles.leftColumn}>
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Assigned Bins</h2>
                  <button style={styles.viewAllBtn}>View All →</button>
                </div>

                <div style={styles.binsList}>
                  {assignedBins.map(bin => (
                    <div key={bin.id} style={styles.binItem}>
                      <div style={styles.binHeader}>
                        <span style={styles.binId}>{bin.id}</span>
                        <span style={{
                          ...styles.binStatus,
                          backgroundColor: 
                            bin.status === 'critical' ? '#e74c3c20' :
                            bin.status === 'warning' ? '#f39c1220' : '#2ecc7120',
                          color: 
                            bin.status === 'critical' ? '#e74c3c' :
                            bin.status === 'warning' ? '#f39c12' : '#2ecc71'
                        }}>
                          {bin.status === 'critical' ? '⚠️ Critical' :
                           bin.status === 'warning' ? '⚠️ Warning' : '✓ Normal'}
                        </span>
                      </div>
                      <p style={styles.binLocation}>{bin.location}</p>
                      
                      <div style={styles.fillLevelContainer}>
                        <div style={styles.fillLevelBar}>
                          <div style={{
                            ...styles.fillLevelFill,
                            width: `${bin.fillLevel}%`,
                            backgroundColor: 
                              bin.fillLevel > 90 ? '#e74c3c' :
                              bin.fillLevel > 70 ? '#f39c12' : '#2ecc71'
                          }} />
                        </div>
                        <span style={styles.fillLevelText}>{bin.fillLevel}% full</span>
                      </div>
                      
                      <div style={styles.binFooter}>
                        <FiClock style={styles.binFooterIcon} />
                        <span style={styles.binFooterText}>Last: {bin.lastCollected}</span>
                        <button style={styles.collectNowBtn}>Collect Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Today's Schedule & Analytics */}
            <div style={styles.rightColumn}>
              {/* Today's Schedule */}
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Today's Schedule</h2>
                  <button style={styles.viewAllBtn}>View Full →</button>
                </div>

                <div style={styles.scheduleList}>
                  {todaySchedule.map((item, index) => (
                    <div key={index} style={styles.scheduleItem}>
                      <div style={styles.scheduleTime}>
                        <FiClock style={styles.scheduleTimeIcon} />
                        <span>{item.time}</span>
                      </div>
                      <div style={styles.scheduleTask}>
                        <p style={styles.scheduleTaskText}>{item.task}</p>
                        <span style={{
                          ...styles.scheduleStatus,
                          backgroundColor: 
                            item.status === 'completed' ? '#2ecc7120' :
                            item.status === 'in-progress' ? '#f39c1220' : '#95a5a620',
                          color: 
                            item.status === 'completed' ? '#2ecc71' :
                            item.status === 'in-progress' ? '#f39c12' : '#7f8c8d'
                        }}>
                          {item.status === 'completed' ? '✓ Completed' :
                           item.status === 'in-progress' ? '⏳ In Progress' : '⏰ Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Analytics */}
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Quick Analytics</h2>
                  <button 
                    onClick={() => setShowStats(!showStats)}
                    style={styles.viewAllBtn}
                  >
                    {showStats ? <FiEyeOff /> : <FiEye />} Hide
                  </button>
                </div>

                {showStats && (
                  <div style={styles.statsDetails}>
                    <div style={styles.statRow}>
                      <span style={styles.statRowLabel}>Weekly Collections</span>
                      <span style={styles.statRowValue}>{stats.weeklyCollections}</span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statRowLabel}>Distance Covered</span>
                      <span style={styles.statRowValue}>{stats.distanceCovered}</span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statRowLabel}>Fuel Saved</span>
                      <span style={styles.statRowValue}>{stats.fuelSaved}</span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statRowLabel}>CO2 Reduced</span>
                      <span style={styles.statRowValue}>{stats.co2Reduced}</span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statRowLabel}>Avg Response Time</span>
                      <span style={styles.statRowValue}>{stats.avgResponseTime}</span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statRowLabel}>Satisfaction Rate</span>
                      <span style={styles.statRowValue}>{stats.satisfactionRate}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Export Report Button */}
              <button style={styles.exportBtn}>
                <FiDownload style={styles.exportIcon} />
                Download Weekly Report
              </button>
            </div>
          </div>

          {/* Environmental Impact Banner */}
          <div style={styles.impactBanner}>
            <div style={styles.impactContent}>
              <h3 style={styles.impactTitle}>🌍 Your Environmental Impact</h3>
              <p style={styles.impactText}>
                You've helped reduce CO2 emissions by {stats.co2Reduced} this week. 
                That's equivalent to planting 4 trees! 🌳
              </p>
            </div>
            <div style={styles.impactBadge}>
              <span style={styles.impactBadgeText}>Eco Warrior</span>
            </div>
          </div>
        </div>
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

  // ===== SIDEBAR STYLES =====
  sidebar: {
    backgroundColor: '#ffffff',
    boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflow: 'hidden'
  },
  logoContainer: {
    padding: '2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '2px solid #f0f0f0'
  },
  logoIcon: {
    fontSize: '2.5rem'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#023047',
    whiteSpace: 'nowrap'
  },
  userProfile: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '2px solid #f0f0f0'
  },
  avatarContainer: {
    width: '50px',
    height: '50px',
    flexShrink: 0
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#00b4d8',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  userInfo: {
    overflow: 'hidden'
  },
  userName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#023047',
    margin: 0,
    whiteSpace: 'nowrap'
  },
  userRole: {
    fontSize: '0.85rem',
    color: '#00b4d8',
    margin: '0.2rem 0',
    whiteSpace: 'nowrap'
  },
  userId: {
    fontSize: '0.75rem',
    color: '#666',
    margin: 0,
    whiteSpace: 'nowrap'
  },
  navMenu: {
    flex: 1,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem 1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    width: '100%',
    position: 'relative',
    color: '#666'
  },
  navIcon: {
    fontSize: '1.2rem',
    flexShrink: 0
  },
  navText: {
    fontSize: '0.95rem',
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  badge: {
    position: 'absolute',
    right: '1rem',
    backgroundColor: '#00b4d8',
    color: 'white',
    padding: '0.2rem 0.5rem',
    borderRadius: '5px',
    fontSize: '0.75rem',
    fontWeight: 600
  },
  logoutContainer: {
    padding: '1.5rem',
    borderTop: '2px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem 1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: '#e74c3c',
    backgroundColor: 'transparent',
    flex: 1
  },
  toggleBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '2px solid #00b4d8',
    backgroundColor: 'white',
    color: '#00b4d8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    transition: 'all 0.3s'
  },

  // ===== MAIN CONTENT STYLES =====
  mainContent: {
    flex: 1,
    padding: '2rem',
    transition: 'margin-left 0.3s ease',
    backgroundColor: '#f5f7fa'
  },
  topNavbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1rem 2rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  pageTitle: {
    fontSize: '1.5rem',
    color: '#023047',
    margin: 0
  },
  topNavActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: '10px',
    padding: '0.3rem',
    width: '300px'
  },
  searchInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '0.9rem'
  },
  searchBtn: {
    padding: '0.6rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1.1rem'
  },
  notificationContainer: {
    position: 'relative'
  },
  notificationBtn: {
    position: 'relative',
    padding: '0.6rem',
    border: 'none',
    backgroundColor: '#f5f7fa',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  notificationIcon: {
    fontSize: '1.2rem',
    color: '#666'
  },
  notificationBadge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#00b4d8',
    color: 'white',
    fontSize: '0.7rem',
    padding: '0.2rem 0.4rem',
    borderRadius: '5px'
  },
  notificationDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '300px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    marginTop: '0.5rem',
    zIndex: 1000
  },
  dropdownTitle: {
    padding: '1rem',
    margin: 0,
    borderBottom: '2px solid #f0f0f0',
    color: '#023047',
    fontSize: '1rem'
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    padding: '1rem',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.3s'
  },
  notificationDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '0.3rem'
  },
  notificationContent: {
    flex: 1
  },
  notificationMessage: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#333',
    marginBottom: '0.2rem'
  },
  notificationTime: {
    fontSize: '0.75rem',
    color: '#666'
  },
  refreshBtn: {
    padding: '0.6rem',
    border: 'none',
    backgroundColor: '#f5f7fa',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  refreshIcon: {
    fontSize: '1.2rem',
    color: '#666'
  },

  // ===== DASHBOARD CONTENT STYLES =====
  dashboardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s'
  },
  statIconContainer: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: 'rgba(0,180,216,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIcon: {
    fontSize: '1.5rem',
    color: '#00b4d8'
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#023047',
    margin: 0,
    marginBottom: '0.2rem'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  sectionCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#023047',
    margin: 0
  },
  viewAllBtn: {
    padding: '0.3rem 0.8rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#00b4d8',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  binsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  binItem: {
    padding: '1rem',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.3s'
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
    fontSize: '0.75rem',
    fontWeight: 500
  },
  binLocation: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0 0 0.5rem 0'
  },
  fillLevelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
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
    fontSize: '0.8rem',
    color: '#666',
    minWidth: '50px',
    textAlign: 'right'
  },
  binFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#666'
  },
  binFooterIcon: {
    fontSize: '0.9rem'
  },
  binFooterText: {
    flex: 1
  },
  collectNowBtn: {
    padding: '0.3rem 0.8rem',
    border: 'none',
    backgroundColor: '#00b4d8',
    color: 'white',
    borderRadius: '5px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  scheduleItem: {
    padding: '0.8rem',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  scheduleTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#023047',
    fontWeight: 600
  },
  scheduleTimeIcon: {
    fontSize: '0.9rem',
    color: '#00b4d8'
  },
  scheduleTask: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scheduleTaskText: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0
  },
  scheduleStatus: {
    padding: '0.2rem 0.5rem',
    borderRadius: '5px',
    fontSize: '0.7rem',
    fontWeight: 500
  },
  statsDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f0f0f0'
  },
  statRowLabel: {
    fontSize: '0.9rem',
    color: '#666'
  },
  statRowValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#023047'
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    border: '2px dashed #00b4d8',
    borderRadius: '10px',
    backgroundColor: 'white',
    color: '#00b4d8',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  exportIcon: {
    fontSize: '1.1rem'
  },
  impactBanner: {
    background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)',
    padding: '2rem',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white'
  },
  impactContent: {
    flex: 1
  },
  impactTitle: {
    fontSize: '1.2rem',
    margin: '0 0 0.5rem 0',
    fontWeight: 600
  },
  impactText: {
    fontSize: '0.95rem',
    margin: 0,
    opacity: 0.9
  },
  impactBadge: {
    padding: '0.5rem 1.5rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50px',
    border: '2px solid rgba(255,255,255,0.3)'
  },
  impactBadgeText: {
    fontSize: '1rem',
    fontWeight: 600
  }
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .nav-item:hover {
    background-color: rgba(0,180,216,0.1) !important;
    color: #00b4d8 !important;
  }
  
  .logout-btn:hover {
    background-color: #e74c3c20 !important;
    color: #e74c3c !important;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,180,216,0.15);
  }
  
  .bin-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }
  
  .collect-now-btn:hover {
    background: #0077b6 !important;
    transform: scale(1.05);
  }
  
  .export-btn:hover {
    background: #00b4d8 !important;
    color: white !important;
    border: 2px solid #00b4d8 !important;
  }
  
  @media (max-width: 768px) {
    .main-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default UserDashboard;