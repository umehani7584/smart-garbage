import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import './Analytics.css';

function Analytics() {
  const { binsData, loading } = useRealTimeData();
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    if (binsData.length > 0) {
      const data = binsData.map((bin, idx) => ({
        time: `${9 + idx}:00`,
        bins: bin.fillLevel,
        temp: bin.temperature,
        load: bin.weight
      }));
      setTimelineData(data);
    }
  }, [binsData]);

  const fillLevelData = binsData.map(bin => ({
    name: bin.id,
    value: bin.fillLevel
  }));

  const statusCounts = {
    critical: binsData.filter(b => b.fillLevel > 85).length,
    warning: binsData.filter(b => b.fillLevel > 60 && b.fillLevel <= 85).length,
    normal: binsData.filter(b => b.fillLevel <= 60).length
  };

  const statusData = [
    { name: 'Normal', value: statusCounts.normal, color: '#4caf50' },
    { name: 'Warning', value: statusCounts.warning, color: '#ff9800' },
    { name: 'Critical', value: statusCounts.critical, color: '#f44336' }
  ];

  const areaData = [];
  const areas = new Set(binsData.map(b => b.area));
  areas.forEach(area => {
    const binsInArea = binsData.filter(b => b.area === area);
    areaData.push({
      name: area,
      avgFill: Math.round(binsInArea.reduce((sum, b) => sum + b.fillLevel, 0) / binsInArea.length),
      count: binsInArea.length
    });
  });

  if (loading) {
    return <div className="loading-spinner">Loading Analytics...</div>;
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Detailed system performance metrics</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon critical">
            <span>🔴</span>
          </div>
          <div className="summary-content">
            <h3>{statusCounts.critical}</h3>
            <p>Critical Bins</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon warning">
            <span>🟡</span>
          </div>
          <div className="summary-content">
            <h3>{statusCounts.warning}</h3>
            <p>Warning Level</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon normal">
            <span>🟢</span>
          </div>
          <div className="summary-content">
            <h3>{statusCounts.normal}</h3>
            <p>Normal Status</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <span>📊</span>
          </div>
          <div className="summary-content">
            <h3>{binsData.length}</h3>
            <p>Total Bins</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-container">
        {/* Fill Level Trend */}
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
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }}
              />
              <Area 
                type="monotone" 
                dataKey="bins" 
                stroke="#00b4d8" 
                fillOpacity={1} 
                fill="url(#colorFill)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Status Distribution</h3>
            <FiPieChart className="chart-icon" />
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

        {/* Temperature Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Temperature Analysis</h3>
            <FiBarChart2 className="chart-icon" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={binsData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
              <XAxis dataKey="id" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }}
              />
              <Bar dataKey="temperature" fill="#ff9800" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Performance */}
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
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }}
              />
              <Bar dataKey="avgFill" fill="#4caf50" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Levels */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Humidity Levels</h3>
            <FiTrendingUp className="chart-icon" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={binsData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" />
              <XAxis dataKey="id" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#9c27b0" 
                strokeWidth={2}
                dot={{ fill: '#9c27b0', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fill Distribution */}
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
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e8ecf1', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#00b4d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;