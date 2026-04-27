import { useState, useEffect } from 'react';
import { generateDummySensorData, simulateRealTimeUpdate } from '../utils/dataSimulator';

export const useRealTimeData = () => {
  const [binsData, setBinsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const initialData = generateDummySensorData();
    setBinsData(initialData);
    setLoading(false);

    // Simulate real-time updates every 4 seconds
    const interval = setInterval(() => {
      setBinsData(prevData => simulateRealTimeUpdate(prevData));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return { binsData, loading };
};