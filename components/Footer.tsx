'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard pages
  const isDashboardPage = pathname.startsWith('/admin-dashboard');
  if (isDashboardPage) return null;

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '4rem 1.5rem 2rem',
        borderTop: '1px solid #1e293b',
        marginTop: '4rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>♻️</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>Smart Garbage System</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '320px' }}>
            Next-Generation IoT enabled waste monitoring platform for cleaner, greener, and sustainable smart cities.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#38bdf8', padding: '4px 10px', borderRadius: '20px' }}>
              ESP32 Microcontroller
            </span>
            <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#34d399', padding: '4px 10px', borderRadius: '20px' }}>
              Supabase Realtime
            </span>
            <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#fbbf24', padding: '4px 10px', borderRadius: '20px' }}>
              Next.js 15+
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li>
              <Link href="/" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>Home</Link>
            </li>
            <li>
              <Link href="/about" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>About System</Link>
            </li>
            <li>
              <Link href="/contact" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>Contact & Support</Link>
            </li>
            <li>
              <Link href="/policies" style={{ color: '#94a3b8', fontSize: '0.9rem', transition: 'color 0.2s' }}>Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Architecture & Hardware Guides */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Technical Guides</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li>
              <Link href="/sensor-installation" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>🔧 Sensor Installation</Link>
            </li>
            <li>
              <Link href="/data-collection" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>📡 Data Collection (ESP32)</Link>
            </li>
            <li>
              <Link href="/database-processing" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>💾 Database Processing</Link>
            </li>
            <li>
              <Link href="/smart-alerts" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>🔔 Smart Alert Engine</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '1.2rem' }}>Institution</h4>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <p>National University of Modern Languages</p>
            <p>Department of Computer Science</p>
            <p>Sector H-9, Islamabad, Pakistan</p>
            <p style={{ marginTop: '0.5rem' }}>📧 contact@smartgarbage.edu.pk</p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#64748b',
          fontSize: '0.85rem',
          gap: '1rem',
        }}
      >
        <p>© 2026 IoT Enabled Smart Garbage Monitoring System. All rights reserved.</p>
        <p>Built with Next.js App Router & Supabase</p>
      </div>
    </footer>
  );
}
