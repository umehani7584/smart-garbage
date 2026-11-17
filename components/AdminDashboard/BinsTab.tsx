'use client';

import React, { useState } from 'react';
import {
  FiMapPin,
  FiThermometer,
  FiDroplet,
  FiActivity,
  FiX,
  FiSearch,
  FiFilter,
  FiCheckCircle,
} from 'react-icons/fi';
import { Bin, getStatusStyle, isBinOnline } from '@/lib/supabase';

interface BinsTabProps {
  bins: Bin[];
  onEmptyBin: (binId: string) => void;
}

export default function BinsTab({ bins, onEmptyBin }: BinsTabProps) {
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Safe' | 'Moderate' | 'Critical'>('All');
  const [nodeFilter, setNodeFilter] = useState<'all' | 'physical' | 'simulated'>('all');

  const physicalCount = bins.filter((b) => b.id === 'BIN-001').length;
  const simulatedCount = bins.filter((b) => b.id !== 'BIN-001').length;
  const totalCount = bins.length;

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || bin.status === statusFilter;
    const matchesNode =
      nodeFilter === 'all' ||
      (nodeFilter === 'physical' && bin.id === 'BIN-001') ||
      (nodeFilter === 'simulated' && bin.id !== 'BIN-001');
    return matchesSearch && matchesStatus && matchesNode;
  });

  const getBarColor = (level: number) => {
    if (level >= 65) return '#ef4444'; // Crimson Red (Critical >=65%)
    if (level >= 40) return '#f59e0b'; // Amber Yellow (Moderate 40-64%)
    return '#10b981'; // Emerald Green (Safe <40%)
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search & Filter Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Municipal Smart Bins Directory
              </h2>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#475569',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                1 Physical Node · {simulatedCount} Fleet Nodes
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
              Live telemetry status, physical hardware diagnostics & municipal fleet controls
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '10px', top: '11px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by ID or Sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 1rem 0.5rem 2.2rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.85rem',
                outline: 'none',
                minWidth: '220px',
              }}
            />
          </div>
        </div>

        {/* Filter Bar with Node-Type Filter and Status Filter */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {/* Node-Type Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#f8fafc',
              padding: '3px',
              borderRadius: '9px',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => setNodeFilter('all')}
              style={{
                padding: '0.38rem 0.8rem',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: nodeFilter === 'all' ? '#0f172a' : 'transparent',
                color: nodeFilter === 'all' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              All Nodes ({totalCount})
            </button>
            <button
              onClick={() => setNodeFilter('physical')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.38rem 0.8rem',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: nodeFilter === 'physical' ? '#ecfdf5' : 'transparent',
                color: nodeFilter === 'physical' ? '#065f46' : '#047857',
                border: nodeFilter === 'physical' ? '1px solid #a7f3d0' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
                className={nodeFilter === 'physical' ? 'status-badge-pulse' : ''}
              />
              <span>Physical Node ({physicalCount})</span>
            </button>
            <button
              onClick={() => setNodeFilter('simulated')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.38rem 0.8rem',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: nodeFilter === 'simulated' ? '#0284c7' : 'transparent',
                color: nodeFilter === 'simulated' ? '#ffffff' : '#64748b',
                transition: 'all 0.15s',
              }}
            >
              <span>🌐</span>
              <span>Simulated Fleet ({simulatedCount})</span>
            </button>
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginRight: '4px' }}>Status:</span>
            {(['All', 'Safe', 'Moderate', 'Critical'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === st ? '#0284c7' : '#f1f5f9',
                  color: statusFilter === st ? '#ffffff' : '#475569',
                  transition: 'all 0.15s',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bins Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredBins.map((bin) => {
          const s = getStatusStyle(bin.status);
          const isCritical = bin.current_level >= 65;
          const isPhysical = bin.id === 'BIN-001';

          return (
            <div
              key={bin.id}
              onClick={() => setSelectedBin(bin)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: isPhysical
                  ? '2px solid #10b981'
                  : `1px solid ${isCritical ? '#ef4444' : '#e2e8f0'}`,
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
              className={isCritical ? 'status-pulse-red' : ''}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                {/* Node Classification Badge */}
                {isPhysical ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#065f46',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                      marginBottom: '0.75rem',
                      width: 'fit-content',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 6px rgba(16, 185, 129, 0.7)',
                      }}
                      className="status-badge-pulse"
                    />
                    <span>🟢 PHYSICAL HARDWARE (ESP32 LIVE)</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#64748b',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      marginBottom: '0.75rem',
                      width: 'fit-content',
                    }}
                  >
                    <span>🌐 MUNICIPAL FLEET NODE</span>
                  </div>
                )}

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {bin.current_level >= 65 ? '🗑️🔴' : bin.current_level >= 40 ? '🗑️🟡' : '🗑️🟢'}
                    </span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{bin.id}</span>
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: isBinOnline(bin.updated_at, 60) ? '#10b981' : '#94a3b8',
                            display: 'inline-block',
                          }}
                          title={isBinOnline(bin.updated_at, 60) ? 'Connected / Active' : 'Offline / No signal'}
                        />
                      </div>
                      {bin.name && (
                        <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                          {bin.name}
                        </div>
                      )}
                      <div style={{ fontSize: '0.72rem', color: isBinOnline(bin.updated_at, 60) ? '#059669' : '#64748b', fontWeight: 500 }}>
                        {isBinOnline(bin.updated_at, 60) ? 'Connected' : 'Offline'} • Cap: {bin.capacity}L
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '3px 9px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: s.badgeBg,
                      color: s.badgeText,
                      border: `1px solid ${s.borderColor}40`,
                    }}
                  >
                    {bin.status}
                  </span>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <FiMapPin size={14} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bin.location}
                  </span>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 500 }}>Fill Capacity</span>
                    <span style={{ fontWeight: 700, color: getBarColor(bin.current_level) }}>
                      {bin.current_level.toFixed(1)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${bin.current_level}%`,
                        height: '100%',
                        backgroundColor: getBarColor(bin.current_level),
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  {bin.distance_cm !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                      <span>Distance to Garbage:</span>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{bin.distance_cm} cm</span>
                    </div>
                  )}
                </div>

                {/* Sensor telemetry badges */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.4rem',
                    marginBottom: '1rem',
                    fontSize: '0.72rem',
                    color: '#475569',
                  }}
                >
                  <div style={{ background: '#f8fafc', padding: '5px', borderRadius: '6px', textAlign: 'center' }} title="Temperature (DHT11)">
                    <FiThermometer size={12} style={{ color: '#f97316', marginRight: '2px' }} />
                    {bin.temperature ?? 25}°C
                  </div>
                  <div style={{ background: '#f8fafc', padding: '5px', borderRadius: '6px', textAlign: 'center' }} title="Humidity (DHT11)">
                    <FiDroplet size={12} style={{ color: '#0284c7', marginRight: '2px' }} />
                    {bin.humidity ?? 45}%
                  </div>
                  <div style={{ background: '#f8fafc', padding: '5px', borderRadius: '6px', textAlign: 'center' }} title="Headspace (HC-SR04)">
                    <FiActivity size={12} style={{ color: '#10b981', marginRight: '2px' }} />
                    {bin.distance_cm ?? 23.2}cm
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEmptyBin(bin.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    backgroundColor: isCritical ? '#ef4444' : '#f1f5f9',
                    color: isCritical ? '#ffffff' : '#334155',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                >
                  {isCritical ? 'Collect Now' : 'Empty'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBin(bin);
                  }}
                  style={{
                    padding: '0.45rem 0.85rem',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBins.length === 0 && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          No bins match the current search or status filter.
        </div>
      )}

      {/* Bin Detail Modal */}
      {selectedBin && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedBin(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBin(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                color: '#64748b',
                background: '#f1f5f9',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiX size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2rem' }}>🗑️</span>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{selectedBin.id}</h3>
                {selectedBin.name && (
                  <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600 }}>{selectedBin.name}</div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedBin.location}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Architecture Role:</span>
                <span style={{ fontWeight: 700, color: selectedBin.id === 'BIN-001' ? '#047857' : '#0284c7' }}>
                  {selectedBin.id === 'BIN-001' ? '🟢 Physical Hardware (ESP32 DEVKIT V1)' : '🌐 Municipal Fleet Simulation Node'}
                </span>
              </div>
              {selectedBin.latitude !== undefined && selectedBin.longitude !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>GPS Coordinates:</span>
                  <b>{selectedBin.latitude.toFixed(4)}° N, {selectedBin.longitude.toFixed(4)}° E</b>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Device Connection:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: isBinOnline(selectedBin.updated_at, 60) ? '#059669' : '#64748b' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: isBinOnline(selectedBin.updated_at, 60) ? '#10b981' : '#94a3b8' }} />
                  {isBinOnline(selectedBin.updated_at, 60) ? 'Connected / Active' : 'Offline / No signal'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Fill Level:</span>
                <b style={{ color: getBarColor(selectedBin.current_level) }}>{selectedBin.current_level.toFixed(1)}%</b>
              </div>
              {selectedBin.distance_cm !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>Distance to Garbage:</span>
                  <b>{selectedBin.distance_cm} cm</b>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Status Classification:</span>
                <b>{selectedBin.status}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Internal Temperature:</span>
                <b>{selectedBin.temperature ?? 25}°C</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Relative Humidity:</span>
                <b>{selectedBin.humidity ?? 45}%</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Ultrasonic Headspace:</span>
                <b>{selectedBin.distance_cm ?? 23.2} cm</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Servo Lid State:</span>
                <b>{selectedBin.lid_status ?? 'CLOSED'}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Last Realtime Sync:</span>
                <span style={{ fontSize: '0.78rem', color: '#334155' }}>{new Date(selectedBin.updated_at).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  onEmptyBin(selectedBin.id);
                  setSelectedBin({ ...selectedBin, current_level: 0, status: 'Safe' });
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <FiCheckCircle />
                <span>Mark as Collected (Reset to 0%)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
