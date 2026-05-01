import React, { useState, useEffect } from 'react';
import { FiTrash2, FiActivity, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiDownload, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { simulateRealTimeUpdate } from '../../utils/dataSimulator';
import './Overview.css';

function Overview() {
  const { binsData, loading } = useRealTimeData();
  const [stats, setStats] = useState({
    totalBins: 0,
    avgFillLevel: 0,
    criticalBins: 0,
    normalBins: 0,
    activeWorkers: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayBinsData, setDisplayBinsData] = useState([]);

  // Update displayBinsData when binsData changes
  useEffect(() => {
    if (binsData.length > 0) {
      setDisplayBinsData(binsData);
      updateStats(binsData);
    }
  }, [binsData]);

  // Helper function to update stats
  const updateStats = (dataToUse) => {
    if (dataToUse && dataToUse.length > 0) {
      const critical = dataToUse.filter(b => b.fillLevel > 85).length;
      const normal = dataToUse.filter(b => b.fillLevel <= 85).length;
      const avgFill = Math.round(dataToUse.reduce((sum, b) => sum + b.fillLevel, 0) / dataToUse.length);
      
      // Get active workers count
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const activeWorkerCount = allUsers.filter(u => u.role === 'user').length;

      const newStats = {
        totalBins: dataToUse.length,
        avgFillLevel: avgFill,
        criticalBins: critical,
        normalBins: normal,
        activeWorkers: activeWorkerCount
      };

      console.log('Stats Updated:', newStats);
      setStats(newStats);
    }
  };

  // CHANGE 2: Check Stats Button Handler - FIXED
  const handleCheckStats = () => {
    console.log('Check Stats clicked');
    setIsRefreshing(true);
    
    // Simulate real-time update manually
    if (displayBinsData.length > 0) {
      const updatedData = simulateRealTimeUpdate(displayBinsData);
      console.log('Bins data updated:', updatedData);
      setDisplayBinsData(updatedData);
      updateStats(updatedData);
    }

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const chartData = displayBinsData.map(bin => ({
    name: bin.id,
    fill: bin.fillLevel,
    temp: bin.temperature
  }));

  const statusData = [
    { name: 'Normal', value: stats.normalBins, color: '#4caf50' },
    { name: 'Critical', value: stats.criticalBins, color: '#f44336' }
  ];

  const COLORS = ['#4caf50', '#f44336'];

  if (loading) {
    return <div className="loading-spinner">Loading Dashboard...</div>;
  }

  return (
    <div className="overview-container">
      {/* Header - FIXED */}
      <div className="overview-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time garbage management system</p>
        </div>
        <div className="header-buttons">
          {/* CHANGE 2: Check Stats Button */}
          <button 
            className="check-stats-btn"
            onClick={handleCheckStats}
            disabled={isRefreshing}
          >
            <FiRefreshCw style={{ rotate: isRefreshing ? '360deg' : '0deg', transition: 'rotate 1s' }} />
            Refresh Stats
          </button>
          <button className="export-btn">
            <FiDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overview-scrollable">
        {/* CHANGE 5, 6: New Stats Grid Layout - 3 columns, 2 rows */}
        <div className="stats-grid-new">
          
          {/* Total Bins Box - Spans 2 rows, 1 column (left side) */}
          <div className="stat-card stat-card-total-bins">
            <div className="total-bins-header">
              <div>
                <p className="stat-label">Total Bins</p>
                {/* CHANGE 7: Increased font size for stat value */}
                <h2 className="stat-value-large">{stats.totalBins}</h2>
              </div>
              <FiTrash2 size={40} style={{ color: 'white', opacity: 0.8 }} />
            </div>
            
            {/* Bin Diagram */}
            <div className="bin-diagram">
              {[...Array(Math.min(stats.totalBins, 6))].map((_, i) => (
                <div 
                  key={i} 
                  className="bin-icon"
                  style={{
                    backgroundColor: i < Math.ceil(stats.totalBins / 3) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  🗑️
                </div>
              ))}
            </div>
          </div>

          {/* Avg Fill Level */}
          <div className="stat-card stat-card-2">
            <div className="stat-icon">
              <FiActivity />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.avgFillLevel}%</h3>
              <p className="stat-label">Avg Fill Level</p>
            </div>
          </div>

          {/* Critical Bins */}
          <div className="stat-card stat-card-3">
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.criticalBins}</h3>
              <p className="stat-label">Critical Bins</p>
            </div>
          </div>

          {/* Normal Status */}
          <div className="stat-card stat-card-4">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.normalBins}</h3>
              <p className="stat-label">Normal Status</p>
            </div>
          </div>

          {/* CHANGE 4: Active Workers Box */}
          <div className="stat-card stat-card-5">
            <div className="stat-icon">
              <FiActivity style={{ color: '#4caf50' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.activeWorkers}</h3>
              <p className="stat-label">Active Workers</p>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Fill Level Bar Chart - CHANGE 1: Color coding applied */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Fill Level by Bin</h3>
              <FiBarChart2 className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #e8ecf1' }}
                  formatter={(value) => `${value}%`}
                />
                {/* CHANGE 1: Use custom shape for color-coded bars */}
                <Bar 
                  dataKey="fill" 
                  radius={[8, 8, 0, 0]}
                  shape={<CustomBar />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Bin Status Distribution</h3>
              <FiTrendingUp className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Temperature Monitoring</h3>
              <FiTrendingUp className="chart-icon" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
                <XAxis dataKey="name" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #e8ecf1' }}
                  formatter={(value) => `${value}°C`}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#ff9800" 
                  strokeWidth={2}
                  dot={{ fill: '#ff9800', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// CHANGE 1: Custom Bar Component for Color Coding
const CustomBar = (props) => {
  const { fill, x, y, width, height, payload } = props;
  
  if (!payload || payload.fill === undefined) {
    return <rect x={x} y={y} width={width} height={height} fill="#ccc" rx={4} />;
  }

  let barColor = '#4caf50'; // Normal - Green
  
  if (payload.fill > 85) {
    barColor = '#f44336'; // Critical - Red
  } else if (payload.fill > 70) {
    barColor = '#ff9800'; // Warning - Yellow
  }

  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={barColor}
      rx={4}
      ry={4}
    />
  );
};

export default Overview;