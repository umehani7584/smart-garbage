import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiMapPin, FiSettings, FiLogOut,
  FiBarChart2, FiTrash2, FiDownload, FiRefreshCw, 
  FiUserPlus, FiEdit2, FiEye, FiActivity,
  FiAlertCircle, FiCheckCircle, FiTrendingUp, FiX,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { getBins, calculateFillPercentage, getAllUsersCombined, addUserToLocalStorage } from '../utils/csvParser';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(null);
  const [showBinModal, setShowBinModal] = useState(null);
  const [editUserData, setEditUserData] = useState({ name: '', email: '', area: '' });
  
  const [users, setUsers] = useState([]);
  const [processedBins, setProcessedBins] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBins: 0,
    criticalBins: 0,
    warningBins: 0,
    normalBins: 0,
    avgFillLevel: 0,
    efficiency: 0
  });
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    area: 'F-7'
  });
  
  const navigate = useNavigate();

  const getFillColor = (level) => {
    if (level > 90) return '#f44336';
    if (level > 70) return '#ff9800';
    return '#4caf50';
  };

  const getStatusText = (status) => {
    if (status === 'critical') return 'Critical';
    if (status === 'warning') return 'Warning';
    return 'Normal';
  };

  const getAreaFromCoordinates = (lat, lon) => {
    if (!lat || !lon) return 'Unknown';
    const latNum = parseFloat(lat);
    
    if (latNum > -34.18) return 'F-7';
    if (latNum > -34.185) return 'G-10';
    if (latNum > -34.19) return 'F-8';
    return 'G-11';
  };

  const processBinsData = (binsData) => {
    const binMap = new Map();
    
    binsData.forEach(row => {
      const binId = row['Device Tag'] || row['bin_id'];
      if (!binId) return;
      
      if (!binMap.has(binId)) {
        binMap.set(binId, []);
      }
      binMap.get(binId).push(row);
    });
    
    const processed = [];
    for (let [binId, readings] of binMap) {
      const lastReading = readings[readings.length - 1];
      const distance = parseFloat(lastReading['Calibrated Value'] || lastReading.fill_level || 0);
      const fillPercent = calculateFillPercentage(distance);
      
      let status = 'normal';
      if (fillPercent > 90) status = 'critical';
      else if (fillPercent > 70) status = 'warning';
      
      const lat = lastReading['Location Lat'];
      const lon = lastReading['Location Long'];
      const area = getAreaFromCoordinates(lat, lon);
      
      processed.push({
        id: binId,
        fillLevel: fillPercent,
        status: status,
        area: area,
        lastUpdated: lastReading.Timestamp_UTC || lastReading.last_updated || new Date().toLocaleString(),
        readingsCount: readings.length,
        latitude: lat || 'N/A',
        longitude: lon || 'N/A'
      });
    }
    
    return processed;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsersCombined();
        const binsData = await getBins();
        
        setUsers(usersData.filter(u => u.role === 'user'));
        
        const processed = processBinsData(binsData);
        setProcessedBins(processed);
        
        const critical = processed.filter(b => b.status === 'critical').length;
        const warning = processed.filter(b => b.status === 'warning').length;
        const normal = processed.filter(b => b.status === 'normal').length;
        const avgFill = processed.reduce((sum, b) => sum + b.fillLevel, 0) / (processed.length || 1);
        
        const efficiency = processed.length > 0 ? Math.round((normal / processed.length) * 100) : 0;
        
        setSystemStats({
          totalUsers: usersData.filter(u => u.role === 'user').length,
          activeUsers: usersData.filter(u => u.role === 'user' && u.status === 'active').length,
          totalBins: processed.length,
          criticalBins: critical,
          warningBins: warning,
          normalBins: normal,
          avgFillLevel: Math.round(avgFill),
          efficiency: efficiency
        });
        
      } catch (error) {
        console.error('Error loading CSV data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

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

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const user = addUserToLocalStorage(newUser);
      setUsers([...users, user]);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', area: 'F-7' });
      alert('User added successfully!');
    } else {
      alert('Please fill all fields');
    }
  };

  const handleEditUser = (user) => {
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      area: user.area
    });
    setShowEditUser(user.id);
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map(u => 
      u.id === editUserData.id 
        ? { ...u, name: editUserData.name, email: editUserData.email, area: editUserData.area }
        : u
    );
    setUsers(updatedUsers);
    
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const updatedLocal = allUsers.map(u => 
      u.id === editUserData.id 
        ? { ...u, name: editUserData.name, email: editUserData.email, area: editUserData.area }
        : u
    );
    localStorage.setItem('allUsers', JSON.stringify(updatedLocal));
    
    setShowEditUser(null);
    alert('User updated successfully!');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const updatedLocal = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('allUsers', JSON.stringify(updatedLocal));
      
      alert('User deleted successfully!');
    }
  };

  const handleViewBin = (bin) => {
    setShowBinModal(bin);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={{...styles.sidebar, width: sidebarOpen ? '260px' : '80px'}}>
        {/* Logo + Toggle Button */}
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>♻️</span>
          {sidebarOpen && <span style={styles.logoText}>Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.sidebarToggleBtn}>
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
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
            style={{...styles.navItem, ...(selectedTab === 'overview' ? styles.navItemActive : {})}}
          >
            <FiHome style={styles.navIcon} /> {sidebarOpen && <span style={styles.navText}>Overview</span>}
          </button>
          <button 
            onClick={() => setSelectedTab('workers')} 
            style={{...styles.navItem, ...(selectedTab === 'workers' ? styles.navItemActive : {})}}
          >
            <FiUsers style={styles.navIcon} /> {sidebarOpen && <span style={styles.navText}>Workers</span>}
          </button>
          <button 
            onClick={() => setSelectedTab('bins')} 
            style={{...styles.navItem, ...(selectedTab === 'bins' ? styles.navItemActive : {})}}
          >
            <FiMapPin style={styles.navIcon} /> {sidebarOpen && <span style={styles.navText}>All Bins</span>}
          </button>
          <button 
            onClick={() => setSelectedTab('analytics')} 
            style={{...styles.navItem, ...(selectedTab === 'analytics' ? styles.navItemActive : {})}}
          >
            <FiBarChart2 style={styles.navIcon} /> {sidebarOpen && <span style={styles.navText}>Analytics</span>}
          </button>
          <button 
            onClick={() => setSelectedTab('settings')} 
            style={{...styles.navItem, ...(selectedTab === 'settings' ? styles.navItemActive : {})}}
          >
            <FiSettings style={styles.navIcon} /> {sidebarOpen && <span style={styles.navText}>Settings</span>}
          </button>
          
          {/* Logout Button - Settings ke neeche */}
          <button onClick={handleLogout} style={styles.navItem}>
            <FiLogOut style={styles.navIcon} /> {sidebarOpen && <span style={styles.navText}>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{...styles.mainContent, marginLeft: sidebarOpen ? '260px' : '80px'}}>
        
        {/* TOP NAVBAR */}
        <div style={styles.topNavbar}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard Overview</h1>
            <p style={styles.pageSubtitle}>Welcome back, Admin</p>
          </div>
          <div style={styles.topNavActions}>
            <button style={styles.refreshBtn} onClick={() => window.location.reload()}>
              <FiRefreshCw style={styles.refreshIcon} />
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {selectedTab === 'overview' && (
          <div style={styles.dashboardContent}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={{...styles.statIconWrapper, backgroundColor: '#e3f2fd'}}>
                  <FiTrash2 style={{...styles.statIcon, color: '#2196f3'}} />
                </div>
                <div style={styles.statInfo}>
                  <h3 style={styles.statValue}>{systemStats.totalBins}</h3>
                  <p style={styles.statLabel}>Total Bins</p>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{...styles.statIconWrapper, backgroundColor: '#e8f5e9'}}>
                  <FiActivity style={{...styles.statIcon, color: '#4caf50'}} />
                </div>
                <div style={styles.statInfo}>
                  <h3 style={styles.statValue}>{systemStats.avgFillLevel}%</h3>
                  <p style={styles.statLabel}>Average Fill Level</p>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{...styles.statIconWrapper, backgroundColor: '#fff3e0'}}>
                  <FiAlertCircle style={{...styles.statIcon, color: '#ff9800'}} />
                </div>
                <div style={styles.statInfo}>
                  <h3 style={styles.statValue}>{systemStats.criticalBins}</h3>
                  <p style={styles.statLabel}>Critical Bins</p>
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={{...styles.statIconWrapper, backgroundColor: '#e8f5e9'}}>
                  <FiCheckCircle style={{...styles.statIcon, color: '#4caf50'}} />
                </div>
                <div style={styles.statInfo}>
                  <h3 style={styles.statValue}>{systemStats.efficiency}%</h3>
                  <p style={styles.statLabel}>Efficiency</p>
                </div>
              </div>
            </div>

            <div style={styles.twoColumn}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Bin Fill Level Distribution</h3>
                  <FiBarChart2 style={{color: '#00b4d8'}} />
                </div>
                <div style={styles.chartContainer}>
                  {processedBins.slice(0, 8).map((bin, idx) => (
                    <div key={idx} style={styles.chartBarItem}>
                      <div style={styles.chartBarLabel}>{bin.id}</div>
                      <div style={styles.chartBarWrapper}>
                        <div style={{
                          ...styles.chartBar,
                          width: `${bin.fillLevel}%`,
                          backgroundColor: getFillColor(bin.fillLevel)
                        }}>
                          <span style={styles.chartBarValue}>{bin.fillLevel}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Bin Status Distribution</h3>
                  <FiTrendingUp style={{color: '#00b4d8'}} />
                </div>
                <div style={styles.statusList}>
                  <div style={styles.statusItem}>
                    <div style={styles.statusInfo}>
                      <span style={styles.statusDotGreen}></span>
                      <span>Normal</span>
                    </div>
                    <div style={styles.statusBar}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(systemStats.normalBins / systemStats.totalBins) * 100}%`,
                        backgroundColor: '#4caf50'
                      }} />
                    </div>
                    <span style={styles.statusCount}>{systemStats.normalBins}</span>
                  </div>
                  <div style={styles.statusItem}>
                    <div style={styles.statusInfo}>
                      <span style={styles.statusDotYellow}></span>
                      <span>Warning</span>
                    </div>
                    <div style={styles.statusBar}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(systemStats.warningBins / systemStats.totalBins) * 100}%`,
                        backgroundColor: '#ff9800'
                      }} />
                    </div>
                    <span style={styles.statusCount}>{systemStats.warningBins}</span>
                  </div>
                  <div style={styles.statusItem}>
                    <div style={styles.statusInfo}>
                      <span style={styles.statusDotRed}></span>
                      <span>Critical</span>
                    </div>
                    <div style={styles.statusBar}>
                      <div style={{
                        ...styles.statusBarFill,
                        width: `${(systemStats.criticalBins / systemStats.totalBins) * 100}%`,
                        backgroundColor: '#f44336'
                      }} />
                    </div>
                    <span style={styles.statusCount}>{systemStats.criticalBins}</span>
                  </div>
                </div>
              </div>
            </div>

            <button style={styles.exportDataBtn}>
              <FiDownload /> Export Full Report
            </button>
          </div>
        )}

        {/* WORKERS TAB */}
        {selectedTab === 'workers' && (
          <div>
            <div style={styles.workersHeader}>
              <h3 style={styles.sectionTitle}>👥 Workers Team</h3>
              <button onClick={() => setShowAddUser(true)} style={styles.addBtn}>
                <FiUserPlus /> Add New Worker
              </button>
            </div>

            {showAddUser && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <h3 style={styles.modalTitle}>Add New Worker</h3>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    style={styles.modalInput}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    style={styles.modalInput}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    style={styles.modalInput}
                  />
                  <select
                    value={newUser.area}
                    onChange={(e) => setNewUser({...newUser, area: e.target.value})}
                    style={styles.modalSelect}
                  >
                    <option value="F-7">F-7</option>
                    <option value="F-8">F-8</option>
                    <option value="G-10">G-10</option>
                    <option value="G-11">G-11</option>
                  </select>
                  <div style={styles.modalActions}>
                    <button onClick={handleAddUser} style={styles.modalSubmit}>Add</button>
                    <button onClick={() => setShowAddUser(false)} style={styles.modalCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {showEditUser && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <h3 style={styles.modalTitle}>Edit Worker</h3>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editUserData.name}
                    onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                    style={styles.modalInput}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={editUserData.email}
                    onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                    style={styles.modalInput}
                  />
                  <select
                    value={editUserData.area}
                    onChange={(e) => setEditUserData({...editUserData, area: e.target.value})}
                    style={styles.modalSelect}
                  >
                    <option value="F-7">F-7</option>
                    <option value="F-8">F-8</option>
                    <option value="G-10">G-10</option>
                    <option value="G-11">G-11</option>
                  </select>
                  <div style={styles.modalActions}>
                    <button onClick={handleSaveEdit} style={styles.modalSubmit}>Save</button>
                    <button onClick={() => setShowEditUser(null)} style={styles.modalCancel}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.workersGrid}>
              {users.map(user => (
                <div key={user.id} style={styles.workerCard}>
                  <div style={styles.workerCardHeader}>
                    <div style={styles.workerAvatar}>{user.name.charAt(0)}</div>
                    <div style={styles.workerInfo}>
                      <h3 style={styles.workerName}>{user.name}</h3>
                      <p style={styles.workerEmail}>{user.email}</p>
                    </div>
                  </div>
                  <div style={styles.workerDetails}>
                    <div style={styles.workerDetailItem}>
                      <span style={styles.workerDetailLabel}>📍 Area</span>
                      <span style={styles.workerDetailValue}>{user.area}</span>
                    </div>
                    <div style={styles.workerDetailItem}>
                      <span style={styles.workerDetailLabel}>📊 Status</span>
                      <span style={{
                        ...styles.workerStatus,
                        backgroundColor: user.status === 'active' ? '#4caf5020' : '#9e9e9e20',
                        color: user.status === 'active' ? '#4caf50' : '#9e9e9e'
                      }}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.workerCardActions}>
                    <button onClick={() => handleEditUser(user)} style={styles.workerEditBtn}>
                      <FiEdit2 /> Edit
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} style={styles.workerDeleteBtn}>
                      <FiTrash2 /> Delete
                    </button>
                    <button style={styles.workerViewBtn}>
                      <FiEye /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BINS TAB */}
        {selectedTab === 'bins' && (
          <div>
            <div style={styles.binsHeader}>
              <h3 style={styles.sectionTitle}>🗑️ All Bins</h3>
              <div style={styles.binsStats}>
                <span style={styles.binsStatBadge}>Total: {systemStats.totalBins} bins</span>
              </div>
            </div>

            <div style={styles.binsGrid}>
              {processedBins.map((bin, idx) => (
                <div key={idx} style={styles.binCard}>
                  <div style={styles.binCardHeader}>
                    <div style={styles.binCardId}>{bin.id}</div>
                    <div style={{
                      ...styles.binCardStatus,
                      backgroundColor: bin.status === 'critical' ? '#f4433620' : bin.status === 'warning' ? '#ff980020' : '#4caf5020',
                      color: bin.status === 'critical' ? '#f44336' : bin.status === 'warning' ? '#ff9800' : '#4caf50'
                    }}>
                      {getStatusText(bin.status)}
                    </div>
                  </div>
                  <div style={styles.binCardFillSection}>
                    <div style={styles.binCardFillLabel}>
                      <span>Fill Level</span>
                      <span style={{fontWeight: 'bold'}}>{bin.fillLevel}%</span>
                    </div>
                    <div style={styles.binCardFillBar}>
                      <div style={{
                        ...styles.binCardFillProgress,
                        width: `${bin.fillLevel}%`,
                        backgroundColor: getFillColor(bin.fillLevel)
                      }} />
                    </div>
                  </div>
                  <div style={styles.binCardDetails}>
                    <div style={styles.binCardDetail}>
                      <span>📍 Area</span>
                      <span>{bin.area}</span>
                    </div>
                    <div style={styles.binCardDetail}>
                      <span>🕒 Last Updated</span>
                      <span>{bin.lastUpdated}</span>
                    </div>
                    <div style={styles.binCardDetail}>
                      <span>📊 Readings</span>
                      <span>{bin.readingsCount}</span>
                    </div>
                  </div>
                  <button onClick={() => handleViewBin(bin)} style={styles.binCardViewBtn}>
                    <FiEye /> View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {selectedTab === 'analytics' && (
          <div>
            <div style={styles.analyticsHeader}>
              <h3 style={styles.sectionTitle}>📊 System Analytics</h3>
            </div>

            <div style={styles.twoColumn}>
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Fill Level Distribution</h3>
                  <FiBarChart2 style={{color: '#00b4d8'}} />
                </div>
                <div style={styles.chartContainer}>
                  {processedBins.map((bin, idx) => (
                    <div key={idx} style={styles.chartBarItem}>
                      <div style={styles.chartBarLabel}>{bin.id}</div>
                      <div style={styles.chartBarWrapper}>
                        <div style={{
                          ...styles.chartBar,
                          width: `${bin.fillLevel}%`,
                          backgroundColor: getFillColor(bin.fillLevel)
                        }}>
                          <span style={styles.chartBarValue}>{bin.fillLevel}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Status Distribution</h3>
                  <FiActivity style={{color: '#00b4d8'}} />
                </div>
                <div style={styles.pieContainer}>
                  <div style={styles.pieChart}>
                    <div style={{
                      ...styles.pieSegment,
                      background: `conic-gradient(
                        #4caf50 0deg ${(systemStats.normalBins / systemStats.totalBins) * 360}deg,
                        #ff9800 ${(systemStats.normalBins / systemStats.totalBins) * 360}deg ${((systemStats.normalBins + systemStats.warningBins) / systemStats.totalBins) * 360}deg,
                        #f44336 ${((systemStats.normalBins + systemStats.warningBins) / systemStats.totalBins) * 360}deg 360deg
                      )`
                    }} />
                  </div>
                  <div style={styles.pieLegend}>
                    <div style={styles.legendItem}>
                      <span style={{...styles.legendDot, backgroundColor: '#4caf50'}}></span>
                      <span>Normal ({systemStats.normalBins})</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span style={{...styles.legendDot, backgroundColor: '#ff9800'}}></span>
                      <span>Warning ({systemStats.warningBins})</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span style={{...styles.legendDot, backgroundColor: '#f44336'}}></span>
                      <span>Critical ({systemStats.criticalBins})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>System Summary</h3>
                <FiTrendingUp style={{color: '#00b4d8'}} />
              </div>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <span>Total Workers</span>
                  <strong>{systemStats.totalUsers}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span>Active Workers</span>
                  <strong>{systemStats.activeUsers}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span>Total Bins</span>
                  <strong>{systemStats.totalBins}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span>Average Fill Level</span>
                  <strong>{systemStats.avgFillLevel}%</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span>Critical Bins</span>
                  <strong style={{color: '#f44336'}}>{systemStats.criticalBins}</strong>
                </div>
                <div style={styles.summaryItem}>
                  <span>Overall Efficiency</span>
                  <strong style={{color: '#4caf50'}}>{systemStats.efficiency}%</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {selectedTab === 'settings' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>⚙️ System Settings</h3>
            <div style={styles.settingsGroup}>
              <div style={styles.settingItem}>
                <label>System Name</label>
                <input type="text" defaultValue="Smart Garbage System" style={styles.settingInput} />
              </div>
              <div style={styles.settingItem}>
                <label>Auto Refresh (seconds)</label>
                <input type="number" defaultValue="30" style={styles.settingInput} />
              </div>
              <div style={styles.settingItem}>
                <label>Notifications</label>
                <select style={styles.settingSelect}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <button style={styles.saveBtn}>Save Changes</button>
            </div>
          </div>
        )}
      </div>

      {/* BIN DETAILS MODAL */}
      {showBinModal && (
        <div style={styles.modalOverlay} onClick={() => setShowBinModal(null)}>
          <div style={styles.binModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.binModalHeader}>
              <h3 style={styles.binModalTitle}>Bin Details</h3>
              <button onClick={() => setShowBinModal(null)} style={styles.binModalClose}>
                <FiX />
              </button>
            </div>
            <div style={styles.binModalContent}>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Bin ID:</span>
                <span style={styles.binModalValue}>{showBinModal.id}</span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Fill Level:</span>
                <span style={{...styles.binModalValue, color: getFillColor(showBinModal.fillLevel), fontWeight: 'bold'}}>
                  {showBinModal.fillLevel}%
                </span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Status:</span>
                <span style={{
                  ...styles.binModalValue,
                  color: showBinModal.status === 'critical' ? '#f44336' : showBinModal.status === 'warning' ? '#ff9800' : '#4caf50',
                  fontWeight: 'bold'
                }}>
                  {getStatusText(showBinModal.status)}
                </span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Area:</span>
                <span style={styles.binModalValue}>{showBinModal.area}</span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Last Updated:</span>
                <span style={styles.binModalValue}>{showBinModal.lastUpdated}</span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Total Readings:</span>
                <span style={styles.binModalValue}>{showBinModal.readingsCount}</span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Latitude:</span>
                <span style={styles.binModalValue}>{showBinModal.latitude}</span>
              </div>
              <div style={styles.binModalRow}>
                <span style={styles.binModalLabel}>Longitude:</span>
                <span style={styles.binModalValue}>{showBinModal.longitude}</span>
              </div>
            </div>
            <button onClick={() => setShowBinModal(null)} style={styles.binModalCloseBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== STYLES ====================
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #00b4d8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: { marginTop: '1rem', color: '#666' },
  sidebar: {
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 20px rgba(0,0,0,0.05)',
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
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    borderBottom: '1px solid #f0f0f0',
    position: 'relative'
  },
  logoIcon: { fontSize: '2rem' },
  logoText: { fontSize: '1.3rem', fontWeight: 'bold', color: '#023047', whiteSpace: 'nowrap' },
  sidebarToggleBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.3rem',
    borderRadius: '5px',
    transition: 'all 0.3s'
  },
  adminProfile: { padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid #f0f0f0' },
  avatarContainer: { width: '45px', height: '45px', flexShrink: 0 },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#00b4d8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold' },
  adminInfo: { overflow: 'hidden' },
  adminName: { fontSize: '0.95rem', fontWeight: 600, color: '#023047', margin: 0, whiteSpace: 'nowrap' },
  adminRole: { fontSize: '0.75rem', color: '#00b4d8', margin: '0.2rem 0 0 0', whiteSpace: 'nowrap' },
  navMenu: { flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.7rem 1rem', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s', width: '100%', color: '#666', background: 'transparent' },
  navItemActive: { backgroundColor: '#00b4d810', color: '#00b4d8' },
  navIcon: { fontSize: '1.2rem', flexShrink: 0 },
  navText: { fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap' },
  mainContent: { flex: 1, padding: '1.5rem', transition: 'margin-left 0.3s ease', backgroundColor: '#f0f2f5' },
  topNavbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.5rem', color: '#023047', margin: 0 },
  pageSubtitle: { fontSize: '0.85rem', color: '#666', margin: '0.2rem 0 0 0' },
  topNavActions: { display: 'flex', alignItems: 'center', gap: '1rem' },
  refreshBtn: { padding: '0.5rem', border: 'none', backgroundColor: 'white', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  refreshIcon: { fontSize: '1.1rem', color: '#666' },
  dashboardContent: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' },
  statCard: { backgroundColor: 'white', padding: '1.2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.3s' },
  statIconWrapper: { width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statIcon: { fontSize: '1.3rem' },
  statInfo: { flex: 1 },
  statValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#023047', margin: 0 },
  statLabel: { fontSize: '0.75rem', color: '#666', margin: 0 },
  twoColumn: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' },
  card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  cardTitle: { fontSize: '1rem', fontWeight: 600, color: '#023047', margin: 0 },
  chartContainer: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  chartBarItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  chartBarLabel: { width: '70px', fontSize: '0.7rem', fontWeight: 500, color: '#666' },
  chartBarWrapper: { flex: 1, backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', height: '24px' },
  chartBar: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '0.5rem', transition: 'width 0.5s ease' },
  chartBarValue: { fontSize: '0.65rem', color: 'white', fontWeight: 'bold' },
  statusList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  statusItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  statusInfo: { display: 'flex', alignItems: 'center', gap: '0.3rem', width: '80px', fontSize: '0.8rem' },
  statusDotGreen: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50' },
  statusDotYellow: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9800' },
  statusDotRed: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f44336' },
  statusBar: { flex: 1, height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' },
  statusBarFill: { height: '100%' },
  statusCount: { fontSize: '0.75rem', fontWeight: 500, color: '#666', width: '30px' },
  exportDataBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', backgroundColor: '#00b4d8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s' },
  workersHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 600, color: '#023047', margin: 0 },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', border: 'none', backgroundColor: '#00b4d8', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' },
  workersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
  workerCard: { backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s', border: '1px solid #f0f0f0' },
  workerCardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' },
  workerAvatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#00b4d8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' },
  workerInfo: { flex: 1 },
  workerName: { fontSize: '1.1rem', fontWeight: 600, color: '#023047', margin: 0 },
  workerEmail: { fontSize: '0.8rem', color: '#666', margin: '0.2rem 0 0 0' },
  workerDetails: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem' },
  workerDetailItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', borderBottom: '1px solid #e0e0e0', fontSize: '0.8rem' },
  workerDetailLabel: { color: '#666', fontWeight: 500 },
  workerDetailValue: { color: '#023047', fontWeight: 600 },
  workerStatus: { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 500 },
  workerCardActions: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' },
  workerEditBtn: { padding: '0.4rem 0.8rem', border: 'none', backgroundColor: '#00b4d8', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  workerDeleteBtn: { padding: '0.4rem 0.8rem', border: 'none', backgroundColor: '#f44336', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  workerViewBtn: { padding: '0.4rem 0.8rem', border: 'none', backgroundColor: '#9e9e9e', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  binsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  binsStats: { display: 'flex', gap: '0.5rem' },
  binsStatBadge: { padding: '0.3rem 0.8rem', backgroundColor: '#e0e0e0', borderRadius: '20px', fontSize: '0.75rem', color: '#666' },
  binsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  binCard: { backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s', border: '1px solid #f0f0f0' },
  binCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  binCardId: { fontSize: '1rem', fontWeight: 'bold', color: '#023047' },
  binCardStatus: { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 500 },
  binCardFillSection: { marginBottom: '1rem' },
  binCardFillLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', color: '#666' },
  binCardFillBar: { height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' },
  binCardFillProgress: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  binCardDetails: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem' },
  binCardDetail: { display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.75rem', color: '#666' },
  binCardViewBtn: { width: '100%', padding: '0.5rem', backgroundColor: '#00b4d8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', transition: 'all 0.3s' },
  analyticsHeader: { marginBottom: '1.5rem' },
  pieContainer: { display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  pieChart: { width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden' },
  pieSegment: { width: '100%', height: '100%' },
  pieLegend: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' },
  legendDot: { width: '12px', height: '12px', borderRadius: '50%' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.85rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', width: '380px', maxWidth: '90%' },
  modalTitle: { fontSize: '1.1rem', marginBottom: '1rem', color: '#023047' },
  modalInput: { width: '100%', padding: '0.6rem', marginBottom: '0.8rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem', boxSizing: 'border-box' },
  modalSelect: { width: '100%', padding: '0.6rem', marginBottom: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'white' },
  modalActions: { display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' },
  modalSubmit: { padding: '0.4rem 1rem', backgroundColor: '#00b4d8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  modalCancel: { padding: '0.4rem 1rem', backgroundColor: '#e0e0e0', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  binModal: { backgroundColor: 'white', borderRadius: '20px', width: '400px', maxWidth: '90%', overflow: 'hidden' },
  binModalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #f0f0f0' },
  binModalTitle: { fontSize: '1.2rem', fontWeight: 600, color: '#023047', margin: 0 },
  binModalClose: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' },
  binModalContent: { padding: '1.5rem' },
  binModalRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' },
  binModalLabel: { fontWeight: 600, color: '#666' },
  binModalValue: { color: '#023047' },
  binModalCloseBtn: { width: 'calc(100% - 3rem)', margin: '0 1.5rem 1.5rem 1.5rem', padding: '0.7rem', backgroundColor: '#00b4d8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  settingsGroup: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  settingItem: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  settingInput: { padding: '0.6rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem' },
  settingSelect: { padding: '0.6rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: 'white' },
  saveBtn: { padding: '0.6rem', backgroundColor: '#00b4d8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .nav-item:hover { background-color: #f5f5f5 !important; }
  .logout-btn:hover { background-color: #f4433620 !important; }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .add-btn:hover, .export-data-btn:hover, .save-btn:hover { background-color: #0077b6 !important; }
  .worker-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
  .bin-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
  .bin-card-view-btn:hover { background-color: #0077b6 !important; }
  .bin-modal-close:hover { color: #f44336 !important; }
  .bin-modal-close-btn:hover { background-color: #0077b6 !important; }
  .sidebar-toggle-btn:hover { background-color: #f0f0f0 !important; }
  @media (max-width: 768px) { .two-column { grid-template-columns: 1fr !important; } }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;