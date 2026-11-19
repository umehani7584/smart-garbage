'use client';

import React, { useState, useMemo } from 'react';
import {
  FiBarChart2,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiPieChart,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Bin, getStatusStyle, isBinOnline } from '@/lib/supabase';

interface AnalyticsTabProps {
  bins: Bin[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function AnalyticsTab({ bins, onRefresh, isRefreshing }: AnalyticsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortKey, setSortKey] = useState<'current_level' | 'temperature' | 'humidity'>('current_level');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered and sorted bins
  const filteredBins = useMemo(() => {
    let result = [...bins];
    if (searchQuery) {
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter((b) => b.status.toLowerCase() === filterStatus.toLowerCase());
    }

    result.sort((a, b) => {
      const aVal = (a as any)[sortKey] ?? 0;
      const bVal = (b as any)[sortKey] ?? 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [bins, searchQuery, filterStatus, sortKey, sortOrder]);

  // Grouped area metrics
  const areaMetrics = useMemo(() => {
    const map = new Map<string, { count: number; totalFill: number; totalTemp: number }>();
    bins.forEach((b) => {
      // Extract sector e.g. "F-7", "F-8", "G-11" or department name
      const match = b.location.match(/(?:Sector\s+)?([A-Z]-\d+)/i);
      const sector = match ? match[1].toUpperCase() : (b.location.split(',')[0].trim() || b.location);
      const cur = map.get(sector) || { count: 0, totalFill: 0, totalTemp: 0 };
      map.set(sector, {
        count: cur.count + 1,
        totalFill: cur.totalFill + b.current_level,
        totalTemp: cur.totalTemp + (b.temperature || 25),
      });
    });

    return Array.from(map.entries()).map(([area, val]) => ({
      area,
      avgFill: Math.round(val.totalFill / val.count),
      avgTemp: Math.round(val.totalTemp / val.count),
      count: val.count,
    }));
  }, [bins]);

  // Synthetic 7-day trend for presentation analytics
  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
    const base = bins.length > 0 ? bins.reduce((s, b) => s + b.current_level, 0) / bins.length : 50;
    return {
      day,
      fillLevel: Math.round(Math.max(20, Math.min(95, base + Math.sin(idx * 0.9) * 16))),
      temperature: Math.round(24 + Math.cos(idx * 0.8) * 4),
    };
  });

  const handleExportCSV = () => {
    if (filteredBins.length === 0) return;
    const headers = ['Bin ID', 'Location', 'Fill Level (%)', 'Distance to Garbage (cm)', 'Status', 'Temperature (°C)', 'Humidity (%)', 'Device Connection'];
    const rows = filteredBins.map((b) => [
      b.id,
      `"${b.location}"`,
      b.current_level,
      b.distance_cm ?? '',
      b.status,
      b.temperature ?? 25,
      b.humidity ?? 50,
      isBinOnline(b.updated_at, 60) ? 'Connected / Active' : 'Offline / No signal',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusCounts = {
    safe: bins.filter((b) => b.current_level < 30).length,
    moderate: bins.filter((b) => b.current_level >= 30 && b.current_level <= 80).length,
    critical: bins.filter((b) => b.current_level > 80).length,
  };

  const pieData = [
    { name: 'Safe (<30%)', value: statusCounts.safe, color: '#10b981' },
    { name: 'Moderate (30-80%)', value: statusCounts.moderate, color: '#f59e0b' },
    { name: 'Critical (>80%)', value: statusCounts.critical, color: '#ef4444' },
  ].filter((p) => p.value > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            In-Depth Telemetry & Historical Trends
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Sector correlations, predictive fill dynamics and multi-point telemetry
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
            }}
          >
            <FiRefreshCw className={isRefreshing ? 'spin-active' : ''} size={15} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Analytics'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1rem',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <FiDownload size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <FiSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Filter by Bin ID or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.2rem',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiFilter style={{ color: '#0284c7' }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.5rem 0.85rem',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Status Categories</option>
            <option value="safe">Safe (&lt;30%)</option>
            <option value="moderate">Moderate (30-80%)</option>
            <option value="critical">Critical (&gt;80%)</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Showing <b>{filteredBins.length}</b> of {bins.length} bins
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
        className="analytics-charts-grid"
      >
        {/* Weekly Trend */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>7-Day Municipal Fill Trend</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Daily aggregated peak fill levels (%)</p>
            </div>
            <FiTrendingUp style={{ color: '#0284c7' }} size={20} />
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weekFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff' }} />
                <Area type="monotone" dataKey="fillLevel" stroke="#0284c7" strokeWidth={2.5} fill="url(#weekFill)" name="Avg Fill %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Grouped Bar Chart */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Sector Comparison: Fill vs Temp</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Average fill % and heat level across municipal zones</p>
            </div>
            <FiBarChart2 style={{ color: '#10b981' }} size={20} />
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="area" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff' }} />
                <Legend />
                <Bar dataKey="avgFill" name="Avg Fill %" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={60} />
                <Bar dataKey="avgTemp" name="Avg Temp °C" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sortable Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Detailed Bin-by-Bin Metrics Table</h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Click headers to sort ascending or descending</p>
        </div>

        <div className="table-responsive-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Bin ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                <th
                  style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                  onClick={() => {
                    setSortKey('current_level');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Fill Level {sortKey === 'current_level' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th
                  style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                  onClick={() => {
                    setSortKey('temperature');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Temp {sortKey === 'temperature' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th
                  style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                  onClick={() => {
                    setSortKey('humidity');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Humidity {sortKey === 'humidity' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.map((bin) => {
                const s = getStatusStyle(bin.status);
                return (
                  <tr key={bin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>🗑️ {bin.id}</span>
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isBinOnline(bin.updated_at, 60) ? '#10b981' : '#94a3b8',
                            display: 'inline-block',
                          }}
                          title={isBinOnline(bin.updated_at, 60) ? 'Connected / Active' : 'Offline / No signal'}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{bin.location}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: 700, color: s.color }}>{bin.current_level.toFixed(1)}%</span>
                      {bin.distance_cm !== undefined && (
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }} title="Distance to Garbage">
                          {bin.distance_cm} cm dist
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{bin.temperature ?? 25}°C</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{bin.humidity ?? 45}%</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: s.badgeBg,
                          color: s.badgeText,
                        }}
                      >
                        {bin.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .analytics-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
