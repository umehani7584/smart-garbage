import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiMapPin, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import Overview from './Overview';
import BinsManagement from './BinsManagement';
import WorkersManagement from './WorkersManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState('admin');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'admin');
  }, []);

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
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
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
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
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

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;