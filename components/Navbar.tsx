'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiLogIn, FiActivity, FiShield, FiExternalLink } from 'react-icons/fi';
import LoginModal from './LoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser') || localStorage.getItem('user');
      if (user) {
        try {
          setCurrentUser(JSON.parse(user));
        } catch {}
      }
    }
  }, [pathname]);

  // Hide Navbar completely on dedicated dashboard pages
  const isDashboardPage = pathname.startsWith('/admin-dashboard');
  if (isDashboardPage) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/policies', label: 'Policies' },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '76px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
              }}
            >
              ♻️
            </span>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                SmartGarbage <span style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#e0f2fe', borderRadius: '4px' }}>IoT v2</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                Clean Urban Waste Monitoring
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="hidden-mobile"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#0284c7' : '#334155',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#0284c7',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
            className="hidden-mobile"
          >
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  href="/admin-dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.15rem',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                  }}
                >
                  <FiActivity size={16} />
                  <span>Open Admin Panel</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('user');
                    setCurrentUser(null);
                    router.push('/');
                  }}
                  style={{
                    fontSize: '0.82rem',
                    color: '#64748b',
                    padding: '0.4rem 0.6rem',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s',
                }}
              >
                <FiLogIn size={15} />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.5rem',
              color: '#0f172a',
              display: 'none',
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '76px',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: 'slideDown 0.2s ease-out',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: pathname === link.href ? 700 : 500,
                  color: pathname === link.href ? '#0284c7' : '#334155',
                  padding: '0.4rem 0',
                }}
              >
                {link.label}
              </Link>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />
            {currentUser ? (
              <Link
                href="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.75rem',
                  background: '#0284c7',
                  color: '#ffffff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Go to Admin Dashboard
              </Link>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  style={{
                    padding: '0.75rem',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 600,
                    textAlign: 'center',
                    color: '#0f172a',
                  }}
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.hidden-mobile) {
            display: none !important;
          }
          :global(.mobile-toggle-btn) {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
