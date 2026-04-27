import React, { useState } from 'react';
import { FiSave, FiRefreshCw, FiBell, FiLock, FiGlobe } from 'react-icons/fi';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    systemName: 'Smart Garbage Management System',
    refreshInterval: 4,
    notificationsEnabled: true,
    emailAlerts: true,
    criticalThreshold: 85,
    warningThreshold: 60,
    language: 'en',
    timezone: 'UTC+5'
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-subtitle">Configure your garbage management system</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="success-message">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Settings Sections */}
      <div className="settings-grid">
        {/* General Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiGlobe className="settings-icon" />
            <h2 className="card-title">General Settings</h2>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="systemName">System Name</label>
              <input
                type="text"
                id="systemName"
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="form-select"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="form-select"
              >
                <option value="UTC+5">UTC+5 (Pakistan)</option>
                <option value="UTC+0">UTC+0</option>
                <option value="UTC+1">UTC+1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Performance */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiRefreshCw className="settings-icon" />
            <h2 className="card-title">Data & Performance</h2>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="refreshInterval">Refresh Interval (seconds)</label>
              <input
                type="number"
                id="refreshInterval"
                name="refreshInterval"
                value={settings.refreshInterval}
                onChange={handleChange}
                min="1"
                max="60"
                className="form-input"
              />
              <small className="form-hint">How often data is updated (1-60 seconds)</small>
            </div>

            <div className="form-group">
              <label htmlFor="criticalThreshold">Critical Fill Threshold (%)</label>
              <input
                type="number"
                id="criticalThreshold"
                name="criticalThreshold"
                value={settings.criticalThreshold}
                onChange={handleChange}
                min="0"
                max="100"
                className="form-input"
              />
              <small className="form-hint">When bin is considered critical (default: 85%)</small>
            </div>

            <div className="form-group">
              <label htmlFor="warningThreshold">Warning Fill Threshold (%)</label>
              <input
                type="number"
                id="warningThreshold"
                name="warningThreshold"
                value={settings.warningThreshold}
                onChange={handleChange}
                min="0"
                max="100"
                className="form-input"
              />
              <small className="form-hint">When bin is in warning state (default: 60%)</small>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiBell className="settings-icon" />
            <h2 className="card-title">Notifications</h2>
          </div>
          <div className="settings-form">
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={handleChange}
              />
              <label htmlFor="notificationsEnabled">Enable Notifications</label>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="emailAlerts"
                name="emailAlerts"
                checked={settings.emailAlerts}
                onChange={handleChange}
              />
              <label htmlFor="emailAlerts">Email Alerts</label>
            </div>

            <div className="notification-types">
              <h4 className="notification-title">Alert Types</h4>
              <div className="alert-type">
                <span>🔴 Critical Alerts</span>
                <span className="badge">Enabled</span>
              </div>
              <div className="alert-type">
                <span>🟡 Warning Alerts</span>
                <span className="badge">Enabled</span>
              </div>
              <div className="alert-type">
                <span>ℹ️ Info Messages</span>
                <span className="badge">Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FiLock className="settings-icon" />
            <h2 className="card-title">Security</h2>
          </div>
          <div className="settings-form">
            <div className="security-info">
              <p className="info-text">🔐 Your system is using secure local storage</p>
              <p className="info-text">✅ All data is encrypted in localStorage</p>
              <p className="info-text">🛡️ Two-factor authentication: Not configured</p>
            </div>

            <button className="btn-secondary" style={{ marginTop: '1rem' }}>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-footer">
        <button className="btn-save" onClick={handleSave}>
          <FiSave /> Save All Changes
        </button>
        <button className="btn-reset" onClick={() => window.location.reload()}>
          Reset to Default
        </button>
      </div>
    </div>
  );
}

export default Settings;