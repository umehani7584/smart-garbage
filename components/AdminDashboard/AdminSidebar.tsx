'use client';

import React from 'react';
import {
  FiHome,
  FiMapPin,
  FiBarChart2,
  FiSettings,
  FiX,
  FiTrash2,
  FiCpu,
} from 'react-icons/fi';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  criticalCount: number;
  totalBins?: number;
  onOpenLogin?: () => void;
  currentUser?: any;
  onLogout?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  criticalCount,
  totalBins,
  onOpenLogin,
  currentUser,
  onLogout,
}: AdminSidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'prototype', label: 'Prototype Lab', icon: FiCpu },
    {
      id: 'bins',
      label: 'Fleet Bins',
      icon: FiTrash2,
      badge: totalBins !== undefined ? totalBins : (criticalCount > 0 ? criticalCount : undefined),
      isCritical: criticalCount > 0,
    },
    { id: 'analytics', label: 'Analytics & Reports', icon: FiBarChart2 },
    { id: 'settings', label: 'System Settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
          className="admin-mobile-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0f172a', // Modern dark slate
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          borderRight: '1px solid #1e293b',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              ♻️
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', letterSpacing: '-0.01em' }}>
                IoT Command Center
              </div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Municipal Telemetry
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              color: '#94a3b8',
              padding: '4px',
              borderRadius: '6px',
              display: 'none',
            }}
            className="mobile-close-btn"
            aria-label="Close Sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User Card */}
        <div
          style={{
            padding: '0.85rem 1rem',
            margin: '0.85rem 0.75rem 0.5rem',
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            border: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: currentUser ? '#10b981' : '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                flexShrink: 0,
              }}
            >
              {currentUser ? 'SA' : 'OP'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Command Operator'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                {currentUser ? 'Authenticated Admin' : 'Console Active'}
              </div>
            </div>
          </div>

          {currentUser ? (
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.72rem',
                padding: '4px 6px',
                borderRadius: '4px',
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              title="Sign in as Administrator"
              style={{
                background: 'rgba(2, 132, 199, 0.25)',
                border: '1px solid #0284c7',
                color: '#38bdf8',
                cursor: 'pointer',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              Login
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                    setIsOpen(false);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '8px',
                  color: active ? '#ffffff' : '#94a3b8',
                  backgroundColor: active ? '#0284c7' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease-in-out',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} style={{ color: active ? '#ffffff' : '#64748b' }} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && (
                  <span
                    style={{
                      backgroundColor: item.isCritical ? '#ef4444' : '#1e293b',
                      color: item.isCritical ? '#ffffff' : '#94a3b8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: item.isCritical ? '1px solid #ef4444' : '1px solid #334155',
                    }}
                    className={item.isCritical ? 'status-badge-pulse' : ''}
                    title={item.isCritical ? `${criticalCount} bins critical` : `${item.badge} fleet bins`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          style={{
            padding: '0.85rem',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              padding: '0.65rem 0.75rem',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              fontSize: '0.7rem',
              color: '#64748b',
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontWeight: 700, color: '#94a3b8' }}>NUML Department of CS</div>
            <div>Final Year Project • 2026</div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
        @media (min-width: 1025px) {
          .admin-mobile-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
