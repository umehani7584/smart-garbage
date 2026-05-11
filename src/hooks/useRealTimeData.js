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

    // CHANGE 3: Auto-refresh every 60 seconds 
    const interval = setInterval(() => {
      setBinsData(prevData => {
        return simulateRealTimeUpdate(prevData);
      });
    }, 60000); // 60 seconds = 60000 milliseconds

    return () => clearInterval(interval);
  }, []);

  return { binsData, loading };
};