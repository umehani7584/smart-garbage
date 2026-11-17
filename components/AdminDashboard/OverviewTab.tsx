'use client';

import React, { useState, useEffect } from 'react';
import {
  FiTrash2,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiDownload,
  FiBarChart2,
  FiRefreshCw,
  FiDroplet,
  FiThermometer,
  FiWind,
  FiCheck,
  FiAlertTriangle,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Bin, Alert, getStatusStyle, isBinOnline } from '@/lib/supabase';

interface OverviewTabProps {
  bins: Bin[];
  alerts: Alert[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onEmptyBin: (binId: string) => void;
  onResolveAlert: (alertId?: number) => void;
}

export default function OverviewTab({
  bins,
  alerts,
  isRefreshing,
  onRefresh,
  onEmptyBin,
  onResolveAlert,
}: OverviewTabProps) {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'danger' | 'info' } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' | 'danger' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Metrics computation based on spec:
  // Safe: < 40%
  // Moderate: 40% - 64%
  // Critical: >= 65%
  const totalBins = bins.length;
  const safeBins = bins.filter((b) => b.current_level < 40).length;
  const moderateBins = bins.filter((b) => b.current_level >= 40 && b.current_level < 65).length;
  const criticalBins = bins.filter((b) => b.current_level >= 65).length;
  const avgFillLevel = totalBins > 0 ? Math.round(bins.reduce((s, b) => s + b.current_level, 0) / totalBins) : 0;
  const activeAlerts = alerts.filter((a) => !a.is_resolved);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (bins.length === 0) {
      showToast('No bin records available for export.', 'warning');
      return;
    }

