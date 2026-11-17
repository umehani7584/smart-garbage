'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bin,
  SensorData,
  Alert,
  calculateBinStatus,
  isSupabaseConfigured,
  supabase,
  subscribeToSmartGarbageRealtime,
} from '@/lib/supabase';

// 1 single authentic prototype bin for NUML IoT Lab evaluation
const initialDemoBins: Bin[] = [
  {
    id: 'BIN-001',
    name: 'NUML Prototype Bin (IoT Lab)',
    location: 'CS Department, Ground Floor',
    latitude: 33.7028,
    longitude: 73.0478,
    capacity: 100,
    current_level: 22.0,
    distance_cm: 23.7,
    status: calculateBinStatus(22.0),
    temperature: 24.5,
    humidity: 44,
    lid_status: 'CLOSED',
    updated_at: new Date().toISOString(),
  },
];

const initialDemoAlerts: Alert[] = [];

// Normalize Supabase bins table row to frontend Bin interface
// Maps location_name -> location, capacity_liters -> capacity, passes distance_cm, and preserves all other fields
function normalizeBin(raw: any): Bin {
  const current_level = Number(raw.current_level ?? raw.fill_level ?? 0);
  const status = raw.status ?? calculateBinStatus(current_level);

  return {
    ...raw,
    id: raw.id ?? raw.bin_id ?? 'BIN-001',
    name: raw.name ?? (raw.id === 'BIN-001' ? 'NUML Prototype Bin (IoT Lab)' : `Bin ${raw.id}`),
    location: raw.location ?? raw.location_name ?? (raw.id === 'BIN-001' ? 'CS Department, Ground Floor' : 'Campus Sector'),
    latitude: raw.latitude !== null && raw.latitude !== undefined ? Number(raw.latitude) : (raw.id === 'BIN-001' ? 33.7028 : undefined),
    longitude: raw.longitude !== null && raw.longitude !== undefined ? Number(raw.longitude) : (raw.id === 'BIN-001' ? 73.0478 : undefined),
    capacity: Number(raw.capacity ?? raw.capacity_liters ?? 100),
    current_level,
    distance_cm: raw.distance_cm !== null && raw.distance_cm !== undefined ? Number(raw.distance_cm) : undefined,
    status,
    temperature: raw.temperature !== null && raw.temperature !== undefined ? Number(raw.temperature) : undefined,
    humidity: raw.humidity !== null && raw.humidity !== undefined ? Number(raw.humidity) : undefined,
    lid_status: raw.lid_status ?? 'CLOSED',
    gas_level: raw.gas_level !== null && raw.gas_level !== undefined ? Number(raw.gas_level) : undefined,
    updated_at: raw.updated_at ?? new Date().toISOString(),
  };
}

