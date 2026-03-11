import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiMapPin, FiClock, FiSettings, FiLogOut,
  FiBarChart2, FiTrash2, FiAlertCircle, FiCheckCircle, FiDownload,
  FiEye, FiEyeOff, FiRefreshCw, FiBell, FiUser, FiCalendar,
  FiDroplet, FiThermometer, FiWind, FiTrendingUp
} from 'react-icons/fi';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showStats, setShowStats] = useState(true);
  const navigate = useNavigate();

  // Mock data for admin dashboard
  const adminInfo = {
    name: "Admin User",
    role: "System Administrator",
    employeeId: "ADMIN-001",
    area: "Head Office, Islamabad",
    joinDate: "01 January 2024",
    profilePic: null
  };

  const notifications = [
    { id: 1, message: "New worker registration pending approval", time: "10 min ago", type: "info" },
    { id: 2, message: "Bin BIN-023 is 95% full - Critical", time: "25 min ago", type: "critical" },
    { id: 3, message: "Weekly report generated", time: "2 hours ago", type: "success" },
    { id: 4, message: "Vehicle maintenance due tomorrow", time: "5 hours ago", type: "warning" },
    { id: 5, message: "3 new complaints received", time: "1 day ago", type: "alert" }
  ];

  const workersList = [
    { id: 1, name: "Ahmed Raza", employeeId: "EMP-001", area: "Sector F-7", status: "active", bins: 2, rating: 4.8 },
    { id: 2, name: "Fatima Khan", employeeId: "EMP-002", area: "Sector G-10", status: "active", bins: 2, rating: 4.9 },
    { id: 3, name: "Usman Ali", employeeId: "EMP-003", area: "Sector F-8", status: "active", bins: 1, rating: 4.7 },
    { id: 4, name: "Zara Malik", employeeId: "EMP-004", area: "Sector F-7", status: "inactive", bins: 0, rating: 0 },
    { id: 5, name: "Bilal Ahmed", employeeId: "EMP-005", area: "Sector G-10", status: "pending", bins: 0, rating: 0 }
  ];

  const allBins = [
    { id: "BIN-001", location: "Street 5, F-7/1", area: "F-7", assignedTo: "Ahmed Raza", fillLevel: 85, status: "warning", lastUpdated: "10 min ago" },
    { id: "BIN-002", location: "Park Road, F-7/2", area: "F-7", assignedTo: "Ahmed Raza", fillLevel: 45, status: "normal", lastUpdated: "15 min ago" },
    { id: "BIN-003", location: "Market Area, G-10/1", area: "G-10", assignedTo: "Fatima Khan", fillLevel: 95, status: "critical", lastUpdated: "5 min ago" },
    { id: "BIN-004", location: "School Road, G-10/2", area: "G-10", assignedTo: "Fatima Khan", fillLevel: 20, status: "normal", lastUpdated: "20 min ago" },
    { id: "BIN-005", location: "Hospital Road, F-8/1", area: "F-8", assignedTo: "Usman Ali", fillLevel: 70, status: "warning", lastUpdated: "12 min ago" },
    { id: "BIN-006", location: "Main Boulevard, F-8/2", area: "F-8", assignedTo: null, fillLevel: 30, status: "normal", lastUpdated: "30 min ago" },
    { id: "BIN-007", location: "Community Center, G-10/3", area: "G-10", assignedTo: null, fillLevel: 15, status: "normal", lastUpdated: "45 min ago" }
  ];

  const pendingApprovals = [
    { id: 1, name: "Zara Malik", email: "zara@example.com", cnic: "1234512345674", phone: "03011223344", appliedOn: "2024-03-10" },
    { id: 2, name: "Bilal Ahmed", email: "bilal@example.com", cnic: "1234512345675", phone: "03021223344", appliedOn: "2024-03-09" },
    { id: 3, name: "Sara Khan", email: "sara@example.com", cnic: "1234512345676", phone: "03031223344", appliedOn: "2024-03-08" }
  ];

  const systemStats = {
    totalWorkers: 8,
    activeWorkers: 5,
    totalBins: 47,
    criticalBins: 3,
    warningBins: 8,
    normalBins: 36,
    collectionsToday: 124,
    pendingApprovals: 3,
    avgResponseTime: "15 min",
    efficiency: "92%"
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
          {sidebarOpen && <span style={styles.logoText}>Admin Panel</span>}
        </div>

        {/* Admin Profile */}
        <div style={styles.adminProfile}>
          <div style={styles.avatarContainer}>
            {adminInfo.profilePic ? (
              <img src={adminInfo.profilePic} alt="profile" style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                A
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div style={styles.adminInfo}>
              <h3 style={styles.adminName}>{adminInfo.name}</h3>
              <p style={styles.adminRole}>{adminInfo.role}</p>
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
            onClick={() => setSelectedTab('workers')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'workers' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiUsers style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Workers</span>}
            {sidebarOpen && systemStats.pendingApprovals > 0 && <span style={styles.badge}>{systemStats.pendingApprovals}</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('bins')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'bins' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiMapPin style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>All Bins</span>}
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
          <h1 style={styles.pageTitle}>
            {selectedTab === 'overview' && 'Dashboard Overview'}
            {selectedTab === 'workers' && 'Workers Management'}
            {selectedTab === 'bins' && 'Bins Management'}
            {selectedTab === 'analytics' && 'System Analytics'}
            {selectedTab === 'settings' && 'Settings'}
          </h1>
          
          <div style={styles.topNavActions}>
            {/* Search Bar */}
            <div style={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search workers, bins, or reports..." 
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
                <span style={styles.notificationBadge}>{notifications.length}</span>
              </button>
              
              {notificationsOpen && (
                <div style={styles.notificationDropdown}>
                  <h4 style={styles.dropdownTitle}>Notifications</h4>
                  {notifications.map(notif => (
                    <div key={notif.id} style={styles.notificationItem}>
                      <div style={{...styles.notificationDot, backgroundColor: 
                        notif.type === 'critical' ? '#e74c3c' :
                        notif.type === 'warning' ? '#f39c12' :
                        notif.type === 'alert' ? '#e67e22' :
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
          
          {/* OVERVIEW TAB */}
          {selectedTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiUsers style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{systemStats.totalWorkers}</h3>
                    <p style={styles.statLabel}>Total Workers</p>
                    <p style={styles.statSubtext}>{systemStats.activeWorkers} active</p>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiMapPin style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{systemStats.totalBins}</h3>
                    <p style={styles.statLabel}>Total Bins</p>
                    <p style={styles.statSubtext}>{systemStats.criticalBins} critical</p>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiTrash2 style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{systemStats.collectionsToday}</h3>
                    <p style={styles.statLabel}>Today's Collections</p>
                    <p style={styles.statSubtext}>+12 from yesterday</p>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiTrendingUp style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{systemStats.efficiency}</h3>
                    <p style={styles.statLabel}>Efficiency Rate</p>
                    <p style={styles.statSubtext}>Avg response: {systemStats.avgResponseTime}</p>
                  </div>
                </div>
              </div>

              {/* Main Grid - Two Columns */}
              <div style={styles.mainGrid}>
                {/* Left Column - Critical Bins */}
                <div style={styles.leftColumn}>
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>⚠️ Critical Bins</h2>
                      <button style={styles.viewAllBtn}>View All →</button>
                    </div>

                    <div style={styles.binsList}>
                      {allBins.filter(bin => bin.status === 'critical').map(bin => (
                        <div key={bin.id} style={styles.binItem}>
                          <div style={styles.binHeader}>
                            <span style={styles.binId}>{bin.id}</span>
                            <span style={{...styles.binStatus, backgroundColor: '#e74c3c20', color: '#e74c3c'}}>
                              🔴 Critical
                            </span>
                          </div>
                          <p style={styles.binLocation}>{bin.location}</p>
                          <p style={styles.binAssigned}>Assigned to: {bin.assignedTo || 'Unassigned'}</p>
                          <div style={styles.fillLevelContainer}>
                            <div style={styles.fillLevelBar}>
                              <div style={{...styles.fillLevelFill, width: `${bin.fillLevel}%`, backgroundColor: '#e74c3c'}} />
                            </div>
                            <span style={styles.fillLevelText}>{bin.fillLevel}% full</span>
                          </div>
                          <div style={styles.binFooter}>
                            <FiClock style={styles.binFooterIcon} />
                            <span style={styles.binFooterText}>Last: {bin.lastUpdated}</span>
                            <button style={styles.assignBtn}>Assign Worker</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Pending Approvals & System Health */}
                <div style={styles.rightColumn}>
                  {/* Pending Approvals */}
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>⏳ Pending Approvals</h2>
                      <button style={styles.viewAllBtn}>{systemStats.pendingApprovals} new</button>
                    </div>

                    <div style={styles.approvalsList}>
                      {pendingApprovals.map(approval => (
                        <div key={approval.id} style={styles.approvalItem}>
                          <div style={styles.approvalHeader}>
                            <FiUser style={styles.approvalIcon} />
                            <div style={styles.approvalInfo}>
                              <h4 style={styles.approvalName}>{approval.name}</h4>
                              <p style={styles.approvalDetails}>{approval.email} | {approval.phone}</p>
                            </div>
                          </div>
                          <p style={styles.approvalCnic}>CNIC: {approval.cnic}</p>
                          <p style={styles.approvalDate}>Applied: {approval.appliedOn}</p>
                          <div style={styles.approvalActions}>
                            <button style={styles.approveBtn}>✓ Approve</button>
                            <button style={styles.rejectBtn}>✕ Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Health */}
                  <div style={styles.sectionCard}>
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>📊 System Health</h2>
                      <button 
                        onClick={() => setShowStats(!showStats)}
                        style={styles.viewAllBtn}
                      >
                        {showStats ? <FiEyeOff /> : <FiEye />} 
                      </button>
                    </div>

                    {showStats && (
                      <div style={styles.statsDetails}>
                        <div style={styles.statRow}>
                          <span style={styles.statRowLabel}>Bin Status Distribution</span>
                          <div style={styles.progressGroup}>
                            <div style={styles.progressBar}>
                              <div style={{...styles.progressFill, width: `${(systemStats.normalBins/systemStats.totalBins)*100}%`, backgroundColor: '#2ecc71'}} />
                            </div>
                            <span style={styles.progressLabel}>{systemStats.normalBins} Normal</span>
                          </div>
                          <div style={styles.progressBar}>
                            <div style={{...styles.progressFill, width: `${(systemStats.warningBins/systemStats.totalBins)*100}%`, backgroundColor: '#f39c12'}} />
                            <span style={styles.progressLabel}>{systemStats.warningBins} Warning</span>
                          </div>
                          <div style={styles.progressBar}>
                            <div style={{...styles.progressFill, width: `${(systemStats.criticalBins/systemStats.totalBins)*100}%`, backgroundColor: '#e74c3c'}} />
                            <span style={styles.progressLabel}>{systemStats.criticalBins} Critical</span>
                          </div>
                        </div>
                        
                        <div style={styles.statRow}>
                          <span style={styles.statRowLabel}>Worker Status</span>
                          <div style={styles.progressGroup}>
                            <div style={styles.progressBar}>
                              <div style={{...styles.progressFill, width: `${(systemStats.activeWorkers/systemStats.totalWorkers)*100}%`, backgroundColor: '#2ecc71'}} />
                              <span style={styles.progressLabel}>{systemStats.activeWorkers} Active</span>
                            </div>
                            <div style={styles.progressBar}>
                              <div style={{...styles.progressFill, width: `${(systemStats.pendingApprovals/systemStats.totalWorkers)*100}%`, backgroundColor: '#f39c12'}} />
                              <span style={styles.progressLabel}>{systemStats.pendingApprovals} Pending</span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.statRow}>
                          <span style={styles.statRowLabel}>Collection Efficiency</span>
                          <span style={styles.statRowValue}>{systemStats.efficiency}</span>
                        </div>
                        
                        <div style={styles.statRow}>
                          <span style={styles.statRowLabel}>Average Response Time</span>
                          <span style={styles.statRowValue}>{systemStats.avgResponseTime}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Export Report Button */}
                  <button style={styles.exportBtn}>
                    <FiDownload style={styles.exportIcon} />
                    Generate System Report
                  </button>
                </div>
              </div>
            </>
          )}

          {/* WORKERS TAB */}
          {selectedTab === 'workers' && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>👥 All Workers</h2>
                <button style={styles.addBtn}>+ Add New Worker</button>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Employee ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Area</th>
                      <th style={styles.th}>Assigned Bins</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Rating</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workersList.map(worker => (
                      <tr key={worker.id}>
                        <td style={styles.td}>{worker.employeeId}</td>
                        <td style={styles.td}>{worker.name}</td>
                        <td style={styles.td}>{worker.area}</td>
                        <td style={styles.td}>{worker.bins}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: 
                              worker.status === 'active' ? '#2ecc7120' :
                              worker.status === 'inactive' ? '#95a5a620' : '#f39c1220',
                            color: 
                              worker.status === 'active' ? '#2ecc71' :
                              worker.status === 'inactive' ? '#7f8c8d' : '#f39c12'
                          }}>
                            {worker.status === 'active' ? '✓ Active' :
                             worker.status === 'inactive' ? '○ Inactive' : '⏳ Pending'}
                          </span>
                        </td>
                        <td style={styles.td}>{worker.rating > 0 ? `${worker.rating} ⭐` : '-'}</td>
                        <td style={styles.td}>
                          <button style={styles.editBtn}>Edit</button>
                          <button style={styles.viewBtn}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BINS TAB */}
          {selectedTab === 'bins' && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>🗑️ All Bins</h2>
                <button style={styles.addBtn}>+ Add New Bin</button>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Bin ID</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Area</th>
                      <th style={styles.th}>Assigned To</th>
                      <th style={styles.th}>Fill Level</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Last Updated</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBins.map(bin => (
                      <tr key={bin.id}>
                        <td style={styles.td}>{bin.id}</td>
                        <td style={styles.td}>{bin.location}</td>
                        <td style={styles.td}>{bin.area}</td>
                        <td style={styles.td}>{bin.assignedTo || 'Unassigned'}</td>
                        <td style={styles.td}>
                          <div style={styles.tableFillLevel}>
                            <div style={styles.tableFillBar}>
                              <div style={{
                                ...styles.tableFillFill,
                                width: `${bin.fillLevel}%`,
                                backgroundColor: 
                                  bin.fillLevel > 90 ? '#e74c3c' :
                                  bin.fillLevel > 70 ? '#f39c12' : '#2ecc71'
                              }} />
                            </div>
                            <span>{bin.fillLevel}%</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: 
                              bin.status === 'critical' ? '#e74c3c20' :
                              bin.status === 'warning' ? '#f39c1220' : '#2ecc7120',
                            color: 
                              bin.status === 'critical' ? '#e74c3c' :
                              bin.status === 'warning' ? '#f39c12' : '#2ecc71'
                          }}>
                            {bin.status === 'critical' ? 'Critical' :
                             bin.status === 'warning' ? 'Warning' : 'Normal'}
                          </span>
                        </td>
                        <td style={styles.td}>{bin.lastUpdated}</td>
                        <td style={styles.td}>
                          <button style={styles.editBtn}>Edit</button>
                          <button style={styles.viewBtn}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {selectedTab === 'analytics' && (
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>📈 System Analytics</h2>
              <p style={styles.comingSoon}>Analytics charts and graphs coming soon...</p>
            </div>
          )}

          {/* SETTINGS TAB */}
          {selectedTab === 'settings' && (
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>⚙️ Settings</h2>
              <p style={styles.comingSoon}>Settings panel coming soon...</p>
            </div>
          )}
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
  adminProfile: {
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
  adminInfo: {
    overflow: 'hidden'
  },
  adminName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#023047',
    margin: 0,
    whiteSpace: 'nowrap'
  },
  adminRole: {
    fontSize: '0.85rem',
    color: '#00b4d8',
    margin: '0.2rem 0 0 0',
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
    width: '350px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
  statSubtext: {
    fontSize: '0.75rem',
    color: '#00b4d8',
    margin: '0.2rem 0 0 0'
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
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  addBtn: {
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: '#00b4d8',
    color: 'white',
    borderRadius: '8px',
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
    margin: '0 0 0.3rem 0'
  },
  binAssigned: {
    fontSize: '0.85rem',
    color: '#00b4d8',
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
  assignBtn: {
    padding: '0.3rem 0.8rem',
    border: 'none',
    backgroundColor: '#00b4d8',
    color: 'white',
    borderRadius: '5px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  approvalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  approvalItem: {
    padding: '1rem',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa'
  },
  approvalHeader: {
    display: 'flex',
    gap: '0.8rem',
    marginBottom: '0.5rem'
  },
  approvalIcon: {
    fontSize: '1.2rem',
    color: '#00b4d8',
    marginTop: '0.2rem'
  },
  approvalInfo: {
    flex: 1
  },
  approvalName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#023047',
    margin: 0
  },
  approvalDetails: {
    fontSize: '0.8rem',
    color: '#666',
    margin: '0.2rem 0 0 0'
  },
  approvalCnic: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0.5rem 0 0.2rem 0'
  },
  approvalDate: {
    fontSize: '0.8rem',
    color: '#999',
    margin: '0 0 0.8rem 0'
  },
  approvalActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  approveBtn: {
    padding: '0.4rem 1rem',
    border: 'none',
    backgroundColor: '#2ecc71',
    color: 'white',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  rejectBtn: {
    padding: '0.4rem 1rem',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  statsDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  statRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f0f0f0'
  },
  statRowLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: 500
  },
  statRowValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#023047'
  },
  progressGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  progressFill: {
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.3s'
  },
  progressLabel: {
    fontSize: '0.8rem',
    color: '#666',
    minWidth: '80px'
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
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    color: '#023047',
    fontSize: '0.9rem',
    fontWeight: 600,
    borderBottom: '2px solid #e0e0e0'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #f0f0f0',
    color: '#666',
    fontSize: '0.9rem'
  },
  statusBadge: {
    padding: '0.3rem 0.6rem',
    borderRadius: '5px',
    fontSize: '0.8rem',
    fontWeight: 500
  },
  tableFillLevel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  tableFillBar: {
    width: '60px',
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  tableFillFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  editBtn: {
    padding: '0.3rem 0.6rem',
    border: 'none',
    backgroundColor: '#00b4d8',
    color: 'white',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    marginRight: '0.3rem'
  },
  viewBtn: {
    padding: '0.3rem 0.6rem',
    border: 'none',
    backgroundColor: '#95a5a6',
    color: 'white',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  comingSoon: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
    padding: '3rem'
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
  
  .assign-btn:hover, .add-btn:hover, .edit-btn:hover {
    background: #0077b6 !important;
    transform: scale(1.05);
  }
  
  .export-btn:hover {
    background: #00b4d8 !important;
    color: white !important;
    border: 2px solid #00b4d8 !important;
  }
  
  .approve-btn:hover {
    background-color: #27ae60 !important;
  }
  
  .reject-btn:hover {
    background-color: #c0392b !important;
  }
  
  .view-btn:hover {
    background-color: #7f8c8d !important;
  }
  
  .notification-item:hover {
    background-color: #f5f5f5 !important;
  }
  
  @media (max-width: 768px) {
    .main-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;