    const headers = ['Bin ID', 'Location', 'Capacity (L)', 'Fill Level (%)', 'Distance to Garbage (cm)', 'Status', 'Temperature (°C)', 'Humidity (%)', 'Device Connection', 'Last Updated'];
    const rows = bins.map((b) => [
      b.id,
      `"${b.location}"`,
      b.capacity,
      b.current_level,
      b.distance_cm ?? '',
      b.status,
      b.temperature ?? 25,
      b.humidity ?? 50,
      isBinOnline(b.updated_at, 60) ? 'Connected / Active' : 'Offline / No signal',
      `"${b.updated_at}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartGarbage_Live_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Dashboard report exported successfully as CSV!', 'success');
  };

  // Chart data
  const chartData = bins.map((bin) => ({
    name: bin.id,
    fill: bin.current_level,
    temp: bin.temperature ?? 26,
    humidity: bin.humidity ?? 48,
    gas: bin.gas_level ?? 18,
    status: bin.status,
  }));

  const statusDistribution = [
    { name: 'Safe (<40%)', value: safeBins, color: '#10b981' },
    { name: 'Moderate (40-64%)', value: moderateBins, color: '#f59e0b' },
    { name: 'Critical (≥65%)', value: criticalBins, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  // Custom bar shape color based on thresholds
  const getBarColor = (level: number) => {
    if (level >= 65) return '#ef4444'; // Crimson Red
    if (level >= 40) return '#f59e0b'; // Amber Yellow
    return '#10b981'; // Emerald Green
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '85px',
            right: '25px',
            zIndex: 9999,
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            color: '#ffffff',
            backgroundColor:
              toast.type === 'danger'
                ? '#ef4444'
                : toast.type === 'warning'
                ? '#f59e0b'
                : toast.type === 'success'
                ? '#10b981'
                : '#0284c7',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'slideDown 0.25s ease-out',
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Critical Alert Banner (Appears if any bin exceeds 80%) */}
      {criticalBins > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
          className="status-pulse-red"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ef4444',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiAlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem' }}>
                {criticalBins} Critical {criticalBins === 1 ? 'Bin Requires' : 'Bins Require'} Immediate Pickup!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#b91c1c' }}>
                Fill level exceeded 65% threshold. Automated alerts dispatched to waste management teams.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const firstCritical = bins.find((b) => b.current_level >= 65);
              if (firstCritical) onEmptyBin(firstCritical.id);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.82rem',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)',
            }}
          >
            Dispatch Collection Now
          </button>
        </div>
      )}

      {/* Action Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#ffffff',
          padding: '1.15rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              System Analytics Overview
            </h2>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#0284c7',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                padding: '2px 8px',
                borderRadius: '6px',
                letterSpacing: '0.01em',
              }}
            >
              Enterprise Scalability Mode: 1 Active Physical Edge Node (BIN-001) · 9 Municipal Fleet Simulation Nodes
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
            Real-time IoT ultrasonic & telemetry stream across municipal sectors
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1rem',
              backgroundColor: '#f1f5f9',
              color: '#334155',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: '1px solid #cbd5e1',
              transition: 'all 0.2s',
            }}
          >
            <FiRefreshCw className={isRefreshing ? 'spin-active' : ''} size={15} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Readings'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1rem',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
            }}
          >
            <FiDownload size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid - 5 Cards matching project spec */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Total Bins */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Monitored Bins
            </span>
            <div style={{ padding: '10px', borderRadius: '12px', background: '#f1f5f9', color: '#0284c7' }}>
              <FiTrash2 size={26} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {totalBins}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 500 }}>
              Connected via ESP32 WiFi nodes
            </div>
          </div>
        </div>

        {/* Card 2: Average Fill Level */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Avg Fill Level
            </span>
            <div style={{ padding: '10px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7' }}>
              <FiActivity size={26} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>
              {avgFillLevel}%
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 500 }}>
              Municipal fleet average
            </div>
          </div>
        </div>

        {/* Card 3: Safe / Normal (<40% fill) - Emerald Green */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            border: '1px solid #a7f3d0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Normal / Safe (&lt;40%)
            </span>
            <div style={{ padding: '10px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981' }}>
              <FiCheckCircle size={26} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
              {safeBins}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.5rem', fontWeight: 500 }}>
              Ample capacity remaining
            </div>
          </div>
        </div>

        {/* Card 4: Moderate Status (40% - 64% fill) - Amber Yellow */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            border: '1px solid #fde68a',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Moderate (40-64%)
            </span>
            <div style={{ padding: '10px', borderRadius: '12px', background: '#fffbeb', color: '#f59e0b' }}>
              <FiTrendingUp size={26} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
              {moderateBins}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#d97706', marginTop: '0.5rem', fontWeight: 500 }}>
              Monitor for collection dispatch
            </div>
          </div>
        </div>

        {/* Card 5: Critical / Alert Status (>=65% fill) - Crimson Red with Pulse Glow */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            border: '2px solid #ef4444',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          className={criticalBins > 0 ? 'status-pulse-red' : ''}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Critical (&ge;65%)
            </span>
            <div
              style={{
                padding: '10px',
                borderRadius: '12px',
                background: '#fef2f2',
                color: '#ef4444',
              }}
              className={criticalBins > 0 ? 'status-badge-pulse' : ''}
            >
              <FiAlertCircle size={26} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>
              {criticalBins}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '0.5rem', fontWeight: 600 }}>
              {criticalBins > 0 ? '🔴 Attention Required' : 'All bins below threshold'}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Balanced Symmetrical 2x2 Layout with Spacious 320px Height */}
      <div className="charts-grid-responsive">
        {/* Chart 1: Bar Chart Fill Level by Bin (Top-Left) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Fill Level by Bin</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Color coded: &lt;40% Safe | 40-64% Moderate | &ge;65% Critical</p>
            </div>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7' }}>
              <FiBarChart2 size={22} />
            </div>
          </div>

          {mounted && (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem' }}
                    formatter={(val: any) => [`${val}% Fill Level`, 'Capacity']}
                  />
                  <Bar dataKey="fill" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.fill)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 2: Doughnut / Pie Chart Status Distribution (Top-Right) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Status Distribution</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Breakdown of municipal bins by health status</p>
            </div>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981' }}>
              <FiTrendingUp size={22} />
            </div>
          </div>

          {mounted && (
            <div>
              <div style={{ width: '100%', height: 275, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusDistribution.map((entry, idx) => (
                        <Cell key={`pie-cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Clean Legend Chips Underneath Donut */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {statusDistribution.map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color, display: 'inline-block' }} />
                    <span style={{ color: '#475569' }}>{entry.name}:</span>
                    <span style={{ color: '#0f172a', fontWeight: 800 }}>{entry.value} bins</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chart 3: Temperature Telemetry Line Chart (Bottom-Left) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Bin Temperature Telemetry</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>DHT11 sensor readings (°C) to prevent spontaneous combustion</p>
            </div>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#fff7ed', color: '#f97316' }}>
              <FiThermometer size={22} />
            </div>
          </div>

          {mounted && (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                  <YAxis stroke="#94a3b8" domain={[15, 55]} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickFormatter={(v) => `${v}°C`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem' }}
                    formatter={(val: any) => [`${val}°C`, 'Temperature']}
                  />
                  <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4.5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 4: Humidity Telemetry Area Chart (Bottom-Right) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Bin Humidity Telemetry</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>DHT11 sensor moisture readings (%RH)</p>
            </div>
            <div style={{ padding: '8px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7' }}>
              <FiDroplet size={22} />
            </div>
          </div>

          {mounted && (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '0.82rem' }}
                    formatter={(val: any) => [`${val}% RH`, 'Humidity']}
                  />
                  <Area type="monotone" dataKey="humidity" stroke="#0284c7" fillOpacity={1} fill="url(#humGrad)" strokeWidth={2.5} name="Humidity %RH" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>


      {/* Real-time Bins Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Real-Time Smart Bins Fleet</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Live Supabase telemetry updates automatically without page refresh
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Safe (&lt;40%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /> Moderate (40-64%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Critical (&ge;65%)
            </span>
          </div>
        </div>

        <div className="table-responsive-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Bin ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Location Sector</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Fill Progress</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Fill Level</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Temp (°C)</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bins.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                    No fleet bins registered in the system yet.
                  </td>
                </tr>
              ) : (
                bins.map((bin) => {
                  const s = getStatusStyle(bin.status);
                  const isCritical = bin.current_level >= 65;
                  const isOnline = isBinOnline(bin.updated_at, 60);
                  const isPhysical = bin.id === 'BIN-001';

                  return (
                    <tr
                      key={bin.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Bin ID & Name */}
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span>🗑️</span>
                          <span>{bin.id}</span>
                          {isPhysical ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 7px',
                                borderRadius: '12px',
                                backgroundColor: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#065f46',
                                fontSize: '0.67rem',
                                fontWeight: 800,
                                letterSpacing: '0.02em',
                              }}
                            >
                              <span
                                style={{
                                  width: '5px',
                                  height: '5px',
                                  borderRadius: '50%',
                                  backgroundColor: '#10b981',
                                }}
                                className="status-badge-pulse"
                              />
                              Physical Hardware
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '2px 7px',
                                borderRadius: '12px',
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                color: '#64748b',
                                fontSize: '0.67rem',
                                fontWeight: 600,
                              }}
                            >
                              Simulated Node
                            </span>
                          )}
                        </div>
                        {bin.name && (
                          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                            {bin.name}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', fontSize: '0.7rem', fontWeight: 500 }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isOnline ? '#10b981' : '#94a3b8',
                              display: 'inline-block',
                            }}
                          />
                          <span style={{ color: isOnline ? '#059669' : '#64748b' }}>
                            {isOnline ? 'Connected' : 'Offline'}
                          </span>
                        </div>
                      </td>

                    {/* Location */}
                    <td style={{ padding: '1rem 1rem', color: '#334155' }}>
                      {bin.location}
                    </td>

                    {/* Fill Progress Bar */}
                    <td style={{ padding: '1rem 1rem', minWidth: '130px' }}>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(0, bin.current_level))}%`,
                            height: '100%',
                            backgroundColor: getBarColor(bin.current_level),
                            borderRadius: '9999px',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </td>

                    {/* Fill Level Number & Headspace Distance */}
                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: getBarColor(bin.current_level) }}>
                        {bin.current_level.toFixed(1)}%
                      </div>
                      {bin.distance_cm !== undefined && (
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }} title="Distance to Garbage">
                          {bin.distance_cm} cm dist
                        </div>
                      )}
                    </td>

                    {/* Temperature */}
                    <td style={{ padding: '1rem 1rem', color: '#64748b' }}>
                      {bin.temperature ? `${bin.temperature}°C` : '24°C'}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: s.badgeBg,
                          color: s.badgeText,
                          border: `1px solid ${s.borderColor}40`,
                        }}
                        className={isCritical ? 'status-pulse-red' : ''}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: s.color,
                          }}
                        />
                        {bin.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          onEmptyBin(bin.id);
                          showToast(`Bin ${bin.id} collected & emptied successfully.`, 'success');
                        }}
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: isCritical ? '#ef4444' : '#f1f5f9',
                          color: isCritical ? '#ffffff' : '#334155',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                      >
                        {isCritical ? 'Collect Now' : 'Empty'}
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Alerts Stream Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Live System Alerts Log</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Auto-generated when bin fill level exceeds 65% threshold
            </p>
          </div>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: activeAlerts.length > 0 ? '#fef2f2' : '#ecfdf5',
              color: activeAlerts.length > 0 ? '#b91c1c' : '#047857',
            }}
          >
            {activeAlerts.length} Unresolved
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alerts.slice(0, 5).map((alert, idx) => (
            <div
              key={alert.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: alert.is_resolved ? '#f8fafc' : '#fff1f2',
                borderTop: '1px solid #f1f5f9',
                borderRight: '1px solid #f1f5f9',
                borderBottom: '1px solid #f1f5f9',
                borderLeft: `4px solid ${alert.is_resolved ? '#94a3b8' : '#ef4444'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{alert.is_resolved ? '✅' : '🚨'}</span>
                <div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: alert.is_resolved ? '#64748b' : '#0f172a',
                    }}
                  >
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Bin {alert.bin_id} • {new Date(alert.created_at).toLocaleTimeString()} •{' '}
                    {alert.is_resolved ? 'Resolved' : 'Pending Action'}
                  </div>
                </div>
              </div>

              {!alert.is_resolved && (
                <button
                  onClick={() => {
                    onResolveAlert(alert.id);
                    showToast(`Alert for ${alert.bin_id} marked as resolved.`, 'success');
                  }}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}

          {alerts.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
              No critical alerts at this time. All bins within normal operating limits.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .charts-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
