import React, { useState } from 'react';
import { FiMapPin, FiThermometer, FiDroplet, FiBox, FiX } from 'react-icons/fi';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './BinsManagement.css';

function BinsManagement() {
  const { binsData, loading } = useRealTimeData();
  const [selectedBin, setSelectedBin] = useState(null);

  const getStatus = (fillLevel) => {
    if (fillLevel > 85) return { status: 'critical', color: '#f44336' };
    if (fillLevel > 60) return { status: 'warning', color: '#ff9800' };
    return { status: 'normal', color: '#4caf50' };
  };

  const getBinIcon = (fillLevel) => {
    if (fillLevel > 85) return '🗑️🔴';
    if (fillLevel > 60) return '🗑️🟡';
    return '🗑️🟢';
  };

  if (loading) {
    return <div className="loading-spinner">Loading Bins...</div>;
  }

  return (
    <div className="bins-container">
      {/* Header */}
      <div className="bins-header">
        <div>
          <h1 className="page-title">Bin Management</h1>
          <p className="page-subtitle">Monitor and manage all smart bins in real-time</p>
        </div>
        <div className="bins-stats">
          <span className="stat-badge">{binsData.length} Bins</span>
        </div>
      </div>

      {/* Bins Grid */}
      <div className="bins-grid">
        {binsData.map((bin, idx) => {
          const { status, color } = getStatus(bin.fillLevel);
          return (
            <div 
              key={idx} 
              className="bin-card"
              onClick={() => setSelectedBin(bin)}
            >
              <div className="bin-card-inner">
                {/* Icon */}
                <div className="bin-icon">{getBinIcon(bin.fillLevel)}</div>

                {/* ID */}
                <h3 className="bin-id">{bin.id}</h3>

                {/* Status Badge */}
                <div className="status-badge" style={{ backgroundColor: `${color}20`, color }}>
                  {status.toUpperCase()}
                </div>

                {/* Fill Level Bar */}
                <div className="fill-section">
                  <div className="fill-label">
                    <span>Fill Level</span>
                    <span className="fill-value" style={{ color }}>{Math.round(bin.fillLevel)}%</span>
                  </div>
                  <div className="fill-bar">
                    <div 
                      className="fill-progress" 
                      style={{ 
                        width: `${bin.fillLevel}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>

                {/* Sensor Data */}
                <div className="sensor-data">
                  <div className="sensor-item">
                    <FiThermometer className="sensor-icon" />
                    <span>{bin.temperature}°C</span>
                  </div>
                  <div className="sensor-item">
                    <FiDroplet className="sensor-icon" />
                    <span>{bin.humidity}%</span>
                  </div>
                  <div className="sensor-item">
                    <FiBox className="sensor-icon" />
                    <span>{bin.weight}kg</span>
                  </div>
                </div>

                {/* Location */}
                <div className="location">
                  <FiMapPin className="location-icon" />
                  <span>{bin.area}</span>
                </div>

                {/* View Button */}
                <button className="view-btn">View Details</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedBin && (
        <div className="modal-overlay" onClick={() => setSelectedBin(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Bin Details</h2>
              <button 
                className="modal-close" 
                onClick={() => setSelectedBin(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Bin ID:</span>
                <span className="detail-value">{selectedBin.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Area:</span>
                <span className="detail-value">{selectedBin.area}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fill Level:</span>
                <span className="detail-value" style={{ color: getStatus(selectedBin.fillLevel).color }}>
                  {selectedBin.fillLevel}%
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Temperature:</span>
                <span className="detail-value">{selectedBin.temperature}°C</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Humidity:</span>
                <span className="detail-value">{selectedBin.humidity}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">{selectedBin.weight}kg</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gas Level:</span>
                <span className="detail-value">{selectedBin.gas} ppm</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{selectedBin.lastUpdated}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Coordinates:</span>
                <span className="detail-value">{selectedBin.lat.toFixed(4)}, {selectedBin.lon.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BinsManagement;