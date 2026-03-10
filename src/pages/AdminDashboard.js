import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUser, FiBell, FiSettings, FiLogOut, 
  FiCalendar, FiMapPin, FiClock, FiTrash2, 
  FiBarChart2,
  FiDownload, FiRefreshCw, FiEye, FiEyeOff,
  FiUsers, FiPieChart, FiActivity, FiFilter,
  FiChevronRight, FiChevronLeft
} from 'react-icons/fi';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dateRange, setDateRange] = useState('week');
  const [showStats, setShowStats] = useState(true);
  const navigate = useNavigate();

  // Mock data for admin
  const adminInfo = {
    name: "Admin User",
    role: "System Administrator",
    employeeId: "ADMIN-001",
    email: "admin@smartgarbage.com",
    profilePic: null
  };

  // Mock users data
  const users = [
    { id: 1, name: "Ahmed Raza", email: "ahmed@example.com", role: "Worker", area: "Sector F-7", bins: 12, status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Fatima Khan", email: "fatima@example.com", role: "Worker", area: "Sector G-10", bins: 8, status: "active", joinDate: "2024-02-20" },
    { id: 3, name: "Usman Ali", email: "usman@example.com", role: "Worker", area: "Sector F-8", bins: 15, status: "inactive", joinDate: "2024-01-10" },
    { id: 4, name: "Sana Malik", email: "sana@example.com", role: "Worker", area: "Sector G-11", bins: 10, status: "active", joinDate: "2024-03-05" },
    { id: 5, name: "Bilal Ahmed", email: "bilal@example.com", role: "Worker", area: "Sector F-6", bins: 7, status: "active", joinDate: "2024-02-28" },
  ];

  // Mock bins data
  const allBins = [
    { id: "BIN-001", location: "Sector F-7", area: "F-7", assignedTo: "Ahmed Raza", fillLevel: 85, status: "warning", lastUpdated: "2 min ago" },
    { id: "BIN-002", location: "Sector G-10", area: "G-10", assignedTo: "Fatima Khan", fillLevel: 45, status: "normal", lastUpdated: "5 min ago" },
    { id: "BIN-003", location: "Sector F-8", area: "F-8", assignedTo: "Usman Ali", fillLevel: 95, status: "critical", lastUpdated: "1 min ago" },
    { id: "BIN-004", location: "Sector G-11", area: "G-11", assignedTo: "Sana Malik", fillLevel: 20, status: "normal", lastUpdated: "10 min ago" },
    { id: "BIN-005", location: "Sector F-6", area: "F-6", assignedTo: "Bilal Ahmed", fillLevel: 70, status: "warning", lastUpdated: "3 min ago" },
    { id: "BIN-006", location: "Sector F-7", area: "F-7", assignedTo: "Ahmed Raza", fillLevel: 30, status: "normal", lastUpdated: "8 min ago" },
    { id: "BIN-007", location: "Sector G-10", area: "G-10", assignedTo: "Fatima Khan", fillLevel: 60, status: "warning", lastUpdated: "12 min ago" },
    { id: "BIN-008", location: "Sector F-8", area: "F-8", assignedTo: "Usman Ali", fillLevel: 15, status: "normal", lastUpdated: "15 min ago" },
  ];

  // Mock reports data
  const reports = {
    weekly: {
      collections: 1245,
      avgFillRate: "68%",
      criticalIncidents: 23,
      efficiency: "94%"
    },
    monthly: {
      collections: 5230,
      avgFillRate: "72%",
      criticalIncidents: 87,
      efficiency: "91%"
    }
  };

  // Stats calculations
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalBins: allBins.length,
    criticalBins: allBins.filter(b => b.status === 'critical').length,
    warningBins: allBins.filter(b => b.status === 'warning').length,
    normalBins: allBins.filter(b => b.status === 'normal').length,
    totalAreas: [...new Set(users.map(u => u.area))].length
  };

  // Settings data
  const settings = {
    systemName: "Smart Garbage System",
    version: "2.0.0",
    lastBackup: "2024-03-10 03:00 AM",
    emailNotifications: true,
    autoReports: true,
    dataRetention: "30 days",
    timezone: "Asia/Karachi",
    language: "English"
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  // Mock chart component (placeholder)
  const ChartPlaceholder = ({ title, data }) => (
    <div style={styles.chartContainer}>
      <h4 style={styles.chartTitle}>{title}</h4>
      <div style={styles.chartBars}>
        {data.map((value, index) => (
          <div key={index} style={styles.chartBarWrapper}>
            <div style={{
              ...styles.chartBar,
              height: `${value}%`,
              backgroundColor: index === 6 ? '#00b4d8' : '#0077b6'
            }} />
            <span style={styles.chartLabel}>Day {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );

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
        <div style={styles.userProfile}>
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
            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{adminInfo.name}</h3>
              <p style={styles.userRole}>{adminInfo.role}</p>
              <p style={styles.userId}>ID: {adminInfo.employeeId}</p>
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
            onClick={() => setSelectedTab('users')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'users' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiUsers style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>User Management</span>}
            {sidebarOpen && <span style={styles.badge}>{stats.totalUsers}</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('bins')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'bins' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiTrash2 style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>All Bins</span>}
            {sidebarOpen && <span style={styles.badge}>{stats.totalBins}</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('reports')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'reports' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiBarChart2 style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Reports</span>}
          </button>

          <button 
            onClick={() => setSelectedTab('allocations')}
            style={{...styles.navItem, backgroundColor: selectedTab === 'allocations' ? 'rgba(0,180,216,0.1)' : 'transparent'}}
          >
            <FiMapPin style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Allocations</span>}
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
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{...styles.mainContent, marginLeft: sidebarOpen ? '280px' : '80px'}}>
        
        {/* ===== TOP NAVBAR ===== */}
        <div style={styles.topNavbar}>
          <h1 style={styles.pageTitle}>
            {selectedTab === 'overview' && 'Dashboard Overview'}
            {selectedTab === 'users' && 'User Management'}
            {selectedTab === 'bins' && 'All Bins Monitoring'}
            {selectedTab === 'reports' && 'Reports & Analytics'}
            {selectedTab === 'allocations' && 'User & Bin Allocations'}
            {selectedTab === 'settings' && 'System Settings'}
          </h1>
          
          <div style={styles.topNavActions}>
            {/* Search Bar */}
            <div style={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search users, bins, or areas..." 
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
                <span style={styles.notificationBadge}>3</span>
              </button>
              
              {notificationsOpen && (
                <div style={styles.notificationDropdown}>
                  <h4 style={styles.dropdownTitle}>Alerts</h4>
                  <div style={styles.notificationItem}>
                    <div style={{...styles.notificationDot, backgroundColor: '#e74c3c'}} />
                    <div style={styles.notificationContent}>
                      <p style={styles.notificationMessage}>BIN-003 is critical (95% full)</p>
                      <span style={styles.notificationTime}>1 min ago</span>
                    </div>
                  </div>
                  <div style={styles.notificationItem}>
                    <div style={{...styles.notificationDot, backgroundColor: '#f39c12'}} />
                    <div style={styles.notificationContent}>
                      <p style={styles.notificationMessage}>3 bins in warning state</p>
                      <span style={styles.notificationTime}>5 min ago</span>
                    </div>
                  </div>
                  <div style={styles.notificationItem}>
                    <div style={{...styles.notificationDot, backgroundColor: '#3498db'}} />
                    <div style={styles.notificationContent}>
                      <p style={styles.notificationMessage}>New user registered</p>
                      <span style={styles.notificationTime}>1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button style={styles.refreshBtn}>
              <FiRefreshCw style={styles.refreshIcon} />
            </button>
          </div>
        </div>

        {/* ===== DASHBOARD CONTENT BASED ON SELECTED TAB ===== */}
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
                    <h3 style={styles.statValue}>{stats.totalUsers}</h3>
                    <p style={styles.statLabel}>Total Users</p>
                    <small style={styles.statSubtext}>{stats.activeUsers} active</small>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiTrash2 style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{stats.totalBins}</h3>
                    <p style={styles.statLabel}>Total Bins</p>
                    <small style={styles.statSubtext}>{stats.criticalBins} critical</small>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiMapPin style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{stats.totalAreas}</h3>
                    <p style={styles.statLabel}>Sectors Covered</p>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiActivity style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>94%</h3>
                    <p style={styles.statLabel}>Efficiency</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div style={styles.chartsSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Weekly Analytics</h2>
                  <button 
                    onClick={() => setShowStats(!showStats)}
                    style={styles.viewAllBtn}
                  >
                    {showStats ? <FiEyeOff /> : <FiEye />} {showStats ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showStats && (
                  <div style={styles.chartsGrid}>
                    <ChartPlaceholder 
                      title="Bin Fill Rate Trend" 
                      data={[45, 60, 75, 55, 80, 65, 90]} 
                    />
                    <ChartPlaceholder 
                      title="Collections per Day" 
                      data={[65, 70, 85, 60, 75, 80, 95]} 
                    />
                  </div>
                )}
              </div>

              {/* Status Distribution */}
              <div style={styles.statusSection}>
                <h2 style={styles.sectionTitle}>Bin Status Distribution</h2>
                <div style={styles.statusBars}>
                  <div style={styles.statusBarItem}>
                    <span style={styles.statusLabel}>
                      <span style={{color: '#2ecc71'}}>●</span> Normal ({stats.normalBins})
                    </span>
                    <div style={styles.statusBarContainer}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(stats.normalBins/stats.totalBins)*100}%`,
                        backgroundColor: '#2ecc71'
                      }} />
                    </div>
                  </div>
                  <div style={styles.statusBarItem}>
                    <span style={styles.statusLabel}>
                      <span style={{color: '#f39c12'}}>●</span> Warning ({stats.warningBins})
                    </span>
                    <div style={styles.statusBarContainer}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(stats.warningBins/stats.totalBins)*100}%`,
                        backgroundColor: '#f39c12'
                      }} />
                    </div>
                  </div>
                  <div style={styles.statusBarItem}>
                    <span style={styles.statusLabel}>
                      <span style={{color: '#e74c3c'}}>●</span> Critical ({stats.criticalBins})
                    </span>
                    <div style={styles.statusBarContainer}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(stats.criticalBins/stats.totalBins)*100}%`,
                        backgroundColor: '#e74c3c'
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Critical Bins */}
              <div style={styles.recentSection}>
                <h2 style={styles.sectionTitle}>Critical Bins Needing Attention</h2>
                <div style={styles.criticalList}>
                  {allBins.filter(b => b.status === 'critical' || b.status === 'warning').slice(0, 5).map(bin => (
                    <div key={bin.id} style={styles.criticalItem}>
                      <div style={styles.criticalInfo}>
                        <strong>{bin.id}</strong> - {bin.location}
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: bin.status === 'critical' ? '#e74c3c' : '#f39c12',
                          color: 'white'
                        }}>
                          {bin.fillLevel}% full
                        </span>
                      </div>
                      <small>Assigned to: {bin.assignedTo} • Updated {bin.lastUpdated}</small>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* USERS TAB */}
          {selectedTab === 'users' && (
            <div style={styles.tableSection}>
              <div style={styles.tableHeader}>
                <h2 style={styles.sectionTitle}>User Management</h2>
                <button style={styles.addButton}>+ Add New User</button>
              </div>
              
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Area</th>
                      <th>Assigned Bins</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.area}</td>
                        <td>{user.bins}</td>
                        <td>
                          <span style={{
                            ...styles.statusChip,
                            backgroundColor: user.status === 'active' ? '#2ecc7120' : '#e74c3c20',
                            color: user.status === 'active' ? '#2ecc71' : '#e74c3c'
                          }}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.joinDate}</td>
                        <td>
                          <button style={styles.actionBtn}>✏️</button>
                          <button style={styles.actionBtn}>🗑️</button>
                          <button style={styles.actionBtn}>👁️</button>
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
            <div style={styles.tableSection}>
              <div style={styles.tableHeader}>
                <h2 style={styles.sectionTitle}>All Bins Monitoring</h2>
                <div style={styles.filterGroup}>
                  <FiFilter style={styles.filterIcon} />
                  <select style={styles.filterSelect}>
                    <option>All Areas</option>
                    <option>F-7</option>
                    <option>F-8</option>
                    <option>G-10</option>
                    <option>G-11</option>
                  </select>
                  <select style={styles.filterSelect}>
                    <option>All Status</option>
                    <option>Normal</option>
                    <option>Warning</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Bin ID</th>
                      <th>Location</th>
                      <th>Area</th>
                      <th>Assigned To</th>
                      <th>Fill Level</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBins.map(bin => (
                      <tr key={bin.id}>
                        <td><strong>{bin.id}</strong></td>
                        <td>{bin.location}</td>
                        <td>{bin.area}</td>
                        <td>{bin.assignedTo}</td>
                        <td>
                          <div style={styles.tableProgress}>
                            <div style={styles.tableProgressBar}>
                              <div style={{
                                ...styles.tableProgressFill,
                                width: `${bin.fillLevel}%`,
                                backgroundColor: 
                                  bin.fillLevel > 90 ? '#e74c3c' :
                                  bin.fillLevel > 70 ? '#f39c12' : '#2ecc71'
                              }} />
                            </div>
                            <span>{bin.fillLevel}%</span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            ...styles.statusChip,
                            backgroundColor: 
                              bin.status === 'critical' ? '#e74c3c20' :
                              bin.status === 'warning' ? '#f39c1220' : '#2ecc7120',
                            color: 
                              bin.status === 'critical' ? '#e74c3c' :
                              bin.status === 'warning' ? '#f39c12' : '#2ecc71'
                          }}>
                            {bin.status}
                          </span>
                        </td>
                        <td>{bin.lastUpdated}</td>
                        <td>
                          <button style={styles.actionBtn}>✏️</button>
                          <button style={styles.actionBtn}>🔄</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {selectedTab === 'reports' && (
            <>
              <div style={styles.reportHeader}>
                <h2 style={styles.sectionTitle}>Reports & Analytics</h2>
                <div style={styles.reportControls}>
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    style={styles.reportSelect}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <button style={styles.exportBtn}>
                    <FiDownload /> Export PDF
                  </button>
                </div>
              </div>

              <div style={styles.reportCards}>
                <div style={styles.reportCard}>
                  <h3>Total Collections</h3>
                  <p style={styles.reportNumber}>
                    {dateRange === 'week' ? reports.weekly.collections : reports.monthly.collections}
                  </p>
                  <small>vs last period: +12%</small>
                </div>
                <div style={styles.reportCard}>
                  <h3>Avg Fill Rate</h3>
                  <p style={styles.reportNumber}>
                    {dateRange === 'week' ? reports.weekly.avgFillRate : reports.monthly.avgFillRate}
                  </p>
                </div>
                <div style={styles.reportCard}>
                  <h3>Critical Incidents</h3>
                  <p style={styles.reportNumber}>
                    {dateRange === 'week' ? reports.weekly.criticalIncidents : reports.monthly.criticalIncidents}
                  </p>
                </div>
                <div style={styles.reportCard}>
                  <h3>Efficiency</h3>
                  <p style={styles.reportNumber}>
                    {dateRange === 'week' ? reports.weekly.efficiency : reports.monthly.efficiency}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div style={styles.chartsSection}>
                <h2 style={styles.sectionTitle}>Trend Analysis</h2>
                <div style={styles.chartsGrid}>
                  <ChartPlaceholder 
                    title="Weekly Collection Trends" 
                    data={[50, 65, 80, 70, 85, 90, 75]} 
                  />
                  <ChartPlaceholder 
                    title="Fill Rate Distribution" 
                    data={[30, 45, 60, 75, 80, 70, 85]} 
                  />
                </div>
              </div>
            </>
          )}

          {/* ALLOCATIONS TAB */}
          {selectedTab === 'allocations' && (
            <div style={styles.allocationsSection}>
              <h2 style={styles.sectionTitle}>User & Bin Allocations</h2>
              
              <div style={styles.allocationsGrid}>
                {users.map(user => (
                  <div key={user.id} style={styles.allocationCard}>
                    <div style={styles.allocationHeader}>
                      <div style={styles.allocationAvatar}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3>{user.name}</h3>
                        <p>{user.area}</p>
                      </div>
                    </div>
                    <div style={styles.allocationBins}>
                      <strong>Assigned Bins: {user.bins}</strong>
                      <div style={styles.binTags}>
                        {allBins.filter(b => b.assignedTo === user.name).map(b => (
                          <span key={b.id} style={{
                            ...styles.binTag,
                            backgroundColor: 
                              b.fillLevel > 90 ? '#e74c3c20' :
                              b.fillLevel > 70 ? '#f39c1220' : '#2ecc7120',
                            color: 
                              b.fillLevel > 90 ? '#e74c3c' :
                              b.fillLevel > 70 ? '#f39c12' : '#2ecc71'
                          }}>
                            {b.id} ({b.fillLevel}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={styles.allocationActions}>
                      <button style={styles.allocationBtn}>Reassign Bins</button>
                      <button style={styles.allocationBtn}>Change Area</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB - FIXED! */}
          {selectedTab === 'settings' && (
            <div style={styles.settingsSection}>
              <h2 style={styles.sectionTitle}>System Settings</h2>
              
              <div style={styles.settingsGrid}>
                {/* General Settings */}
                <div style={styles.settingsCard}>
                  <h3 style={styles.settingsCardTitle}>⚙️ General</h3>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>System Name</span>
                    <span style={styles.settingsValue}>{settings.systemName}</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Version</span>
                    <span style={styles.settingsValue}>{settings.version}</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Last Backup</span>
                    <span style={styles.settingsValue}>{settings.lastBackup}</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Timezone</span>
                    <span style={styles.settingsValue}>{settings.timezone}</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Language</span>
                    <span style={styles.settingsValue}>{settings.language}</span>
                  </div>
                </div>

                {/* Notification Settings */}
                <div style={styles.settingsCard}>
                  <h3 style={styles.settingsCardTitle}>🔔 Notifications</h3>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Email Notifications</span>
                    <span style={{
                      ...styles.settingsValue,
                      color: settings.emailNotifications ? '#2ecc71' : '#e74c3c'
                    }}>
                      {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Auto Reports</span>
                    <span style={{
                      ...styles.settingsValue,
                      color: settings.autoReports ? '#2ecc71' : '#e74c3c'
                    }}>
                      {settings.autoReports ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Data Retention</span>
                    <span style={styles.settingsValue}>{settings.dataRetention}</span>
                  </div>
                </div>

                {/* Security Settings */}
                <div style={styles.settingsCard}>
                  <h3 style={styles.settingsCardTitle}>🔒 Security</h3>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Two-Factor Auth</span>
                    <span style={{...styles.settingsValue, color: '#f39c12'}}>Optional</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Session Timeout</span>
                    <span style={styles.settingsValue}>30 minutes</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Password Policy</span>
                    <span style={styles.settingsValue}>Strong</span>
                  </div>
                  <button style={styles.settingsButton}>Change Password</button>
                </div>

                {/* Database Settings */}
                <div style={styles.settingsCard}>
                  <h3 style={styles.settingsCardTitle}>🗄️ Database</h3>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Type</span>
                    <span style={styles.settingsValue}>MySQL</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Size</span>
                    <span style={styles.settingsValue}>2.3 GB</span>
                  </div>
                  <div style={styles.settingsItem}>
                    <span style={styles.settingsLabel}>Backup Schedule</span>
                    <span style={styles.settingsValue}>Daily 3 AM</span>
                  </div>
                  <button style={styles.settingsButton}>Backup Now</button>
                </div>
              </div>

              {/* API Settings */}
              <div style={styles.settingsCardFull}>
                <h3 style={styles.settingsCardTitle}>🔌 API Configuration</h3>
                <div style={styles.apiSettings}>
                  <div style={styles.apiItem}>
                    <span style={styles.apiLabel}>API Endpoint</span>
                    <code style={styles.apiCode}>https://api.smartgarbage.com/v2</code>
                  </div>
                  <div style={styles.apiItem}>
                    <span style={styles.apiLabel}>API Key</span>
                    <code style={styles.apiCode}>sk_live_••••••••••••••••</code>
                  </div>
                  <div style={styles.apiItem}>
                    <span style={styles.apiLabel}>Webhook URL</span>
                    <code style={styles.apiCode}>https://api.smartgarbage.com/webhook</code>
                  </div>
                </div>
                <div style={styles.apiActions}>
                  <button style={styles.apiButton}>Regenerate Key</button>
                  <button style={styles.apiButton}>Test Connection</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Colors
const colors = {
  primary: '#00b4d8',
  secondary: '#0077b6',
  dark: '#023047',
  light: '#f8f9fa',
  white: '#ffffff',
  gradient: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)'
};

// ==================== STYLES ====================
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Sidebar Styles
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
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  logoContainer: {
    padding: '2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '2px solid #f0f0f0',
    flexShrink: 0
  },
  logoIcon: {
    fontSize: '2.5rem'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.dark,
    whiteSpace: 'nowrap'
  },
  userProfile: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '2px solid #f0f0f0',
    flexShrink: 0
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
    backgroundColor: colors.primary,
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
    color: colors.dark,
    margin: 0,
    whiteSpace: 'nowrap'
  },
  userRole: {
    fontSize: '0.85rem',
    color: colors.primary,
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
    gap: '0.5rem',
    overflowY: 'auto'
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
    color: '#666',
    background: 'transparent'
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
    backgroundColor: colors.primary,
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
    justifyContent: 'space-between',
    flexShrink: 0
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
    border: `2px solid ${colors.primary}`,
    backgroundColor: 'white',
    color: colors.primary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    transition: 'all 0.3s',
    flexShrink: 0
  },

  // Main Content
  mainContent: {
    flex: 1,
    padding: '2rem',
    transition: 'margin-left 0.3s ease',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh'
  },
  topNavbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    backgroundColor: 'white',
    padding: '1rem 2rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  pageTitle: {
    fontSize: '1.5rem',
    color: colors.dark,
    margin: 0
  },
  topNavActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
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
    backgroundColor: '#e74c3c',
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
    color: colors.dark,
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

  // Dashboard Content
  dashboardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },

  // Stats Grid
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
    color: colors.primary
  },
  statInfo: {
    flex: 1
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.dark,
    margin: 0,
    marginBottom: '0.2rem'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    margin: 0
  },
  statSubtext: {
    fontSize: '0.7rem',
    color: '#999'
  },

  // Charts Section
  chartsSection: {
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
    fontSize: '1.2rem',
    fontWeight: 600,
    color: colors.dark,
    margin: 0
  },
  viewAllBtn: {
    padding: '0.3rem 0.8rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.primary,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  chartContainer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  chartTitle: {
    fontSize: '1rem',
    color: colors.dark,
    marginBottom: '1rem'
  },
  chartBars: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '150px'
  },
  chartBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '30px'
  },
  chartBar: {
    width: '20px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s'
  },
  chartLabel: {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '0.3rem'
  },

  // Status Section
  statusSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  statusBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  statusBarItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  statusLabel: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#666'
  },
  statusBarContainer: {
    height: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  statusBarFill: {
    height: '100%',
    transition: 'width 0.3s'
  },

  // Recent Section
  recentSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  criticalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  criticalItem: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  criticalInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  statusBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '5px',
    fontSize: '0.75rem',
    fontWeight: 600
  },

  // Table Section
  tableSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    overflowX: 'auto'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  addButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  statusChip: {
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
    display: 'inline-block'
  },
  actionBtn: {
    padding: '0.3rem 0.6rem',
    margin: '0 0.2rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'transform 0.3s'
  },
  tableProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  tableProgressBar: {
    width: '60px',
    height: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  tableProgressFill: {
    height: '100%',
    transition: 'width 0.3s'
  },

  // Filter Group
  filterGroup: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  filterIcon: {
    fontSize: '1.2rem',
    color: '#666'
  },
  filterSelect: {
    padding: '0.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    outline: 'none'
  },

  // Report Section
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  reportControls: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  reportSelect: {
    padding: '0.6rem',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    outline: 'none'
  },
  exportBtn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  reportCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  reportCard: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  reportNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: colors.primary,
    margin: '0.5rem 0'
  },

  // Allocations Section
  allocationsSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  allocationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  allocationCard: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  allocationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  allocationAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  allocationBins: {
    marginBottom: '1rem'
  },
  binTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  binTag: {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    fontSize: '0.8rem'
  },
  allocationActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  allocationBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    border: `1px solid ${colors.primary}`,
    color: colors.primary,
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  },

  // Settings Section - FIXED!
  settingsSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  settingsCard: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  settingsCardTitle: {
    fontSize: '1.1rem',
    color: colors.dark,
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: `2px solid ${colors.primary}`
  },
  settingsItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #e0e0e0'
  },
  settingsLabel: {
    fontSize: '0.9rem',
    color: '#666'
  },
  settingsValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: colors.dark
  },
  settingsButton: {
    padding: '0.6rem',
    backgroundColor: 'white',
    border: `1px solid ${colors.primary}`,
    color: colors.primary,
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'all 0.3s'
  },
  settingsCardFull: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    marginTop: '1rem'
  },
  apiSettings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem'
  },
  apiItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  apiLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: 500
  },
  apiCode: {
    padding: '0.5rem',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    fontSize: '0.85rem',
    fontFamily: 'monospace'
  },
  apiActions: {
    display: 'flex',
    gap: '1rem'
  },
  apiButton: {
    padding: '0.6rem 1rem',
    backgroundColor: 'white',
    border: `1px solid ${colors.primary}`,
    color: colors.primary,
    borderRadius: '5px',
    cursor: 'pointer'
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
  
  .stat-card:hover,
  .settings-card:hover,
  .allocation-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,180,216,0.15);
  }
  
  .action-btn:hover {
    transform: scale(1.1);
  }
  
  .add-button:hover,
  .export-btn:hover,
  .allocation-btn:hover,
  .settings-button:hover,
  .api-button:hover {
    background-color: ${colors.primary} !important;
    color: white !important;
  }
  
  .toggle-btn:hover {
    background-color: ${colors.primary} !important;
    color: white !important;
  }
  
  @media (max-width: 768px) {
    .main-content {
      margin-left: 80px !important;
    }
    
    .stats-grid,
    .charts-grid,
    .settings-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;