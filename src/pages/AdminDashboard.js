import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiMapPin, FiClock, FiSettings, FiLogOut,
  FiBarChart2, FiTrash2, FiAlertCircle, FiCheckCircle, FiDownload,
  FiEye, FiEyeOff, FiRefreshCw, FiBell, FiUser, FiCalendar,
  FiDroplet, FiThermometer, FiWind, FiTrendingUp
} from 'react-icons/fi';
import { getUsers, getBins, getAllBinIds, calculateFillPercentage } from '../utils/csvParser';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showStats, setShowStats] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // State for CSV data
  const [users, setUsers] = useState([]);
  const [bins, setBins] = useState([]);
  const [binIds, setBinIds] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBins: 0,
    criticalBins: 0,
    warningBins: 0,
    normalBins: 0,
    avgFillLevel: 0
  });
  
  const navigate = useNavigate();

  // Load data from CSV files
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch users and bins data
        const usersData = await getUsers();
        const binsData = await getBins();
        const binIdsData = await getAllBinIds();
        
        setUsers(usersData.filter(u => u.role === 'user'));
        setBins(binsData);
        setBinIds(binIdsData);
        
        // Calculate system statistics
        const critical = binsData.filter(b => {
          const fill = calculateFillPercentage(parseFloat(b.Calibrated_Value || b.fill_level || 0));
          return fill > 90;
        }).length;
        
        const warning = binsData.filter(b => {
          const fill = calculateFillPercentage(parseFloat(b.Calibrated_Value || b.fill_level || 0));
          return fill > 70 && fill <= 90;
        }).length;
        
        const normal = binsData.filter(b => {
          const fill = calculateFillPercentage(parseFloat(b.Calibrated_Value || b.fill_level || 0));
          return fill <= 70;
        }).length;
        
        const avgFill = binsData.reduce((sum, b) => {
          return sum + calculateFillPercentage(parseFloat(b.Calibrated_Value || b.fill_level || 0));
        }, 0) / (binsData.length || 1);
        
        setSystemStats({
          totalUsers: usersData.filter(u => u.role === 'user').length,
          activeUsers: usersData.filter(u => u.role === 'user' && u.status === 'active').length,
          totalBins: binsData.length,
          criticalBins: critical,
          warningBins: warning,
          normalBins: normal,
          avgFillLevel: Math.round(avgFill)
        });
        
      } catch (error) {
        console.error('Error loading CSV data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Prevent back swipe gesture
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.dispatchEvent(new CustomEvent('openLogin'));
  };

  // Get fill level and status for a bin
  const getBinFillData = (bin) => {
    const distance = parseFloat(bin.Calibrated_Value || bin.fill_level || 0);
    const fillPercent = calculateFillPercentage(distance);
    let status = 'normal';
    if (fillPercent > 90) status = 'critical';
    else if (fillPercent > 70) status = 'warning';
    return { fillPercent, status };
  };

  // Get recent bins for display
  const getRecentBins = () => {
    return bins.slice(0, 5).map(bin => {
      const { fillPercent, status } = getBinFillData(bin);
      return {
        id: bin.Device_Tag || bin.bin_id || 'Unknown',
        fillLevel: fillPercent,
        status: status,
        lastUpdated: bin.Timestamp_UTC || bin.last_updated || new Date().toLocaleString()
      };
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <div style={{...styles.sidebar, width: sidebarOpen ? '280px' : '80px'}}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>♻️</span>
          {sidebarOpen && <span style={styles.logoText}>Admin Panel</span>}
        </div>

        <div style={styles.adminProfile}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatarPlaceholder}>A</div>
          </div>
          {sidebarOpen && (
            <div style={styles.adminInfo}>
              <h3 style={styles.adminName}>Admin User</h3>
              <p style={styles.adminRole}>System Administrator</p>
            </div>
          )}
        </div>

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

        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FiLogOut style={styles.navIcon} />
            {sidebarOpen && <span style={styles.navText}>Logout</span>}
          </button>
          
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
            <div style={styles.searchBar}>
              <input type="text" placeholder="Search workers, bins..." style={styles.searchInput} />
              <button style={styles.searchBtn}>🔍</button>
            </div>

            <button style={styles.refreshBtn} onClick={() => window.location.reload()}>
              <FiRefreshCw style={styles.refreshIcon} />
            </button>
          </div>
        </div>

        {/* ===== DASHBOARD CONTENT ===== */}
        <div style={styles.dashboardContent}>
          
          {/* OVERVIEW TAB */}
          {selectedTab === 'overview' && (
            <>
              {/* Stats Cards - Real data from CSV */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiUsers style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{systemStats.totalUsers}</h3>
                    <p style={styles.statLabel}>Total Workers</p>
                    <p style={styles.statSubtext}>{systemStats.activeUsers} active</p>
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
                    <FiBarChart2 style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>{systemStats.avgFillLevel}%</h3>
                    <p style={styles.statLabel}>Average Fill Level</p>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIconContainer}>
                    <FiTrendingUp style={styles.statIcon} />
                  </div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statValue}>
                      {systemStats.totalBins > 0 ? Math.round((systemStats.normalBins / systemStats.totalBins) * 100) : 0}%
                    </h3>
                    <p style={styles.statLabel}>Efficiency Rate</p>
                  </div>
                </div>
              </div>

              {/* Status Distribution */}
              <div style={styles.sectionCard}>
                <h2 style={styles.sectionTitle}>Bin Status Distribution</h2>
                <div style={styles.statusBars}>
                  <div style={styles.statusBarItem}>
                    <span style={styles.statusLabel}>🟢 Normal ({systemStats.normalBins})</span>
                    <div style={styles.statusBarContainer}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(systemStats.normalBins / systemStats.totalBins) * 100}%`,
                        backgroundColor: '#2ecc71'
                      }} />
                    </div>
                  </div>
                  <div style={styles.statusBarItem}>
                    <span style={styles.statusLabel}>🟡 Warning ({systemStats.warningBins})</span>
                    <div style={styles.statusBarContainer}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(systemStats.warningBins / systemStats.totalBins) * 100}%`,
                        backgroundColor: '#f39c12'
                      }} />
                    </div>
                  </div>
                  <div style={styles.statusBarItem}>
                    <span style={styles.statusLabel}>🔴 Critical ({systemStats.criticalBins})</span>
                    <div style={styles.statusBarContainer}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(systemStats.criticalBins / systemStats.totalBins) * 100}%`,
                        backgroundColor: '#e74c3c'
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bins Data */}
              <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Recent Bin Readings</h2>
                </div>
                <div style={styles.binsList}>
                  {getRecentBins().map((bin, idx) => (
                    <div key={idx} style={styles.binItem}>
                      <div style={styles.binHeader}>
                        <span style={styles.binId}>{bin.id}</span>
                        <span style={{
                          ...styles.binStatus,
                          backgroundColor: bin.status === 'critical' ? '#e74c3c20' : bin.status === 'warning' ? '#f39c1220' : '#2ecc7120',
                          color: bin.status === 'critical' ? '#e74c3c' : bin.status === 'warning' ? '#f39c12' : '#2ecc71'
                        }}>
                          {bin.status === 'critical' ? 'Critical' : bin.status === 'warning' ? 'Warning' : 'Normal'}
                        </span>
                      </div>
                      <div style={styles.fillLevelContainer}>
                        <div style={styles.fillLevelBar}>
                          <div style={{
                            ...styles.fillLevelFill,
                            width: `${bin.fillLevel}%`,
                            backgroundColor: bin.fillLevel > 90 ? '#e74c3c' : bin.fillLevel > 70 ? '#f39c12' : '#2ecc71'
                          }} />
                        </div>
                        <span style={styles.fillLevelText}>{bin.fillLevel}% full</span>
                      </div>
                      <div style={styles.binFooter}>
                        <FiClock style={styles.binFooterIcon} />
                        <span style={styles.binFooterText}>Last: {bin.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* WORKERS TAB - Real data from CSV */}
          {selectedTab === 'workers' && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>👥 All Workers</h2>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Area</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td style={styles.td}>{user.name}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.area}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            backgroundColor: user.status === 'active' ? '#2ecc7120' : '#95a5a620',
                            color: user.status === 'active' ? '#2ecc71' : '#7f8c8d'
                          }}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
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

          {/* BINS TAB - Real data from CSV */}
          {selectedTab === 'bins' && (
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>🗑️ All Bins</h2>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Bin ID</th>
                      <th style={styles.th}>Fill Level</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Last Updated</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bins.map((bin, idx) => {
                      const { fillPercent, status } = getBinFillData(bin);
                      return (
                        <tr key={idx}>
                          <td style={styles.td}>{bin.Device_Tag || bin.bin_id || 'Unknown'}</td>
                          <td style={styles.td}>
                            <div style={styles.tableFillLevel}>
                              <div style={styles.tableFillBar}>
                                <div style={{
                                  ...styles.tableFillFill,
                                  width: `${fillPercent}%`,
                                  backgroundColor: fillPercent > 90 ? '#e74c3c' : fillPercent > 70 ? '#f39c12' : '#2ecc71'
                                }} />
                              </div>
                              <span>{fillPercent}%</span>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.statusBadge,
                              backgroundColor: status === 'critical' ? '#e74c3c20' : status === 'warning' ? '#f39c1220' : '#2ecc7120',
                              color: status === 'critical' ? '#e74c3c' : status === 'warning' ? '#f39c12' : '#2ecc71'
                            }}>
                              {status === 'critical' ? 'Critical' : status === 'warning' ? 'Warning' : 'Normal'}
                            </span>
                          </td>
                          <td style={styles.td}>{bin.Timestamp_UTC || bin.last_updated || '-'}</td>
                          <td style={styles.td}>
                            <button style={styles.editBtn}>Edit</button>
                            <button style={styles.viewBtn}>View</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {selectedTab === 'analytics' && (
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>📈 System Analytics</h2>
              <div style={styles.analyticsGrid}>
                <div style={styles.analyticsCard}>
                  <h3>Fill Level Distribution</h3>
                  <div style={styles.pieChartPlaceholder}>
                    <div style={styles.pieChartItem}>
                      <span style={{backgroundColor: '#2ecc71'}}></span>
                      <span>Normal: {systemStats.normalBins} bins</span>
                    </div>
                    <div style={styles.pieChartItem}>
                      <span style={{backgroundColor: '#f39c12'}}></span>
                      <span>Warning: {systemStats.warningBins} bins</span>
                    </div>
                    <div style={styles.pieChartItem}>
                      <span style={{backgroundColor: '#e74c3c'}}></span>
                      <span>Critical: {systemStats.criticalBins} bins</span>
                    </div>
                  </div>
                </div>
                <div style={styles.analyticsCard}>
                  <h3>System Summary</h3>
                  <div style={styles.summaryStats}>
                    <p><strong>Total Bins:</strong> {systemStats.totalBins}</p>
                    <p><strong>Total Workers:</strong> {systemStats.totalUsers}</p>
                    <p><strong>Active Workers:</strong> {systemStats.activeUsers}</p>
                    <p><strong>Average Fill Level:</strong> {systemStats.avgFillLevel}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {selectedTab === 'settings' && (
            <div style={styles.sectionCard}>
              <h2 style={styles.sectionTitle}>⚙️ Settings</h2>
              <div style={styles.settingsGroup}>
                <div style={styles.settingItem}>
                  <label>System Name</label>
                  <input type="text" defaultValue="Smart Garbage System" style={styles.settingInput} />
                </div>
                <div style={styles.settingItem}>
                  <label>Refresh Interval (seconds)</label>
                  <input type="number" defaultValue="30" style={styles.settingInput} />
                </div>
                <div style={styles.settingItem}>
                  <label>Notifications</label>
                  <select style={styles.settingSelect}>
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <button style={styles.saveSettingsBtn}>Save Settings</button>
              </div>
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

  // Loading styles
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f7fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #00b4d8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
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
    justifyContent: 'center'
  },

  // Main Content
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

  // Section Card
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
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#023047',
    margin: 0
  },

  // Status Bars
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

  // Bins List
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

  // Table Styles
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
    fontWeight: 500,
    display: 'inline-block'
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

  // Analytics Styles
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  analyticsCard: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  pieChartPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: '1rem'
  },
  pieChartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  summaryStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  // Settings Styles
  settingsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  settingItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem'
  },
  settingInput: {
    padding: '0.8rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem'
  },
  settingSelect: {
    padding: '0.8rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem'
  },
  saveSettingsBtn: {
    padding: '0.8rem',
    backgroundColor: '#00b4d8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
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
  
  .edit-btn:hover {
    background: #0077b6 !important;
  }
  
  .save-settings-btn:hover {
    background: #0077b6 !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;