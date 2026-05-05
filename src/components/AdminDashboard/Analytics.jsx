import React, { useState, useEffect, useRef } from 'react';
import { FiTrendingUp, FiBarChart2, FiPieChart, FiRefreshCw } from 'react-icons/fi';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Analytics.css';

function Analytics() {
  const { binsData, loading } = useRealTimeData();
  const [timelineData, setTimelineData] = useState([]);
  const [displayBinsData, setDisplayBinsData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [flashCards, setFlashCards] = useState(false);
  const displayBinsDataRef = useRef([]);

  useEffect(() => {
    displayBinsDataRef.current = displayBinsData;
  }, [displayBinsData]);

  useEffect(() => {
    if (binsData.length > 0) {
      setDisplayBinsData(binsData);
      buildTimeline(binsData);
    }
  }, [binsData]);

  const buildTimeline = (data) => {
    const tl = data.map((bin, idx) => ({
      time: `${9 + idx}:00`,
      bins: bin.fillLevel,
      temp: bin.temperature,
      load: bin.weight
    }));
    setTimelineData(tl);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefresh = () => {
    const current = displayBinsDataRef.current;
    if (current.length === 0) return;

    setIsRefreshing(true);

    const prevCritical = current.filter(b => b.fillLevel > 85).length;
    const prevWarning  = current.filter(b => b.fillLevel > 60 && b.fillLevel <= 85).length;

    const refreshed = current.map(bin => ({
      ...bin,
      fillLevel:   Math.min(100, Math.max(0,  bin.fillLevel + Math.floor(Math.random() * 41) - 20)),
      temperature: Math.min(60,  Math.max(20, (bin.temperature || 30) + Math.floor(Math.random() * 13) - 6)),
      humidity:    bin.humidity !== undefined
        ? Math.min(100, Math.max(10, bin.humidity + Math.floor(Math.random() * 21) - 10))
        : Math.round(40 + Math.random() * 30),
      weight: bin.weight !== undefined
        ? Math.min(200, Math.max(0, bin.weight + Math.floor(Math.random() * 21) - 10))
        : Math.round(50 + Math.random() * 50)
    }));

    const newCritical  = refreshed.filter(b => b.fillLevel > 85).length;
    const newWarning   = refreshed.filter(b => b.fillLevel > 60 && b.fillLevel <= 85).length;
    const newNormal    = refreshed.filter(b => b.fillLevel <= 60).length;
    const totalChanged = refreshed.filter((b, i) => Math.abs(b.fillLevel - current[i].fillLevel) > 5).length;

    setDisplayBinsData(refreshed);
    buildTimeline(refreshed);

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

  const fillLevelData = displayBinsData.map(bin => ({ name: bin.id, value: bin.fillLevel }));

  const statusCounts = {
    critical: displayBinsData.filter(b => b.fillLevel > 85).length,
    warning:  displayBinsData.filter(b => b.fillLevel > 60 && b.fillLevel <= 85).length,
    normal:   displayBinsData.filter(b => b.fillLevel <= 60).length
  };

  const statusData = [
    { name: 'Normal',   value: statusCounts.normal,   color: '#4caf50' },
    { name: 'Warning',  value: statusCounts.warning,  color: '#ff9800' },
    { name: 'Critical', value: statusCounts.critical, color: '#f44336' }
  ];

  const areaData = [];
  const areas = new Set(displayBinsData.map(b => b.area));
  areas.forEach(area => {
    const binsInArea = displayBinsData.filter(b => b.area === area);
    areaData.push({
      name: area,
      avgFill: Math.round(binsInArea.reduce((sum, b) => sum + b.fillLevel, 0) / binsInArea.length),
      count: binsInArea.length
    });
  });

  const avgFillLevel = displayBinsData.length > 0
    ? Math.round(displayBinsData.reduce((sum, b) => sum + b.fillLevel, 0) / displayBinsData.length)
    : 0;

  if (loading) return <div className="loading-spinner">Loading Analytics...</div>;

  return (
    <div className="analytics-container">

      {/* ✅ NEW HEADER */}
      <div className="analytics-page-header">
        <div className="header-content">
          <div className="project-badge">
            <span className="project-icon">🗑️</span>
            <span className="project-name">IoT Smart Garbage Monitoring System</span>
          </div>
          <div className="header-info">
            <h1 className="header-title">Analytics & Reports</h1>
            <p className="header-subtitle">Detailed system performance metrics</p>
          </div>
        </div>
        <button className="analytics-refresh-btn" onClick={handleRefresh} disabled={isRefreshing}>
          <FiRefreshCw style={{ transition: 'transform 1s', transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)' }} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Scrollable content wrapper */}
      <div className="analytics-scrollable">

        {/* Summary Stats Grid */}
        <div className={`summary-grid ${flashCards ? 'cards-flash' : ''}`}>

          <div className="summary-card large-card">
            <div className="large-card-content">
              <div className="large-number">{displayBinsData.length}</div>
              <div className="bin-grid">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="bin-icon">🗑️</span>
                ))}
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon avg-fill"><span>📊</span></div>
            <div className="summary-content">
              <div className="summary-value">{avgFillLevel}%</div>
              <div className="summary-label">Avg Fill Level</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon critical"><span>🔴</span></div>
            <div className="summary-content">
              <div className="summary-value">{statusCounts.critical}</div>
              <div className="summary-label">Critical Bins</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon normal"><span>🟢</span></div>
            <div className="summary-content">
              <div className="summary-value">{statusCounts.normal}</div>
              <div className="summary-label">Normal Status</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon warning"><span>🟡</span></div>
            <div className="summary-content">
              <div className="summary-value">{statusCounts.warning}</div>
              <div className="summary-label">Warning Level</div>
            </div>
          </div>

        </div>

        {/* Charts */}
        <div className="charts-container">

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Fill Level Trend</h3>
              <FiTrendingUp className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="time" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="bins" stroke="#00b4d8" fillOpacity={1} fill="url(#colorFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Status Distribution</h3>
              <FiPieChart className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value">
                  {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Temperature Analysis</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayBinsData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="id" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }} />
                <Bar dataKey="temperature" fill="#ff9800" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Area Performance</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }} />
                <Bar dataKey="avgFill" fill="#4caf50" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Humidity Levels</h3>
              <FiTrendingUp className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={displayBinsData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="id" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="humidity" stroke="#9c27b0" strokeWidth={2} dot={{ fill: '#9c27b0', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Fill Level Distribution</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fillLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#00b4d8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;