import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiEye, FiX, FiMapPin } from 'react-icons/fi';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { getAllUsersCombined } from '../../utils/csvParser';
import './WorkersManagement.css';

function WorkersManagement() {
  const { binsData } = useRealTimeData();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: 'F-7'
  });
  const [selectedBin, setSelectedBin] = useState('');
  const [notification, setNotification] = useState(null);

  // Load users from CSV on mount
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const allUsers = await getAllUsersCombined();
        // Filter only 'user' role (exclude admins)
        const userWorkers = allUsers.filter(u => u.role === 'user');
        setWorkers(userWorkers);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };
    loadWorkers();
  }, []);

  const handleAddWorker = () => {
    if (formData.name && formData.email) {
      const newWorker = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        area: formData.area,
        role: 'user',
        assigned_bins: []
      };
      const updated = [...workers, newWorker];
      setWorkers(updated);
      // Save to localStorage
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      allUsers.push(newWorker);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      
      setFormData({ name: '', email: '', area: 'F-7' });
      setShowAddModal(false);
      showNotification('✅ Worker added successfully!');
    }
  };

  const handleEditWorker = () => {
    if (formData.name && formData.email) {
      const updated = workers.map(w => 
        w.id === editingId 
          ? { ...w, name: formData.name, email: formData.email, area: formData.area }
          : w
      );
      setWorkers(updated);
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const updatedLocal = allUsers.map(u =>
        u.id === editingId
          ? { ...u, name: formData.name, email: formData.email, area: formData.area }
          : u
      );
      localStorage.setItem('allUsers', JSON.stringify(updatedLocal));
      
      setFormData({ name: '', email: '', area: 'F-7' });
      setEditingId(null);
      setShowEditModal(false);
      showNotification('✅ Worker updated!');
    }
  };

  const handleDeleteWorker = (id) => {
    if (window.confirm('Delete this worker?')) {
      const updated = workers.filter(w => w.id !== id);
      setWorkers(updated);
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const updatedLocal = allUsers.filter(u => u.id !== id);
      localStorage.setItem('allUsers', JSON.stringify(updatedLocal));
      
      showNotification('✅ Worker deleted!');
    }
  };

  const handleAssignBin = (worker) => {
    setShowAssignModal(worker);
    setSelectedBin('');
  };

  const handleConfirmAssign = () => {
    if (selectedBin && showAssignModal) {
      const assignedBins = showAssignModal.assigned_bins || [];
      if (!assignedBins.includes(selectedBin)) {
        const updated = workers.map(w => 
          w.id === showAssignModal.id 
            ? { ...w, assigned_bins: [...assignedBins, selectedBin] }
            : w
        );
        setWorkers(updated);
        
        // Update localStorage
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const updatedLocal = allUsers.map(u =>
          u.id === showAssignModal.id
            ? { ...u, assigned_bins: [...assignedBins, selectedBin] }
            : u
        );
        localStorage.setItem('allUsers', JSON.stringify(updatedLocal));
        
        setShowAssignModal(null);
        setSelectedBin('');
        showNotification(`✅ Bin ${selectedBin} assigned to ${showAssignModal.name}!`);
      } else {
        showNotification('⚠️ Bin already assigned!');
      }
    }
  };

  const openEditModal = (worker) => {
    setFormData({
      name: worker.name,
      email: worker.email,
      area: worker.area || 'F-7'
    });
    setEditingId(worker.id);
    setShowEditModal(true);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return <div className="loading-spinner">Loading workers...</div>;
  }

  return (
    <div className="workers-container">
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      <div className="workers-header">
        <div>
          <h1 className="page-title">Workers Management</h1>
          <p className="page-subtitle">Manage your garbage collection team ({workers.length} workers)</p>
        </div>
        <button 
          className="add-worker-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FiUserPlus /> Add Worker
        </button>
      </div>

      <div className="workers-grid">
        {workers.map(worker => {
          const assignedBins = typeof worker.assigned_bins === 'string' 
            ? worker.assigned_bins.split(',').filter(b => b.trim())
            : (worker.assigned_bins || []);
          
          return (
            <div key={worker.id} className="worker-card">
              <div className="worker-card-header">
                <div className="worker-avatar">{worker.name.charAt(0)}</div>
                <div className="worker-info">
                  <h3 className="worker-name">{worker.name}</h3>
                  <p className="worker-email">{worker.email}</p>
                </div>
              </div>

              <div className="worker-details">
                <div className="detail-item">
                  <span className="label">📍 Area</span>
                  <span className="value">{worker.area || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">👤 Role</span>
                  <span className="value" style={{ textTransform: 'capitalize' }}>
                    {worker.role}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">🗑️ Bins</span>
                  <span className="value">{assignedBins.length}</span>
                </div>
              </div>

              {assignedBins.length > 0 && (
                <div className="assigned-bins">
                  <p style={{ margin: '0.5rem 0 0.3rem 0', fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>
                    Assigned Bins:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {assignedBins.map((bin, idx) => (
                      <span key={idx} className="bin-tag">{bin.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="worker-actions">
                <button 
                  className="action-btn view"
                  onClick={() => setShowDetailModal(worker)}
                  title="View"
                >
                  <FiEye />
                </button>
                <button 
                  className="action-btn assign"
                  onClick={() => handleAssignBin(worker)}
                  title="Assign Bin"
                >
                  <FiMapPin />
                </button>
                <button 
                  className="action-btn edit"
                  onClick={() => openEditModal(worker)}
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button 
                  className="action-btn delete"
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
              <h2 className="modal-title">Add New Worker</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter worker name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="form-select"
                >
                  <option value="F-7">F-7</option>
                  <option value="F-8">F-8</option>
                  <option value="G-10">G-10</option>
                  <option value="G-11">G-11</option>
                  <option value="H-12">H-12</option>
                  <option value="I-14">I-14</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-submit" onClick={handleAddWorker}>
                  Add Worker
                </button>
                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Worker Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Worker</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="form-select"
                >
                  <option value="F-7">F-7</option>
                  <option value="F-8">F-8</option>
                  <option value="G-10">G-10</option>
                  <option value="G-11">G-11</option>
                  <option value="H-12">H-12</option>
                  <option value="I-14">I-14</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-submit" onClick={handleEditWorker}>
                  Update
                </button>
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Bin Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assign Bin to {showAssignModal.name}</h2>
              <button className="modal-close" onClick={() => setShowAssignModal(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Bin *</label>
                <select
                  value={selectedBin}
                  onChange={(e) => setSelectedBin(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Choose a bin --</option>
                  {binsData.map(bin => (
                    <option key={bin.id} value={bin.id}>
                      {bin.id} - Fill: {bin.fillLevel.toFixed(0)}% - Area: {bin.area}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button className="btn-submit" onClick={handleConfirmAssign}>
                  Assign Bin
                </button>
                <button className="btn-cancel" onClick={() => setShowAssignModal(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Worker Profile</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div className="profile-avatar-large">{showDetailModal.name.charAt(0)}</div>
              </div>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{showDetailModal.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{showDetailModal.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Area:</span>
                <span className="detail-value">{showDetailModal.area || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                  {showDetailModal.role}
                </span>
              </div>
              {(showDetailModal.assigned_bins || []).length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Assigned Bins:</span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {(typeof showDetailModal.assigned_bins === 'string'
                      ? showDetailModal.assigned_bins.split(',')
                      : showDetailModal.assigned_bins || []
                    ).map((bin, idx) => (
                      <span key={idx} className="bin-tag">{bin.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              <button className="btn-close-modal" onClick={() => setShowDetailModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkersManagement;