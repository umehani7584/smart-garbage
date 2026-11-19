'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiLock,
  FiMail,
  FiShield,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiCpu,
  FiActivity,
  FiKey,
} from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in, redirect immediately to admin dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser') || localStorage.getItem('user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user && user.email) {
            router.replace('/admin-dashboard');
            return;
          }
        } catch {}
      }
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Authenticate credentials
    const isValidAdmin =
      (cleanEmail === 'admin@smartgarbage.com' || cleanEmail === 'admin') &&
      cleanPass === 'admin123';

    setTimeout(() => {
      if (isValidAdmin) {
        const adminUser = {
          id: 1,
          name: 'System Admin',
          email: 'admin@smartgarbage.com',
          role: 'Administrator',
          department: 'NUML CS Department',
          loginTime: new Date().toISOString(),
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
          localStorage.setItem('user', JSON.stringify(adminUser));
        }

        router.push('/admin-dashboard');
      } else {
        setError('Invalid credentials. Tip: Use admin@smartgarbage.com / admin123');
        setLoading(false);
      }
    }, 400);
  };

  const fillQuickDemo = () => {
    setEmail('admin@smartgarbage.com');
    setPassword('admin123');
    setError('');
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.95rem',
        }}
      >
        <FiActivity className="animate-spin" size={24} style={{ marginRight: '8px' }} />
        <span>Initializing IoT Command Center...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        backgroundImage:
          'radial-gradient(circle at 50% 10%, rgba(2, 132, 199, 0.18) 0%, rgba(15, 23, 42, 1) 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f8fafc',
      }}
    >
      {/* Top Floating Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid #334155',
          fontSize: '0.76rem',
          color: '#38bdf8',
          fontWeight: 600,
          marginBottom: '1.5rem',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 10px #10b981',
          }}
        />
        <span>ESP32 Physical Node & Supabase Realtime Active</span>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          color: '#0f172a',
        }}
      >
        {/* Header with Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.6rem',
              boxShadow: '0 10px 20px -5px rgba(2, 132, 199, 0.4)',
            }}
          >
            ♻️
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            IoT Command Center
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
            Smart Garbage Monitoring & Autonomous Waste Management System
          </p>
          <div
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#0284c7',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            NUML CS Department · Final Year Project
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
              fontWeight: 500,
            }}
          >
            <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Email Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.35rem',
              }}
            >
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
                size={18}
              />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartgarbage.com"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#0f172a',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.35rem',
              }}
            >
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
                size={18}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.75rem 1rem 0.75rem 2.4rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#0f172a',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Quick-Fill Helper for Presentation */}
          <button
            type="button"
            onClick={fillQuickDemo}
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.75rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <FiKey size={14} style={{ color: '#0284c7' }} />
            <span>Auto-fill Demo Credentials (admin123)</span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)',
              transition: 'transform 0.1s, opacity 0.2s',
              opacity: loading ? 0.75 : 1,
              marginTop: '0.25rem',
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Command Center</span>
                <FiArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security Trust Badges */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            color: '#64748b',
            fontSize: '0.72rem',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiShield style={{ color: '#10b981' }} size={13} />
            <span>TLS Encrypted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiCheckCircle style={{ color: '#0284c7' }} size={13} />
            <span>Supabase RLS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiCpu style={{ color: '#f59e0b' }} size={13} />
            <span>ESP32 Ingestion</span>
          </div>
        </div>
      </div>

      {/* Municipal Footer */}
      <div
        style={{
          marginTop: '1.5rem',
          fontSize: '0.74rem',
          color: '#64748b',
          textAlign: 'center',
        }}
      >
        Smart Garbage Fleet Management System © 2026 · All Rights Reserved
      </div>
    </div>
  );
}
