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
  const [newWorker, setNewWorker] = useState({ name: '', email: '', area: '' });
  const [notification, setNotification] = useState(null); // ADD NOTIFICATION STATE

  useEffect(() => {
    const loadWorkers = async () => {
      // First, check if allUsers exists in localStorage
      let allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // If empty, load from CSV (fetch users.csv)
      if (allUsers.length === 0) {
        try {
          const response = await fetch('/data/users.csv');
          const csvText = await response.text();
          const lines = csvText.split('\n');
          
          // Parse CSV
          allUsers = lines.slice(1).filter(line => line.trim()).map((line, idx) => {
            const [id, name, email, password, role, area, assigned_bins] = line.split(',');
            return {
              id: parseInt(id),
              name: name.trim(),
              email: email.trim(),
              password: password.trim(),
              role: role.trim(),
              area: area.trim(),
              assigned_bins: assigned_bins ? assigned_bins.split(';').map(b => b.trim()) : [],
              isActive: true
            };
          });
          
          localStorage.setItem('allUsers', JSON.stringify(allUsers));
        } catch (error) {
          console.error('Error loading users.csv:', error);
        }
      }
      
      // Filter only workers (role === 'user')
      const csvWorkers = allUsers.filter(u => u.role === 'user');
      const savedAssignments = JSON.parse(localStorage.getItem('workerAssignments') || '{}');
      
      const mergedWorkers = csvWorkers.map(worker => ({
        ...worker,
        assigned_bins: savedAssignments[worker.id] || worker.assigned_bins || [],
        isActive: true
      }));
      
      setWorkers(mergedWorkers);
      setLoading(false);
    };
    
    loadWorkers();
  }, []);

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.email && newWorker.area) {
      const worker = {
        id: workers.length + 1,
        name: newWorker.name,
        email: newWorker.email,
        area: newWorker.area,
        role: 'user',
        assigned_bins: [],
        isActive: true
      };
      
      const updatedWorkers = [...workers, worker];
      setWorkers(updatedWorkers);
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      allUsers.push(worker);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      
      setNewWorker({ name: '', email: '', area: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteWorker = (id) => {
    const updatedWorkers = workers.filter(w => w.id !== id);
    setWorkers(updatedWorkers);
    
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const filteredUsers = allUsers.filter(u => u.id !== id);
    localStorage.setItem('allUsers', JSON.stringify(filteredUsers));
  };

  const handleAssignBins = (worker) => {
    setShowAssignModal(worker);
    setSelectedBins(worker.assigned_bins || []);
  };

  const handleConfirmAssign = () => {
    const updatedWorkers = workers.map(w => 
      w.id === showAssignModal.id 
        ? { ...w, assigned_bins: selectedBins }
        : w
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
    
    // Create notification message
    const notificationMessage = `✅ Bins assigned successfully! You have been assigned ${selectedBins.length} bin(s).`;
    const existingNotifs = JSON.parse(localStorage.getItem(`notifications_${showAssignModal.email}`) || '[]');
    
    const newNotif = {
      id: Date.now(),
      message: notificationMessage,
      time: new Date().toLocaleString(),
      read: false,
      workerId: showAssignModal.id,
      workerName: showAssignModal.name,
      type: 'assignment' // NEW: Added type for distinction
    };
    
    existingNotifs.unshift(newNotif);
    localStorage.setItem(`notifications_${showAssignModal.email}`, JSON.stringify(existingNotifs));
    
    // Dispatch event with full details
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

    // Show success notification in admin panel
    setNotification({
      type: 'success',
      message: `✅ ${selectedBins.length} bin(s) assigned to ${showAssignModal.name}`,
      workerId: showAssignModal.id
    });

    // Auto-hide notification after 4 seconds
    setTimeout(() => setNotification(null), 4000);
    
    setShowAssignModal(false);
  };

  const toggleBinSelection = (binId) => {
    setSelectedBins(prev => 
      prev.includes(binId) 
        ? prev.filter(id => id !== binId)
        : [...prev, binId]
    );
  };

  if (loading) {
    return <div className="loading-spinner">Loading Workers...</div>;
  }

  return (
    <div className="workers-container">
      {/* SUCCESS NOTIFICATION */}
      {notification && (
        <div className={`notification-popup notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="workers-header">
        <div>
          <h1 className="page-title">Workers Management</h1>
          <p className="page-subtitle">Manage your garbage collection team ({workers.length} workers)</p>
        </div>
        <button className="add-worker-btn" onClick={() => setShowAddModal(true)}>
          + Add Worker
        </button>
      </div>

      {/* Workers Grid */}
      <div className="workers-grid">
        {workers.map((worker, idx) => {
          const assignedCount = (worker.assigned_bins || []).length;
          const activityStatus = assignedCount > 0 ? 'Active' : 'Idle';
          const statusColor = assignedCount > 0 ? '#4caf50' : '#ff9800';
          
          return (
            <div key={idx} className="worker-card">
              <div className="worker-header-card">
                <div className="worker-avatar">{worker.name.charAt(0)}</div>
                <div className="worker-info">
                  <h3 className="worker-name">{worker.name}</h3>
                  <p className="worker-email">{worker.email}</p>
                </div>
              </div>

              {/* Activity Status */}
              <div className="activity-status" style={{ borderLeftColor: statusColor }}>
                <FiActivity size={16} style={{ color: statusColor }} />
                <span style={{ color: statusColor, fontWeight: 600 }}>{activityStatus}</span>
              </div>

              {/* Worker Details */}
              <div className="worker-details">
                <div className="detail-item">
                  <span className="detail-label">📍 Area</span>
                  <span className="detail-value">{worker.area}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👤 Role</span>
                  <span className="detail-value">{worker.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🗑️ Bins Assigned</span>
                  <span className="detail-value">{assignedCount}</span>
                </div>
              </div>

              {/* Assigned Bins Display */}
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

              {/* Action Buttons */}
              <div className="worker-actions">
                <button 
                  className="action-btn view-btn" 
                  title="View"
                >
                  <FiEye />
                </button>
                <button 
                  className="action-btn assign-btn"
                  onClick={() => handleAssignBins(worker)}
                  title="Assign Bins"
                >
                  <FiMapPin />
                </button>
                <button 
                  className="action-btn edit-btn"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteWorker(worker.id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Worker</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                placeholder="Worker Name" 
                value={newWorker.name}
                onChange={(e) => setNewWorker({...newWorker, name: e.target.value})}
                className="form-input"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={newWorker.email}
                onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                className="form-input"
              />
              <input 
                type="text" 
                placeholder="Area (e.g., F-7)" 
                value={newWorker.area}
                onChange={(e) => setNewWorker({...newWorker, area: e.target.value})}
                className="form-input"
              />
              <button className="submit-btn" onClick={handleAddWorker}>
                Add Worker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Bins Modal - FIXED */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content modal-assign" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Bins to {showAssignModal.name}</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>
                <FiX />
              </button>
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