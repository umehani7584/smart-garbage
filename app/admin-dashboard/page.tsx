'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMenu,
  FiActivity,
  FiZap,
  FiRadio,
  FiClock,
  FiShield,
  FiRefreshCw,
} from 'react-icons/fi';
import AdminSidebar from '@/components/AdminDashboard/AdminSidebar';
import OverviewTab from '@/components/AdminDashboard/OverviewTab';
import BinsTab from '@/components/AdminDashboard/BinsTab';
import AnalyticsTab from '@/components/AdminDashboard/AnalyticsTab';
import SettingsTab from '@/components/AdminDashboard/SettingsTab';
import PrototypeLabTab from '@/components/AdminDashboard/PrototypeLabTab';
import { useSmartGarbageData } from '@/hooks/useSmartGarbageData';
import { isBinOnline } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const {
    bins,
    alerts,
    loading,
    isDemoMode,
    toggleDemoMode,
    supabaseConnected,
    lastSyncTime,
    refreshData,
    triggerManualSimulationTick,
    emptyBin,
    resolveAlert,
    updateBinTelemetry,
  } = useSmartGarbageData();

  // Prototype Bin & ESP32 Online Liveness (< 60s heartbeat)
  const prototypeBin = bins.find((b) => b.id === 'BIN-001') || bins[0];
  const isEsp32Online = prototypeBin ? isBinOnline(prototypeBin.updated_at, 60) : false;

  // Clock
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Protected route check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthChecked(true);
    }
  }, []);

  const criticalCount = bins.filter((b) => b.current_level > 80).length;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc', // Modern neutral slate background
        color: '#0f172a',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        criticalCount={criticalCount}
        totalBins={bins.length}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
        className="admin-main-wrapper"
      >
        {/* Top Executive Command Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 990,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          {/* Left: Institutional / System Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                color: '#0f172a',
                padding: '6px',
                borderRadius: '8px',
                background: '#f1f5f9',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
              }}
              className="admin-mobile-toggle"
              aria-label="Open Navigation"
            >
              <FiMenu size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Smart Garbage Monitoring System
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}
              >
                NUML IoT Lab
              </span>
            </div>
          </div>

          {/* Right: Clock, ESP32 Liveness Badge, Offline Sim Toggle, Refresh Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* System Clock */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              <FiClock size={13} style={{ color: '#0284c7' }} />
              <span>{currentTime || 'Syncing...'}</span>
            </div>

            {/* ESP32 Liveness Badge (ESP32 DEVKIT V1 (Live) / ESP32 DEVKIT V1 (Standby)) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: isEsp32Online ? '#ecfdf5' : '#f8fafc',
                border: `1px solid ${isEsp32Online ? '#a7f3d0' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isEsp32Online ? '#065f46' : '#64748b',
              }}
              title={isEsp32Online ? 'ESP32 DEVKIT V1 Hardware Node Active (<60s heartbeat)' : 'ESP32 DEVKIT V1 Hardware Node in Standby'}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isEsp32Online ? '#10b981' : '#94a3b8',
                  boxShadow: isEsp32Online ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none',
                }}
              />
              <span>{isEsp32Online ? 'ESP32 DEVKIT V1 (Live)' : 'ESP32 DEVKIT V1 (Standby)'}</span>
            </div>

            {/* Offline Simulation Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: isDemoMode ? '#fffbeb' : '#f0fdf4',
                border: `1px solid ${isDemoMode ? '#fde68a' : '#bbf7d0'}`,
                padding: '3px 8px 3px 10px',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 700, color: isDemoMode ? '#b45309' : '#15803d' }}>
                {isDemoMode ? <FiZap size={13} /> : <FiRadio size={13} />}
                <span className="hide-mode-label">{isDemoMode ? 'Simulation Mode' : 'Live Cloud'}</span>
              </div>

              <button
                onClick={() => toggleDemoMode(!isDemoMode)}
                style={{
                  width: '32px',
                  height: '18px',
                  backgroundColor: isDemoMode ? '#f59e0b' : '#10b981',
                  borderRadius: '20px',
                  position: 'relative',
                  padding: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                title={isDemoMode ? 'Switch to live Supabase Realtime' : 'Switch to Demo Simulation Mode'}
              >
                <span
                  style={{
                    display: 'block',
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    transform: isDemoMode ? 'translateX(0)' : 'translateX(14px)',
                    transition: 'transform 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>

            {/* Refresh Trigger */}
            <button
              onClick={isDemoMode ? triggerManualSimulationTick : refreshData}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#334155',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.15s',
              }}
              title="Fetch latest telemetry update"
            >
              <FiRefreshCw size={13} className={loading ? 'spin-active' : ''} style={{ color: '#0284c7' }} />
              <span>{loading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'overview' && (
            <OverviewTab
              bins={bins}
              alerts={alerts}
              isRefreshing={loading}
              onRefresh={isDemoMode ? triggerManualSimulationTick : refreshData}
              onEmptyBin={emptyBin}
              onResolveAlert={resolveAlert}
            />
          )}

          {activeTab === 'prototype' && (
            <PrototypeLabTab
              bins={bins}
              onRefresh={isDemoMode ? () => {} : refreshData}
              onEmptyBin={emptyBin}
              isDemoMode={isDemoMode}
              updateBinTelemetry={updateBinTelemetry}
            />
          )}

          {activeTab === 'bins' && <BinsTab bins={bins} onEmptyBin={emptyBin} />}


          {activeTab === 'analytics' && (
            <AnalyticsTab
              bins={bins}
              onRefresh={isDemoMode ? triggerManualSimulationTick : refreshData}
              isRefreshing={loading}
            />
          )}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      <style jsx>{`
        @media (min-width: 1025px) {
          .admin-main-wrapper {
            margin-left: 260px;
          }
        }
        @media (max-width: 1024px) {
          :global(.admin-mobile-toggle) {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          :global(.hide-mode-label) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
