// Simulates real-time sensor data updates
export const generateDummySensorData = () => {
  const bins = [
    { id: 'BIN-001', area: 'F-7', lat: -34.1805, lon: 151.2059 },
    { id: 'BIN-002', area: 'F-7', lat: -34.1810, lon: 151.2065 },
    { id: 'BIN-003', area: 'F-8', lat: -34.1815, lon: 151.2070 },
    { id: 'BIN-004', area: 'G-10', lat: -34.1820, lon: 151.2075 },
    { id: 'BIN-005', area: 'G-10', lat: -34.1825, lon: 151.2080 },
    { id: 'BIN-006', area: 'F-8', lat: -34.1830, lon: 151.2085 },
    { id: 'BIN-007', area: 'G-11', lat: -34.1835, lon: 151.2090 },
    { id: 'BIN-008', area: 'G-11', lat: -34.1840, lon: 151.2095 },
    { id: 'BIN-009', area: 'F-7', lat: -34.1845, lon: 151.2100 },
    { id: 'BIN-010', area: 'F-8', lat: -34.1850, lon: 151.2105 }
  ];

  return bins.map(bin => ({
    ...bin,
    fillLevel: Math.floor(Math.random() * 100),
    temperature: Math.floor(Math.random() * (45 - 20) + 20),
    gas: Math.floor(Math.random() * 200),
    weight: Math.floor(Math.random() * 50),
    humidity: Math.floor(Math.random() * (80 - 30) + 30),
    lastUpdated: new Date().toLocaleTimeString(),
    timestamp: new Date().getTime()
  }));
};

// Simulate changing data over time
export const simulateRealTimeUpdate = (previousData) => {
  return previousData.map(bin => ({
    ...bin,
    fillLevel: Math.max(0, Math.min(100, bin.fillLevel + (Math.random() - 0.4) * 15)),
    temperature: Math.max(15, Math.min(50, bin.temperature + (Math.random() - 0.5) * 3)),
    gas: Math.max(0, bin.gas + (Math.random() - 0.6) * 30),
    weight: Math.max(0, Math.min(100, bin.weight + (Math.random() - 0.5) * 5)),
    humidity: Math.max(20, Math.min(95, bin.humidity + (Math.random() - 0.5) * 4)),
    lastUpdated: new Date().toLocaleTimeString(),
    timestamp: new Date().getTime()
  }));
};