import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiEye, FiMapPin, FiX, FiActivity } from 'react-icons/fi';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './WorkersManagement.css';

function WorkersManagement() {
  const { binsData } = useRealTimeData();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBins, setSelectedBins] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: '', email: '', password: '', area: '' });
  const [notification, setNotification] = useState(null);

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const response = await fetch('/data/users.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(l => l.trim());

        const csvUsers = lines.slice(1).map((line, idx) => {
          const cols = parseCSVLine(line);
          const assignedBinsRaw = cols[6] ? cols[6].replace(/"/g, '').trim() : '';
          const assignedBins = assignedBinsRaw
            ? assignedBinsRaw.split(',').map(b => b.trim()).filter(b => b)
            : [];

          return {
            id: parseInt(cols[0]) || idx + 1,
            name: cols[1] ? cols[1].trim() : '',
            email: cols[2] ? cols[2].trim() : '',
            password: cols[3] ? cols[3].trim() : '',
            role: cols[4] ? cols[4].trim() : 'user',
            area: cols[5] ? cols[5].trim() : '',
            assigned_bins: assignedBins,
            isActive: true,
            source: 'csv'
          };
        }).filter(u => u.name && u.email);

        const localUsers = JSON.parse(localStorage.getItem('localWorkers') || '[]');
        const csvEmails = new Set(csvUsers.map(u => u.email));
        const uniqueLocalUsers = localUsers.filter(u => !csvEmails.has(u.email));
        const allUsers = [...csvUsers, ...uniqueLocalUsers];

        localStorage.setItem('allUsers', JSON.stringify(allUsers));

        const savedAssignments = JSON.parse(localStorage.getItem('workerAssignments') || '{}');
        const workers = allUsers
          .filter(u => u.role === 'user')
          .map(worker => ({
            ...worker,
            assigned_bins: savedAssignments[worker.id] || worker.assigned_bins || []
          }));

        setWorkers(workers);
      } catch (error) {
        console.error('Error loading workers:', error);
        const localUsers = JSON.parse(localStorage.getItem('localWorkers') || '[]');
        const savedAssignments = JSON.parse(localStorage.getItem('workerAssignments') || '{}');
        const workers = localUsers
          .filter(u => u.role === 'user')
          .map(w => ({ ...w, assigned_bins: savedAssignments[w.id] || w.assigned_bins || [] }));
        setWorkers(workers);
      }
      setLoading(false);
    };
    loadWorkers();
  }, []);

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.email && newWorker.password && newWorker.area) {
      const worker = {
        id: Date.now(),
        name: newWorker.name,
        email: newWorker.email,
        password: newWorker.password,
        area: newWorker.area,
        role: 'user',
        assigned_bins: [],
        isActive: true,
        source: 'local'
      };

      const updatedWorkers = [...workers, worker];
      setWorkers(updatedWorkers);

      const localUsers = JSON.parse(localStorage.getItem('localWorkers') || '[]');
      localUsers.push(worker);
      localStorage.setItem('localWorkers', JSON.stringify(localUsers));

      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      allUsers.push(worker);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));

      setNewWorker({ name: '', email: '', password: '', area: '' });
      setShowAddModal(false);
      showNotification('success', `✅ Worker ${worker.name} added successfully!`);
    } else {
      showNotification('error', '⚠️ Please fill in all fields including password!');
    }
  };

  const handleDeleteWorker = (id) => {
    const updatedWorkers = workers.filter(w => w.id !== id);
    setWorkers(updatedWorkers);

    const localUsers = JSON.parse(localStorage.getItem('localWorkers') || '[]');
    localStorage.setItem('localWorkers', JSON.stringify(localUsers.filter(u => u.id !== id)));

    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    localStorage.setItem('allUsers', JSON.stringify(allUsers.filter(u => u.id !== id)));

    showNotification('success', `🗑️ Worker removed successfully.`);
  };

  const handleAssignBins = (worker) => {
    setShowAssignModal(worker);
    setSelectedBins(worker.assigned_bins || []);
  };

  const handleConfirmAssign = () => {
    const updatedWorkers = workers.map(w =>
      w.id === showAssignModal.id ? { ...w, assigned_bins: selectedBins } : w
    );
    setWorkers(updatedWorkers);

    const savedAssignments = JSON.parse(localStorage.getItem('workerAssignments') || '{}');
    savedAssignments[showAssignModal.id] = selectedBins;
    localStorage.setItem('workerAssignments', JSON.stringify(savedAssignments));

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email === showAssignModal.email) {
      currentUser.assigned_bins = selectedBins;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    const notificationMessage = `✅ You have been assigned ${selectedBins.length} bin(s).`;
    const existingNotifs = JSON.parse(localStorage.getItem(`notifications_${showAssignModal.email}`) || '[]');
    existingNotifs.unshift({
      id: Date.now(),
      message: notificationMessage,
      time: new Date().toLocaleString(),
      read: false,
      workerId: showAssignModal.id,
      workerName: showAssignModal.name,
      type: 'assignment'
    });
    localStorage.setItem(`notifications_${showAssignModal.email}`, JSON.stringify(existingNotifs));

    window.dispatchEvent(new CustomEvent('binAssigned', {
      detail: {
        message: `✅ Bins assigned to ${showAssignModal.name}`,
        workerId: showAssignModal.id,
        workerEmail: showAssignModal.email,
        workerName: showAssignModal.name,
        assignedBins: selectedBins,
        binCount: selectedBins.length,
        timestamp: new Date().toLocaleString()
      }
    }));

    showNotification('success', `✅ ${selectedBins.length} bin(s) assigned to ${showAssignModal.name}`);
    setShowAssignModal(false);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleBinSelection = (binId) => {
    setSelectedBins(prev =>
      prev.includes(binId) ? prev.filter(id => id !== binId) : [...prev, binId]
    );
  };

  if (loading) {
    return <div className="loading-spinner">Loading Workers...</div>;
  }

  return (
    <div className="workers-container">

      {/* ✅ NEW HEADER */}
      <div className="workers-page-header">
        <div className="header-content">
          <div className="header-info">
            <span className="project-icon">🗑️</span>
            <span className="project-name">Smart Garbage Monitoring System</span>
            <h1 className="header-title">Workers Management</h1>
            <p className="header-subtitle">Manage your garbage collection team and assign bins</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{workers.length}</span>
              <span className="stat-label">Total Workers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{workers.filter(w => (w.assigned_bins || []).length > 0).length}</span>
              <span className="stat-label">Active Workers</span>
            </div>
          </div>
        </div>
        <button className="add-worker-btn" onClick={() => setShowAddModal(true)}>
          + Add Worker
        </button>
      </div>

      {notification && (
        <div className={`notification-popup notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close" onClick={() => setNotification(null)}>✕</button>
          </div>
        </div>
      )}

      {workers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👷</div>
          <h3>No Workers Found</h3>
          <p>Add workers via the button above or add users with role "user" in users.csv</p>
        </div>
      ) : (
        <div className="workers-grid">
          {workers.map((worker, idx) => {
            const assignedCount = (worker.assigned_bins || []).length;
            const activityStatus = assignedCount > 0 ? 'Active' : 'Idle';
            const statusColor = assignedCount > 0 ? '#4caf50' : '#ff9800';

            return (
              <div key={worker.id || idx} className="worker-card">
                <div className="worker-header-card">
                  <div className="worker-avatar">{worker.name.charAt(0).toUpperCase()}</div>
                  <div className="worker-info">
                    <h3 className="worker-name">{worker.name}</h3>
                    <p className="worker-email">{worker.email}</p>
                  </div>
                  <span className={`source-badge ${worker.source === 'csv' ? 'badge-csv' : 'badge-local'}`}>
                    {worker.source === 'csv' ? 'CSV' : 'Added'}
                  </span>
                </div>

                <div className="activity-status" style={{ borderLeftColor: statusColor }}>
                  <FiActivity size={16} style={{ color: statusColor }} />
                  <span style={{ color: statusColor, fontWeight: 600 }}>{activityStatus}</span>
                </div>

                <div className="worker-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Area</span>
                    <span className="detail-value">{worker.area || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">👤 Role</span>
                    <span className="detail-value">{worker.role}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🗑️ Bins</span>
                    <span className="detail-value">{assignedCount}</span>
                  </div>
                </div>

                {assignedCount > 0 && (
                  <div className="assigned-bins">
                    <p className="bins-label">Assigned Bins:</p>
                    <div className="bins-tags">
                      {(worker.assigned_bins || []).map((binId, i) => (
                        <span key={i} className="bin-tag">{binId}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="worker-actions">
                  <button className="action-btn view-btn" title="View"><FiEye /></button>
                  <button className="action-btn assign-btn" onClick={() => handleAssignBins(worker)} title="Assign Bins"><FiMapPin /></button>
                  <button className="action-btn edit-btn" title="Edit"><FiEdit /></button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteWorker(worker.id)} title="Delete"><FiTrash2 /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Worker</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                placeholder="Worker Name" 
                value={newWorker.name}
                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} 
                className="form-input" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={newWorker.email}
                onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })} 
                className="form-input" 
              />
              <input 
                type="password" 
                placeholder="Password (for login)" 
                value={newWorker.password}
                onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })} 
                className="form-input" 
              />
              <input 
                type="text" 
                placeholder="Area (e.g., F-7)" 
                value={newWorker.area}
                onChange={(e) => setNewWorker({ ...newWorker, area: e.target.value })} 
                className="form-input" 
              />
              <button className="submit-btn" onClick={handleAddWorker}>Add Worker</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Bins Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content modal-assign" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Bins to {showAssignModal.name}</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="bins-selection">
                {binsData.map((bin, idx) => (
                  <label key={idx} className="bin-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedBins.includes(bin.id)}
                      onChange={() => toggleBinSelection(bin.id)} 
                    />
                    <span>{bin.id} (Area: {bin.area})</span>
                  </label>
                ))}
              </div>
              <button className="submit-btn" onClick={handleConfirmAssign}>
                Confirm Assignment ({selectedBins.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkersManagement;