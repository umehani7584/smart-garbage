import React, { useState, useEffect } from 'react';
import { FiTrash2, FiActivity, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiDownload, FiBarChart2 } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Overview.css';
function Overview() {
  const { binsData, loading } = useRealTimeData();
  const [stats, setStats] = useState({
    totalBins: 0,
    avgFillLevel: 0,
    criticalBins: 0,
    normalBins: 0
  });

  useEffect(() => {
    if (binsData.length > 0) {
      const critical = binsData.filter(b => b.fillLevel > 85).length;
      const normal = binsData.filter(b => b.fillLevel <= 85).length;
      const avgFill = Math.round(binsData.reduce((sum, b) => sum + b.fillLevel, 0) / binsData.length);

      setStats({
        totalBins: binsData.length,
        avgFillLevel: avgFill,
        criticalBins: critical,
        normalBins: normal
      });
    }
  }, [binsData]);

  const chartData = binsData.map(bin => ({
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
      {/* Header */}
      <div className="overview-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time garbage management system</p>
        </div>
        <button className="export-btn">
          <FiDownload /> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-1">
          <div className="stat-icon">
            <FiTrash2 />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalBins}</h3>
            <p className="stat-label">Total Bins</p>
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.avgFillLevel}%</h3>
            <p className="stat-label">Avg Fill Level</p>
          </div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.criticalBins}</h3>
            <p className="stat-label">Critical Bins</p>
          </div>
        </div>

        <div className="stat-card stat-card-4">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.normalBins}</h3>
            <p className="stat-label">Normal Status</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Fill Level Bar Chart */}
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
              />
              <Bar dataKey="fill" fill="#00b4d8" radius={[8, 8, 0, 0]} />
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
  );
}

export default Overview;