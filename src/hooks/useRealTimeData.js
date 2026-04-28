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

    // Update ONLY sensor values every 4 seconds, NOT bin IDs or assignments
    const interval = setInterval(() => {
      setBinsData(prevData => {
        // Only update sensor readings, preserve everything else
        return simulateRealTimeUpdate(prevData);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return { binsData, loading };
};