import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Bin {
  id: string;
  name?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  current_level: number;
  status: 'Safe' | 'Moderate' | 'Critical';
  distance_cm?: number; // Raw ultrasonic distance from HC-SR04 in cm
  temperature?: number; // DHT11 temperature in °C
  humidity?: number; // DHT11 relative humidity in %
  lid_status?: string; // "OPEN" | "CLOSED"
  gas_level?: number;
  updated_at: string;
}

export interface SensorData {
  id?: number;
  bin_id: string;
  garbage_level: number;
  distance_cm?: number; // Raw ultrasonic distance measurement in cm
  temperature?: number;
  humidity?: number;
  lid_status?: string; // "OPEN" | "CLOSED"
  gas_level?: number;
  timestamp?: string;
}

export interface Alert {
  id?: number;
  bin_id: string;
  message: string;
  created_at: string;
  is_resolved: boolean;
}

// Check if a bin device is online based on confirmed 60-second timeout
export function isBinOnline(
  updatedAt: string,
  timeoutSeconds: number = 60
): boolean {
  const diff = (Date.now() - new Date(updatedAt).getTime()) / 1000;
  return diff >= 0 && diff <= timeoutSeconds;
}

// Compute status based on project specification:
// < 40%: Safe (Emerald Green)
// 40% - 64%: Moderate (Amber Yellow)
// >= 65%: Critical (Crimson Red)
export function calculateBinStatus(level: number): 'Safe' | 'Moderate' | 'Critical' {
  if (level >= 65) return 'Critical';
  if (level >= 40) return 'Moderate';
  return 'Safe';
}

export function getStatusStyle(status: 'Safe' | 'Moderate' | 'Critical' | string) {
  switch (status) {
    case 'Critical':
      return {
        label: 'Critical',
        color: '#ef4444',
        textColor: 'text-red-500',
        bg: 'rgba(239, 68, 68, 0.12)',
        borderColor: '#ef4444',
        glowClass: 'status-pulse-red',
        badgeBg: '#fef2f2',
        badgeText: '#b91c1c'
      };
    case 'Moderate':
      return {
        label: 'Moderate',
        color: '#f59e0b',
        textColor: 'text-amber-500',
        bg: 'rgba(245, 158, 11, 0.12)',
        borderColor: '#f59e0b',
        glowClass: '',
        badgeBg: '#fffbeb',
        badgeText: '#b45309'
      };
    case 'Safe':
    default:
      return {
        label: 'Safe',
        color: '#10b981',
        textColor: 'text-emerald-500',
        bg: 'rgba(16, 185, 129, 0.12)',
        borderColor: '#10b981',
        glowClass: '',
        badgeBg: '#ecfdf5',
        badgeText: '#047857'
      };
  }
}

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('https://')
  );
};

// Safe fallback client to prevent Next.js build or client render crashes
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-url.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key'
);

// Subscribe to Supabase Realtime changes across bins, sensor_data, and alerts
export function subscribeToSmartGarbageRealtime(callbacks: {
  onBinUpdate?: (bin: Bin) => void;
  onSensorReading?: (reading: SensorData) => void;
  onNewAlert?: (alert: Alert) => void;
}) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials not configured. Realtime subscription skipped.');
    return () => {};
  }

  const channel = supabase
    .channel('smart-garbage-realtime-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bins' },
      (payload) => {
        if (callbacks.onBinUpdate && payload.new) {
          callbacks.onBinUpdate(payload.new as Bin);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'sensor_data' },
      (payload) => {
        if (callbacks.onSensorReading && payload.new) {
          callbacks.onSensorReading(payload.new as SensorData);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'alerts' },
      (payload) => {
        if (callbacks.onNewAlert && payload.new) {
          callbacks.onNewAlert(payload.new as Alert);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
