import React, { useState, useEffect, useRef } from 'react';
import { FiTrash2, FiActivity, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiDownload, FiBarChart2, FiRefreshCw, FiDroplet } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Overview.css';

function Overview() {
  const { binsData, loading } = useRealTimeData();
  const [stats, setStats] = useState({ totalBins: 0, avgFillLevel: 0, criticalBins: 0, normalBins: 0, activeWorkers: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayBinsData, setDisplayBinsData] = useState([]);
  const [toast, setToast] = useState(null);
  const [flashCards, setFlashCards] = useState(false);
  const displayBinsDataRef = useRef([]);

  useEffect(() => {
    displayBinsDataRef.current = displayBinsData;
  }, [displayBinsData]);

  useEffect(() => {
    if (binsData.length > 0) {
      setDisplayBinsData(binsData);
      updateStats(binsData);
    }
  }, [binsData]);

  const updateStats = (dataToUse) => {
    if (dataToUse && dataToUse.length > 0) {
      const critical = dataToUse.filter(b => b.fillLevel > 85).length;
      const normal = dataToUse.filter(b => b.fillLevel <= 85).length;
      const avgFill = Math.round(dataToUse.reduce((sum, b) => sum + b.fillLevel, 0) / dataToUse.length);
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const activeWorkerCount = allUsers.filter(u => u.role === 'user').length;
      setStats({ totalBins: dataToUse.length, avgFillLevel: avgFill, criticalBins: critical, normalBins: normal, activeWorkers: activeWorkerCount });
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCheckStats = () => {
    const current = displayBinsDataRef.current;
    if (current.length === 0) return;

    setIsRefreshing(true);

    const prevCritical = current.filter(b => b.fillLevel > 85).length;
    const prevWarning = current.filter(b => b.fillLevel > 70 && b.fillLevel <= 85).length;

    const refreshed = current.map(bin => ({
      ...bin,
      fillLevel: Math.min(100, Math.max(0, bin.fillLevel + Math.floor(Math.random() * 41) - 20)),
      temperature: Math.min(60, Math.max(20, (bin.temperature || 30) + Math.floor(Math.random() * 13) - 6)),
      humidity: bin.humidity !== undefined
        ? Math.min(100, Math.max(10, bin.humidity + Math.floor(Math.random() * 21) - 10))
        : Math.round(40 + Math.random() * 30)
    }));

    const newCritical = refreshed.filter(b => b.fillLevel > 85).length;
    const newWarning = refreshed.filter(b => b.fillLevel > 70 && b.fillLevel <= 85).length;
    const newNormal = refreshed.filter(b => b.fillLevel <= 70).length;
    const totalChanged = refreshed.filter((b, i) => Math.abs(b.fillLevel - current[i].fillLevel) > 5).length;

    setDisplayBinsData(refreshed);
    updateStats(refreshed);

    setFlashCards(true);
    setTimeout(() => setFlashCards(false), 800);

    let toastMsg = `🔄 ${totalChanged} bins updated — `;
    let toastType = 'info';

    if (newCritical > prevCritical) {
      toastMsg += `⚠️ ${newCritical - prevCritical} became critical!`;
      toastType = 'danger';
    } else if (newCritical < prevCritical) {
      toastMsg += `✅ ${prevCritical - newCritical} recovered from critical.`;
      toastType = 'success';
    } else if (newWarning > prevWarning) {
      toastMsg += `🟡 ${newWarning - prevWarning} moved to warning.`;
      toastType = 'warning';
    } else {
      toastMsg += `Normal: ${newNormal} | Warning: ${newWarning} | Critical: ${newCritical}`;
      toastType = 'info';
    }

    showToast(toastMsg, toastType);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExportReport = () => {
    const current = displayBinsDataRef.current;
    if (current.length === 0) { alert('No data available to export.'); return; }
    const headers = ['Bin ID', 'Fill Level (%)', 'Temperature (°C)', 'Humidity (%)', 'Status', 'Location'];
    const rows = current.map(bin => {
      const status = bin.fillLevel > 85 ? 'Critical' : bin.fillLevel > 70 ? 'Warning' : 'Normal';
      const humidity = bin.humidity !== undefined ? bin.humidity : 50;
      return [bin.id || 'N/A', bin.fillLevel ?? 'N/A', bin.temperature ?? 'N/A', humidity, status, bin.location || bin.area || 'N/A'];
    });
    const avgFill = Math.round(current.reduce((s, b) => s + b.fillLevel, 0) / current.length);
    const critical = current.filter(b => b.fillLevel > 85).length;
    const warning = current.filter(b => b.fillLevel > 70 && b.fillLevel <= 85).length;
    const normal = current.filter(b => b.fillLevel <= 70).length;
    const summaryRows = [[], ['--- SUMMARY ---'], ['Total Bins', current.length], ['Avg Fill Level (%)', avgFill], ['Critical Bins (>85%)', critical], ['Warning Bins (70-85%)', warning], ['Normal Bins (<70%)', normal], ['Report Generated', new Date().toLocaleString()]];
    const csvContent = [headers.join(','), ...rows.map(r => r.join(',')), ...summaryRows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartGarbage_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartData = displayBinsData.map(bin => ({
    name: bin.id,
    fill: bin.fillLevel,
    temp: bin.temperature,
    humidity: bin.humidity !== undefined ? bin.humidity : 50
  }));

  const statusData = [
    { name: 'Normal', value: stats.normalBins, color: '#4caf50' },
    { name: 'Critical', value: stats.criticalBins, color: '#f44336' }
  ];

  const HumidityTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      let status = 'Normal'; let color = '#4caf50';
      if (val > 80) { status = 'Very High'; color = '#f44336'; }
      else if (val > 65) { status = 'High'; color = '#ff9800'; }
      else if (val < 30) { status = 'Low'; color = '#2196f3'; }
      return (
        <div style={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: 8, padding: '0.6rem 1rem' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#023047' }}>{label}</p>
          <p style={{ margin: '0.2rem 0 0', color: '#0077b6' }}>Humidity: <b>{val}%</b></p>
          <p style={{ margin: '0.2rem 0 0', color, fontSize: '0.8rem' }}>Status: {status}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="loading-spinner">Loading Dashboard...</div>;

  return (
    <div className="overview-container">

      {/* Header */}
      
      <div className="overview-page-header">
        <div className="header-content">
          <span className="project-icon">🗑️</span>
          <span className="project-name">IoT Smart Garbage System</span>
          <h1 className="header-title">Dashboard Overview</h1>
          <p className="header-subtitle">Real-time garbage management system monitoring</p>
        </div>
        <div className="header-buttons">
          <button className="check-stats-btn" onClick={handleCheckStats} disabled={isRefreshing}>
            <FiRefreshCw style={{ transition: 'transform 1s', transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)' }} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Stats'}
          </button>
          <button className="export-btn" onClick={handleExportReport}>
            <FiDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="overview-scrollable">

        {/* Stats Grid - Cards with clear names */}
        <div className={`stats-grid-new ${flashCards ? 'cards-flash' : ''}`}>

          {/* Card 1: Total Bins */}
          <div className="stat-card stat-card-total-bins">
            <div className="total-bins-header">
              <div>
                <p className="stat-label stat-label-title">Total Bins</p>
                <h2 className="stat-value-large">{stats.totalBins}</h2>
              </div>
              <FiTrash2 size={40} style={{ color: 'white', opacity: 0.8 }} />
            </div>
            <div className="bin-diagram">
              {[...Array(Math.min(stats.totalBins, 6))].map((_, i) => (
                <div key={i} className="bin-icon" style={{ backgroundColor: i < Math.ceil(stats.totalBins / 3) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)' }}>🗑️</div>
              ))}
            </div>
          </div>

          {/* Card 2: Avg Fill Level */}
          <div className="stat-card stat-card-2">
            <div className="stat-icon"><FiActivity /></div>
            <div className="stat-content">
              <p className="stat-label stat-label-title">Avg Fill Level</p>
              <h3 className="stat-value">{stats.avgFillLevel}%</h3>
            </div>
          </div>

          {/* Card 3: Critical Bins */}
          <div className="stat-card stat-card-3">
            <div className="stat-icon"><FiAlertCircle /></div>
            <div className="stat-content">
              <p className="stat-label stat-label-title">Critical Bins</p>
              <h3 className="stat-value">{stats.criticalBins}</h3>
            </div>
          </div>

          {/* Card 4: Normal Status */}
          <div className="stat-card stat-card-4">
            <div className="stat-icon"><FiCheckCircle /></div>
            <div className="stat-content">
              <p className="stat-label stat-label-title">Normal Status</p>
              <h3 className="stat-value">{stats.normalBins}</h3>
            </div>
          </div>

          {/* Card 5: Active Workers */}
          <div className="stat-card stat-card-5">
            <div className="stat-icon"><FiActivity style={{ color: '#4caf50' }} /></div>
            <div className="stat-content">
              <p className="stat-label stat-label-title">Active Workers</p>
              <h3 className="stat-value">{stats.activeWorkers}</h3>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="charts-grid">

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Fill Level by Bin</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" tick={{ fontSize: 11 }} />
                <YAxis stroke="#999" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1' }} formatter={(value) => `${value}%`} />
                <Bar dataKey="fill" radius={[8, 8, 0, 0]} shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Bin Status Distribution</h3>
              <FiTrendingUp className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value">
                  {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Temperature Monitoring</h3>
              <FiTrendingUp className="chart-icon" style={{ color: '#ff9800' }} />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" tick={{ fontSize: 11 }} />
                <YAxis stroke="#999" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1' }} formatter={(value) => `${value}°C`} />
                <Line type="monotone" dataKey="temp" stroke="#ff9800" strokeWidth={2} dot={{ fill: '#ff9800', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Humidity Level by Bin</h3>
              <FiDroplet className="chart-icon" style={{ color: '#0077b6' }} />
            </div>
            <div className="humidity-legend">
              <span className="hum-badge" style={{ background: '#e3f2fd', color: '#2196f3' }}>🔵 Low &lt;30%</span>
              <span className="hum-badge" style={{ background: '#e8f5e9', color: '#4caf50' }}>🟢 Normal 30–65%</span>
              <span className="hum-badge" style={{ background: '#fff3e0', color: '#ff9800' }}>🟡 High 65–80%</span>
              <span className="hum-badge" style={{ background: '#fde8e8', color: '#f44336' }}>🔴 Very High &gt;80%</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077b6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0077b6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" tick={{ fontSize: 11 }} />
                <YAxis stroke="#999" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                <Tooltip content={<HumidityTooltip />} />
                <Area type="monotone" dataKey="humidity" stroke="#0077b6" strokeWidth={2.5} fill="url(#humidityGrad)"
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const val = payload.humidity;
                    let color = '#4caf50';
                    if (val > 80) color = '#f44336';
                    else if (val > 65) color = '#ff9800';
                    else if (val < 30) color = '#2196f3';
                    return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />;
                  }}
                  activeDot={{ r: 7, fill: '#0077b6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

const CustomBar = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload || payload.fill === undefined) return <rect x={x} y={y} width={width} height={height} fill="#ccc" rx={4} />;
  let barColor = '#4caf50';
  if (payload.fill > 85) barColor = '#f44336';
  else if (payload.fill > 70) barColor = '#ff9800';
  return <rect x={x} y={y} width={width} height={height} fill={barColor} rx={4} ry={4} />;
};

export default Overview;