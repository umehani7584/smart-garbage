'use client';

import React, { useState, useEffect } from 'react';
import {
  FiSave,
  FiGlobe,
  FiRefreshCw,
  FiBell,
  FiDatabase,
  FiCheckCircle,
  FiAlertCircle,
  FiCpu,
} from 'react-icons/fi';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SettingsTab() {
  const [settings, setSettings] = useState({
    systemName: 'IoT Enabled Smart Garbage Monitoring System',
    telemetryRate: '300ms (Sub-second Live)',
    criticalThreshold: 65,
    moderateThreshold: 40,
    emptyDistance: 19.0,
    audioAlerts: true,
    hotspotSSID: 'Not For U',
    timezone: 'Asia/Karachi (UTC+5)',
  });

  const [saved, setSaved] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState(false);

  useEffect(() => {
    setSupabaseStatus(isSupabaseConfigured());
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminSettings');
      if (stored) {
        try {
          setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
        } catch {}
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px' }}>
      {saved && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <FiCheckCircle size={18} />
          <span>System configuration saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          System Configuration & IoT Parameters
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem', margin: 0 }}>
          Hardware calibration, Supabase realtime sync, and municipal telemetry endpoints
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Card 1: Cloud & Database Status */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7' }}>
              <FiDatabase size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Supabase Realtime Cloud Status
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>PostgreSQL database connection and live WebSocket listener</p>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: supabaseStatus ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${supabaseStatus ? '#a7f3d0' : '#fde68a'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {supabaseStatus ? (
                <FiCheckCircle size={20} style={{ color: '#10b981' }} />
              ) : (
                <FiAlertCircle size={20} style={{ color: '#f59e0b' }} />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: supabaseStatus ? '#047857' : '#b45309' }}>
                  {supabaseStatus ? 'Supabase Credentials Active & Connected' : 'Demo / Simulation Mode Active'}
                </div>
                <div style={{ fontSize: '0.78rem', color: supabaseStatus ? '#065f46' : '#92400e' }}>
                  {supabaseStatus
                    ? 'Listening to postgres_changes on bins, sensor_data, and alerts over WebSockets.'
                    : 'To connect live Supabase, configure credentials in .env.local.'}
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: supabaseStatus ? '#10b981' : '#f59e0b',
                color: '#ffffff',
              }}
            >
              {supabaseStatus ? 'ONLINE' : 'SIMULATION MODE'}
            </span>
          </div>
        </div>

        {/* Card 2: Calibrated Threshold Parameters */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444' }}>
              <FiCpu size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Calibrated IoT Status Thresholds
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Criteria for automated alerts, traffic-light LEDs, and audio alarms</p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                🔴 Critical Fill Threshold (%)
              </label>
              <input
                type="number"
                value={settings.criticalThreshold}
                onChange={(e) => setSettings({ ...settings, criticalThreshold: parseInt(e.target.value) || 65 })}
                min={50}
                max={99}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                Triggers Red LED, proximity buzzer, and critical dispatch alerts (Calibrated: 65%)
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                🟡 Moderate Warning Threshold (%)
              </label>
              <input
                type="number"
                value={settings.moderateThreshold}
                onChange={(e) => setSettings({ ...settings, moderateThreshold: parseInt(e.target.value) || 40 })}
                min={15}
                max={75}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                Bins between 40% and 64% trigger Yellow LED (Calibrated: 40%)
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                📏 Calibrated Empty Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.emptyDistance}
                onChange={(e) => setSettings({ ...settings, emptyDistance: parseFloat(e.target.value) || 19.0 })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                Sensor to empty bin bottom distance (Hardware calibrated: 19.0 cm)
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                ⚡ Ingestion Telemetry Rate
              </label>
              <input
                type="text"
                disabled
                value={settings.telemetryRate}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                Ultra-fast 300ms stream + 0ms event-driven lid state updates
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: ESP32 REST Endpoint Info */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981' }}>
              <FiGlobe size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                ESP32 Production Cloud Ingestion Endpoint
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>Live Vercel Edge destination for ESP32 JSON payloads</p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              padding: '1.25rem',
              borderRadius: '10px',
              overflowX: 'auto',
              lineHeight: '1.6',
            }}
          >
            <div style={{ color: '#94a3b8' }}>// Target Vercel Cloud Production URL:</div>
            <div style={{ color: '#f8fafc', fontWeight: 700, margin: '4px 0' }}>
              POST https://smart-garbage-ihlq.vercel.app/api/sensor-data
            </div>
            <div style={{ color: '#a3e635', marginTop: '6px' }}>
              &#123; &quot;bin_id&quot;: &quot;BIN-001&quot;, &quot;fill_level&quot;: 74.0, &quot;distance_cm&quot;: 5.0, &quot;temperature&quot;: 26.6, &quot;humidity&quot;: 55.8, &quot;lid_status&quot;: &quot;CLOSED&quot; &#125;
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <FiSave size={16} />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
}
