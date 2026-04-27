const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src/components/AdminDashboard');

// Create directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log('✅ Created AdminDashboard folder');
}

// AdminDashboard.jsx
const adminDashboardJsx = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiMapPin, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import Overview from './Overview';
import BinsManagement from './BinsManagement';
import WorkersManagement from './WorkersManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'bins', label: 'Bins', icon: FiMapPin },
    { id: 'workers', label: 'Workers', icon: FiUsers },
    { id: 'analytics', label: 'Analytics', icon: FiMapPin },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'bins':
        return <BinsManagement />;
      case 'workers':
        return <WorkersManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="admin-container">
      <div className={\`admin-sidebar \${sidebarOpen ? 'open' : 'closed'}\`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">♻️</span>
            {sidebarOpen && <span className="logo-text">Admin Panel</span>}
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">A</div>
          {sidebarOpen && (
            <div className="profile-info">
              <h3>Admin User</h3>
              <p>System Administrator</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={\`nav-item \${activeTab === tab.id ? 'active' : ''}\`}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
              >
                <Icon className="nav-icon" />
                {sidebarOpen && <span className="nav-label">{tab.label}</span>}
              </button>
            );
          })}

          <button className="nav-item logout" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;`;

fs.writeFileSync(path.join(baseDir, 'AdminDashboard.jsx'), adminDashboardJsx);
console.log('✅ Created AdminDashboard.jsx');

// Create other stub files
const files = {
  'Overview.jsx': `import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Overview.css';

function Overview() {
  const { binsData, loading } = useRealTimeData();
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  
  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <button className="export-btn"><FiDownload /> Export</button>
      </div>
      <p>Total Bins: {binsData.length}</p>
    </div>
  );
}

export default Overview;`,

  'BinsManagement.jsx': `import React, { useState } from 'react';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './BinsManagement.css';

function BinsManagement() {
  const { binsData, loading } = useRealTimeData();
  
  if (loading) return <div>Loading bins...</div>;
  
  return (
    <div className="bins-container">
      <h1 className="page-title">Bin Management</h1>
      <div className="bins-grid">
        {binsData.map((bin, idx) => (
          <div key={idx} className="bin-card">
            <h3>{bin.id}</h3>
            <p>Fill: {bin.fillLevel.toFixed(0)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BinsManagement;`,

  'WorkersManagement.jsx': `import React, { useState, useEffect } from 'react';
import './WorkersManagement.css';

function WorkersManagement() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('workers') || '[]');
    if (stored.length === 0) {
      const defaults = [
        { id: 1, name: 'Ahmad Hassan', email: 'ahmad@example.com', area: 'F-7', status: 'active' },
        { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', area: 'F-8', status: 'active' }
      ];
      localStorage.setItem('workers', JSON.stringify(defaults));
      setWorkers(defaults);
    } else {
      setWorkers(stored);
    }
  }, []);

  return (
    <div className="workers-container">
      <h1 className="page-title">Workers Management</h1>
      <div className="workers-grid">
        {workers.map(w => (
          <div key={w.id} className="worker-card">
            <h3>{w.name}</h3>
            <p>{w.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkersManagement;`,

  'Analytics.jsx': `import React from 'react';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Analytics.css';

function Analytics() {
  const { binsData, loading } = useRealTimeData();
  
  if (loading) return <div>Loading analytics...</div>;
  
  return (
    <div className="analytics-container">
      <h1 className="page-title">Analytics</h1>
      <p>Total bins analyzed: {binsData.length}</p>
    </div>
  );
}

export default Analytics;`,

  'Settings.jsx': `import React from 'react';
import './Settings.css';

function Settings() {
  return (
    <div className="settings-container">
      <h1 className="page-title">System Settings</h1>
      <p>Configure your system here.</p>
    </div>
  );
}

export default Settings;`,

  'AdminDashboard.css': `/* Placeholder CSS */
.admin-container { display: flex; min-height: 100vh; background: #f5f7fa; }
.admin-sidebar { width: 280px; background: white; padding: 1.5rem; }
.admin-main { flex: 1; padding: 2rem; }
.overview-container, .bins-container, .workers-container, .analytics-container, .settings-container { animation: fadeInUp 0.5s ease; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.page-title { font-size: 2rem; color: #023047; margin: 0; }
.bins-grid, .workers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.bin-card, .worker-card { background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }`,

  'Overview.css': `.overview-container { animation: fadeInUp 0.5s ease; }
.overview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-title { font-size: 2rem; color: #023047; }
.export-btn { padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%); color: white; border: none; border-radius: 10px; cursor: pointer; }`,

  'BinsManagement.css': `.bins-container { animation: fadeInUp 0.5s ease; }
.bins-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.bin-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }`,

  'WorkersManagement.css': `.workers-container { animation: fadeInUp 0.5s ease; }
.workers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.worker-card { background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }`,

  'Analytics.css': `.analytics-container { animation: fadeInUp 0.5s ease; }`,

  'Settings.css': `.settings-container { animation: fadeInUp 0.5s ease; }`
};

Object.entries(files).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(baseDir, filename), content);
  console.log(`✅ Created ${filename}`);
});

console.log('\n✅ All AdminDashboard files created successfully!');