export function useSmartGarbageData() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);

  const binsRef = useRef<Bin[]>([]);
  binsRef.current = bins;

  // Initialize demo mode based on Supabase config & localStorage (default OFF for live hardware)
  useEffect(() => {
    const configured = isSupabaseConfigured();
    setSupabaseConnected(configured);

    const savedMode = typeof window !== 'undefined' ? localStorage.getItem('smart_garbage_demo_mode') : null;
    if (savedMode !== null) {
      setIsDemoMode(savedMode === 'true');
    } else {
      // Default to OFF so live incoming hardware data is displayed immediately
      setIsDemoMode(false);
    }
  }, []);

  // Save demo mode changes
  const toggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_garbage_demo_mode', String(enabled));
    }
  };

  // Fetch live Supabase data (isSilent prevents loading spinner on 1s polling interval)
  const fetchSupabaseData = useCallback(async (isSilent: boolean = false) => {
    if (!isSupabaseConfigured()) return;
    try {
      if (!isSilent) setLoading(true);
      // Fetch bins
      const { data: binsData, error: binsError } = await supabase
        .from('bins')
        .select('*')
        .order('id', { ascending: true });

      if (binsData && !binsError && binsData.length > 0) {
        const normalized = binsData.map(normalizeBin);
        setBins((prev) => {
          if (prev.length === 0 || !isSilent) return normalized;
          // Silent polling (1s): strictly keep BIN-001 synced with live hardware without resetting fleet simulation
          const liveProto = normalized.find((b) => b.id === 'BIN-001');
          if (!liveProto) return prev;
          return prev.map((b) => (b.id === 'BIN-001' ? liveProto : b));
        });
      } else if (!binsError && (!binsData || binsData.length === 0)) {
        setBins((prev) => (prev.length > 0 ? prev : initialDemoBins));
      }

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (alertsData && !alertsError) {
        setAlerts(alertsData as Alert[]);
      }

      // Fetch recent sensor readings
      const { data: readingsData } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(30);

      if (readingsData) {
        setSensorHistory(readingsData as SensorData[]);
      }

      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Set up data source based on isDemoMode
  useEffect(() => {
    if (isDemoMode) {
      // Load or initialize demo data, preserving BIN-001 if already modified
      setBins((prev) => {
        if (prev.length === 0) return initialDemoBins;
        const currentProto = prev.find((b) => b.id === 'BIN-001');
        if (!currentProto) return initialDemoBins;
        return initialDemoBins.map((b) => (b.id === 'BIN-001' ? currentProto : b));
      });
      setAlerts((prev) => (prev.length === 0 ? initialDemoAlerts : prev));
      setLastSyncTime(new Date().toLocaleTimeString());
      setLoading(false);

      // Simulation timer: simulates random bin updates every 30 seconds
      const simInterval = setInterval(() => {
        simulateRandomUpdate();
      }, 30000);

      return () => clearInterval(simInterval);
    } else {
      // Supabase mode (Simulation Mode is OFF)
      if (isSupabaseConfigured()) {
        fetchSupabaseData(false);

        // Subscribe to Supabase Realtime
        const unsubscribe = subscribeToSmartGarbageRealtime({
          onBinUpdate: (updatedBin) => {
            const normalizedBin = normalizeBin(updatedBin);
            setBins((prev) => {
              const exists = prev.some((b) => b.id === normalizedBin.id);
              if (exists) {
                return prev.map((b) => (b.id === normalizedBin.id ? normalizedBin : b));
              }
              return [...prev, normalizedBin];
            });
            setLastSyncTime(new Date().toLocaleTimeString());
          },
          onSensorReading: (newReading) => {
            setSensorHistory((prev) => [newReading, ...prev.slice(0, 29)]);
          },
          onNewAlert: (newAlert) => {
            setAlerts((prev) => [newAlert, ...prev]);
          },
        });

        // Fast live polling interval: every 1 second (1000ms) to immediately catch incoming "lid_status": "OPEN" from ESP32
        const livePollInterval = setInterval(() => {
          fetchSupabaseData(true);
        }, 1000);

        // Municipal Fleet Simulation: periodically fluctuate simulated nodes (BIN-002 to BIN-010) every 20s
        const fleetSimInterval = setInterval(() => {
          simulateRandomUpdate();
        }, 20000);

        return () => {
          unsubscribe();
          clearInterval(livePollInterval);
          clearInterval(fleetSimInterval);
        };
      } else {
        // Supabase not configured yet; fallback gracefully
        setBins((prev) => {
          if (prev.length === 0) return initialDemoBins;
          const currentProto = prev.find((b) => b.id === 'BIN-001');
          if (!currentProto) return initialDemoBins;
          return initialDemoBins.map((b) => (b.id === 'BIN-001' ? currentProto : b));
        });
        setAlerts((prev) => (prev.length === 0 ? initialDemoAlerts : prev));
        setLoading(false);
      }
    }
  }, [isDemoMode, fetchSupabaseData]);

  // Simulate a live IoT sensor fluctuation (for demo viva presentations)
  const simulateRandomUpdate = () => {
    const current = binsRef.current.length > 0 ? binsRef.current : initialDemoBins;
    // Pick 2-3 random bins to update
    const updated = current.map((bin) => {
      // EXCLUDE BIN-001: Physical Prototype Bin is reserved for manual & hardware telemetry
      if (bin.id === 'BIN-001') {
        return bin;
      }

      const shouldUpdate = Math.random() > 0.4;
      if (!shouldUpdate) return bin;

      const delta = (Math.random() - 0.42) * 12; // slight upward bias
      const newLevel = Math.max(5, Math.min(99, Math.round((bin.current_level + delta) * 10) / 10));
      const newStatus = calculateBinStatus(newLevel);
      const newTemp = Math.max(18, Math.min(48, Math.round(((bin.temperature || 25) + (Math.random() - 0.5) * 2) * 10) / 10));
      const newHum = Math.max(30, Math.min(90, Math.round((bin.humidity || 50) + (Math.random() - 0.5) * 4)));
      const newGas = Math.max(5, Math.min(180, Math.round((bin.gas_level || 20) + (Math.random() - 0.4) * 8)));

      const newDistance = Math.round((27 - (newLevel / 100) * 15) * 10) / 10;

      return {
        ...bin,
        current_level: newLevel,
        distance_cm: newDistance,
        status: newStatus,
        temperature: newTemp,
        humidity: newHum,
        gas_level: newGas,
        updated_at: new Date().toISOString(),
      };
    });

    setBins(updated);
    setLastSyncTime(new Date().toLocaleTimeString());

    // Check if new critical alerts should be created (Critical >= 65%)
    const criticalBins = updated.filter((b) => b.current_level >= 65);
    if (criticalBins.length > 0) {
      const topCritical = criticalBins[Math.floor(Math.random() * criticalBins.length)];
      setAlerts((prev) => {
        const alreadyRecent = prev.slice(0, 3).some((a) => a.bin_id === topCritical.id && !a.is_resolved);
        if (alreadyRecent) return prev;

        return [
          {
            id: Date.now(),
            bin_id: topCritical.id,
            message: `⚠️ CRITICAL FILL LEVEL: Bin ${topCritical.id} at ${topCritical.location} reached ${topCritical.current_level}%! Immediate collection required.`,
            created_at: new Date().toISOString(),
            is_resolved: false,
          },
          ...prev,
        ];
      });
    }
  };

  // Manual Trigger for Presentations / Viva
  const triggerManualSimulationTick = () => {
    simulateRandomUpdate();
  };

  // Collect / Empty Bin action
  const emptyBin = async (binId: string) => {
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        await supabase
          .from('bins')
          .update({
            current_level: 0,
            distance_cm: 27.0,
            status: 'Safe',
            updated_at: new Date().toISOString(),
          })
          .eq('id', binId);
      } catch (e) {
        console.error('Failed to empty bin in Supabase:', e);
      }
    }

    setBins((prev) =>
      prev.map((b) =>
        b.id === binId
          ? {
              ...b,
              current_level: 0,
              distance_cm: 27.0,
              status: 'Safe',
              updated_at: new Date().toISOString(),
            }
          : b
      )
    );

    // Resolve any alerts for this bin
    setAlerts((prev) =>
      prev.map((a) => (a.bin_id === binId ? { ...a, is_resolved: true } : a))
    );
  };

  // Resolve Alert action
  const resolveAlert = async (alertId?: number) => {
    if (!alertId) return;
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        await supabase.from('alerts').update({ is_resolved: true }).eq('id', alertId);
      } catch (e) {
        console.error('Failed to resolve alert in Supabase:', e);
      }
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, is_resolved: true } : a))
    );
  };

  // Expose manual telemetry update for prototype ingestion (BIN-001)
  const updateBinTelemetry = useCallback(
    (
      binId: string,
      telemetry: {
        current_level: number;
        distance_cm: number;
        gas_level?: number;
        temperature: number;
        humidity: number;
        lid_status?: string;
        status: 'Safe' | 'Moderate' | 'Critical' | string;
      }
    ) => {
      const nowIso = new Date().toISOString();
      const validStatus: 'Safe' | 'Moderate' | 'Critical' =
        telemetry.status === 'Critical'
          ? 'Critical'
          : telemetry.status === 'Moderate'
          ? 'Moderate'
          : 'Safe';

      setBins((prev) =>
        prev.map((b) =>
          b.id === binId
            ? {
                ...b,
                current_level: telemetry.current_level,
                distance_cm: telemetry.distance_cm,
                gas_level: telemetry.gas_level ?? b.gas_level,
                temperature: telemetry.temperature,
                humidity: telemetry.humidity,
                lid_status: telemetry.lid_status ?? b.lid_status ?? 'CLOSED',
                status: validStatus,
                updated_at: nowIso,
              }
            : b
        )
      );

      // Handle Critical Alerts (>= 65%)
      if (telemetry.current_level >= 65) {
        setAlerts((prev) => {
          const alreadyRecent = prev.some(
            (a) => a.bin_id === binId && !a.is_resolved
          );
          if (alreadyRecent) return prev;
          return [
            {
              id: Date.now(),
              bin_id: binId,
              message: `⚠️ CRITICAL FILL LEVEL: Bin ${binId} reached ${telemetry.current_level}%! Immediate collection required.`,
              created_at: nowIso,
              is_resolved: false,
            },
            ...prev,
          ];
        });
      } else {
        // Automatically resolve critical alerts for this bin if below 65%
        setAlerts((prev) =>
          prev.map((a) => (a.bin_id === binId ? { ...a, is_resolved: true } : a))
        );
      }

      setLastSyncTime(new Date().toLocaleTimeString());
    },
    []
  );

  const refreshData = useCallback(async () => {
    await fetchSupabaseData(false);
  }, [fetchSupabaseData]);

  return {
    bins,
    alerts,
    sensorHistory,
    loading,
    isDemoMode,
    toggleDemoMode,
    supabaseConnected,
    lastSyncTime,
    refreshData,
    triggerManualSimulationTick,
    emptyBin,
    resolveAlert,
    updateBinTelemetry,
  };
}
