import React, { useState, useEffect, useRef } from 'react';
import {
  FiRefreshCw, FiDownload, FiFilter, FiSearch,
  FiBarChart2, FiTrendingUp, FiPieChart, FiAlertCircle
} from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Analytics.css';

function Analytics() {
  const { binsData, loading } = useRealTimeData();
  const [displayBinsData, setDisplayBinsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'fillLevel', dir: 'desc' });
  const displayBinsDataRef = useRef([]);

  useEffect(() => { displayBinsDataRef.current = displayBinsData; }, [displayBinsData]);

  useEffect(() => {
    if (binsData.length > 0) {
      setDisplayBinsData(binsData);
      setFilteredData(binsData);
    }
  }, [binsData]);

  useEffect(() => {
    let result = [...displayBinsData];
    if (searchQuery) {
      result = result.filter(b =>
        b.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.area?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(b => {
        const status = b.fillLevel > 85 ? 'critical' : b.fillLevel > 60 ? 'warning' : 'normal';
        return status === filterStatus;
      });
    }
    if (filterArea !== 'all') {
      result = result.filter(b => b.area === filterArea);
    }
    result.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? 0;
      const bVal = b[sortConfig.key] ?? 0;
      return sortConfig.dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    setFilteredData(result);
  }, [displayBinsData, searchQuery, filterStatus, filterArea, sortConfig]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefresh = () => {
    const current = displayBinsDataRef.current;
    if (!current.length) return;
    setIsRefreshing(true);
    const refreshed = current.map(bin => ({
      ...bin,
      fillLevel:   Math.min(100, Math.max(0,  bin.fillLevel + Math.floor(Math.random() * 41) - 20)),
      temperature: Math.min(60,  Math.max(20, (bin.temperature || 30) + Math.floor(Math.random() * 13) - 6)),
      humidity:    Math.min(100, Math.max(10, (bin.humidity || 50) + Math.floor(Math.random() * 21) - 10)),
      weight:      Math.min(200, Math.max(0,  (bin.weight || 80) + Math.floor(Math.random() * 21) - 10))
    }));
    setDisplayBinsData(refreshed);
    showToast('✅ Data refreshed successfully!', 'success');
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    if (!filteredData.length) { alert('No data to export.'); return; }
    const headers = ['Bin ID', 'Area', 'Fill Level (%)', 'Temperature (°C)', 'Humidity (%)', 'Weight (kg)', 'Status'];
    const rows = filteredData.map(bin => {
      const status = bin.fillLevel > 85 ? 'Critical' : bin.fillLevel > 60 ? 'Warning' : 'Normal';
      return [bin.id, bin.area, bin.fillLevel, bin.temperature, bin.humidity ?? 50, bin.weight ?? 80, status];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📥 Report exported!', 'success');
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getStatus = (fillLevel) => {
    if (fillLevel > 85) return { label: 'Critical', color: '#f44336', bg: '#fde8e8' };
    if (fillLevel > 60) return { label: 'Warning',  color: '#ff9800', bg: '#fff3e0' };
    return                      { label: 'Normal',   color: '#4caf50', bg: '#e8f5e9' };
  };

  const areas = [...new Set(displayBinsData.map(b => b.area))];
  const totalBins   = displayBinsData.length;
  const avgFill     = totalBins ? Math.round(displayBinsData.reduce((s, b) => s + b.fillLevel, 0) / totalBins) : 0;
  const avgTemp     = totalBins ? Math.round(displayBinsData.reduce((s, b) => s + (b.temperature || 0), 0) / totalBins) : 0;
  const avgHumidity = totalBins ? Math.round(displayBinsData.reduce((s, b) => s + (b.humidity || 50), 0) / totalBins) : 0;

  const statusCounts = {
    critical: displayBinsData.filter(b => b.fillLevel > 85).length,
    warning:  displayBinsData.filter(b => b.fillLevel > 60 && b.fillLevel <= 85).length,
    normal:   displayBinsData.filter(b => b.fillLevel <= 60).length,
  };

  const pieData = [
    { name: 'Normal',   value: statusCounts.normal,   color: '#4caf50' },
    { name: 'Warning',  value: statusCounts.warning,  color: '#ff9800' },
    { name: 'Critical', value: statusCounts.critical, color: '#f44336' },
  ];

  const areaData = areas.map(area => {
    const bins = displayBinsData.filter(b => b.area === area);
    return {
      name:        area,
      avgFill:     Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length),
      avgTemp:     Math.round(bins.reduce((s, b) => s + (b.temperature || 0), 0) / bins.length),
      avgHumidity: Math.round(bins.reduce((s, b) => s + (b.humidity || 50), 0) / bins.length),
      count:       bins.length,
    };
  });

  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    fillLevel:   Math.max(20, Math.min(95, avgFill + Math.round(Math.sin(i) * 15))),
    temperature: Math.max(20, Math.min(55, avgTemp  + Math.round(Math.cos(i) * 5))),
  }));

  const radarData = areaData.map(a => ({
    area:        a.name,
    Fill:        a.avgFill,
    Temperature: a.avgTemp,
    Humidity:    a.avgHumidity,
  }));

  if (loading) return <div className="loading-spinner">Loading Analytics...</div>;

  return (
    <div className="analytics-container">

      {/* Header */}
      <div className="analytics-page-header">
        <div className="header-content">
          <div className="project-badge">
            <span className="project-icon">📊</span>
            <span className="project-name">Smart Garbage Monitoring System</span>
          </div>
          <div className="header-info">
            <h1 className="header-title">Analytics & Reports</h1>
            <p className="header-subtitle">In-depth bin analysis, trends & exportable data</p>
          </div>
        </div>
        <div className="header-buttons">
          <button className="analytics-refresh-btn" onClick={handleRefresh} disabled={isRefreshing}>
            <FiRefreshCw style={{ transition: 'transform 1s', transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)' }} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="analytics-export-btn" onClick={handleExport}>
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className={`toast-notification toast-${toast.type}`}>{toast.message}</div>}

      <div className="analytics-scrollable">

        {/* Compact Stats Bar */}
        <div className="stats-bar">
          <div className="stats-bar-item">
            <span className="stats-bar-value">{totalBins}</span>
            <span className="stats-bar-label">Total Bins</span>
          </div>
          <div className="stats-bar-divider" />
          <div className="stats-bar-item">
            <span className="stats-bar-value" style={{ color: '#00b4d8' }}>{avgFill}%</span>
            <span className="stats-bar-label">Avg Fill</span>
          </div>
          <div className="stats-bar-divider" />
          <div className="stats-bar-item">
            <span className="stats-bar-value" style={{ color: '#4caf50' }}>{statusCounts.normal}</span>
            <span className="stats-bar-label">Normal</span>
          </div>
          <div className="stats-bar-divider" />
          <div className="stats-bar-item">
            <span className="stats-bar-value" style={{ color: '#ff9800' }}>{statusCounts.warning}</span>
            <span className="stats-bar-label">Warning</span>
          </div>
          <div className="stats-bar-divider" />
          <div className="stats-bar-item">
            <span className="stats-bar-value" style={{ color: '#f44336' }}>{statusCounts.critical}</span>
            <span className="stats-bar-label">Critical</span>
          </div>
          <div className="stats-bar-divider" />
          <div className="stats-bar-item">
            <span className="stats-bar-value" style={{ color: '#ff9800' }}>{avgTemp}°C</span>
            <span className="stats-bar-label">Avg Temp</span>
          </div>
          <div className="stats-bar-divider" />
          <div className="stats-bar-item">
            <span className="stats-bar-value" style={{ color: '#9c27b0' }}>{avgHumidity}%</span>
            <span className="stats-bar-label">Avg Humidity</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by Bin ID or Area..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <FiFilter style={{ color: '#0077b6' }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="filter-group">
            <select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="filter-select">
              <option value="all">All Areas</option>
              {areas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <span className="filter-result-count">
            Showing <b>{filteredData.length}</b> of {totalBins} bins
          </span>
        </div>

        {/* Detailed Bins Table */}
        <div className="table-card">
          <div className="table-header-row">
            <h3 className="chart-title" style={{ margin: 0 }}>
              <FiAlertCircle style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
              Bin-by-Bin Details
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#999' }}>Click column headers to sort</span>
          </div>
          <div className="table-wrapper">
            <table className="bins-table">
              <thead>
                <tr>
                  <th>Bin ID</th>
                  <th>Area</th>
                  <th className="sortable" onClick={() => handleSort('fillLevel')}>
                    Fill Level {sortConfig.key === 'fillLevel' ? (sortConfig.dir === 'desc' ? '↓' : '↑') : '↕'}
                  </th>
                  <th className="sortable" onClick={() => handleSort('temperature')}>
                    Temp {sortConfig.key === 'temperature' ? (sortConfig.dir === 'desc' ? '↓' : '↑') : '↕'}
                  </th>
                  <th className="sortable" onClick={() => handleSort('humidity')}>
                    Humidity {sortConfig.key === 'humidity' ? (sortConfig.dir === 'desc' ? '↓' : '↑') : '↕'}
                  </th>
                  <th>Status</th>
                  <th>Fill Bar</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(bin => {
                  const s = getStatus(bin.fillLevel);
                  return (
                    <tr key={bin.id} className="table-row">
                      <td className="bin-id-cell">🗑️ {bin.id}</td>
                      <td>{bin.area || '—'}</td>
                      <td><b>{bin.fillLevel}%</b></td>
                      <td>{bin.temperature ?? '—'}°C</td>
                      <td>{bin.humidity ?? 50}%</td>
                      <td>
                        <span className="status-badge" style={{ color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ minWidth: 100 }}>
                        <div className="fill-bar-bg">
                          <div className="fill-bar-fill" style={{ width: `${bin.fillLevel}%`, background: s.color }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                      No bins match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-container">

          {/* Weekly Fill Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Weekly Fill Level Trend</h3>
              <FiTrendingUp className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00b4d8" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: 8 }} />
                <Area type="monotone" dataKey="fillLevel" stroke="#00b4d8" fill="url(#weekGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Donut Pie */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Status Breakdown</h3>
              <FiPieChart className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  outerRadius={90} innerRadius={45}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Area Fill vs Temp Grouped Bar */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Area: Avg Fill vs Temperature</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="avgFill" name="Avg Fill %" fill="#00b4d8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="avgTemp" name="Avg Temp °C" fill="#ff9800" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Area Metrics Radar</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="area" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Fill"        dataKey="Fill"        stroke="#00b4d8" fill="#00b4d8" fillOpacity={0.3} />
                <Radar name="Temperature" dataKey="Temperature" stroke="#ff9800" fill="#ff9800" fillOpacity={0.2} />
                <Radar name="Humidity"    dataKey="Humidity"    stroke="#9c27b0" fill="#9c27b0" fillOpacity={0.2} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Temperature Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Weekly Temperature Trend</h3>
              <FiTrendingUp className="chart-icon" style={{ color: '#ff9800' }} />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" tickFormatter={v => `${v}°C`} />
                <Tooltip formatter={v => `${v}°C`} contentStyle={{ borderRadius: 8 }} />
                <Line type="monotone" dataKey="temperature" stroke="#ff9800" strokeWidth={2.5}
                  dot={{ fill: '#ff9800', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Area Humidity Bar */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Area-wise Avg Humidity</h3>
              <FiBarChart2 className="chart-icon" style={{ color: '#9c27b0' }} />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" tickFormatter={v => `${v}%`} />
                <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="avgHumidity" name="Avg Humidity %" fill="#9c27b0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;