'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiCpu,
  FiRadio,
  FiThermometer,
  FiDroplet,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrash2,
  FiClock,
  FiShield,
  FiRefreshCw,
  FiActivity,
  FiChevronDown,
  FiSettings,
  FiZap,
} from 'react-icons/fi';
import { Bin, isBinOnline } from '@/lib/supabase';

interface PrototypeLabTabProps {
  bins: Bin[];
  onRefresh: () => void;
  onEmptyBin: (binId: string) => void;
  isDemoMode: boolean;
  updateBinTelemetry?: (
    binId: string,
    telemetry: {
      current_level: number;
      distance_cm: number;
      temperature: number;
      humidity: number;
      lid_status?: string;
      status: 'Safe' | 'Moderate' | 'Critical';
    }
  ) => void;
}

export default function PrototypeLabTab({
  bins,
  onRefresh,
  onEmptyBin,
  isDemoMode,
  updateBinTelemetry,
}: PrototypeLabTabProps) {
  // Target physical prototype bin: BIN-001
  const prototypeBin = bins.find((b) => b.id === 'BIN-001') || bins[0] || {
    id: 'BIN-001',
    name: 'NUML Prototype Bin (IoT Lab)',
    location: 'CS Department, Ground Floor',
    latitude: 33.7028,
    longitude: 73.0478,
    capacity: 100,
    current_level: 4.9,
    distance_cm: 18.0,
    status: 'Safe',
    temperature: 26.6,
    humidity: 55.8,
    lid_status: 'CLOSED',
    updated_at: new Date().toISOString(),
  };

  // Smooth 5-second visual hold for Lid State (OPEN 90° animation held for 5000ms)
  const [isLidHeldOpen, setIsLidHeldOpen] = useState(false);
  const [lidCountdown, setLidCountdown] = useState(0);
  const [showTechSpecs, setShowTechSpecs] = useState(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedPacketRef = useRef<string>('');
  const isInitialMountRef = useRef<boolean>(true);

  // Function to smoothly hold lid open for specified duration (default: 5.0 seconds)
  const triggerLidHold = useCallback((durationSeconds: number = 5) => {
    // Clear any active hold timers
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setIsLidHeldOpen(true);
    setLidCountdown(durationSeconds);

    const stepMs = 100;
    countdownIntervalRef.current = setInterval(() => {
      setLidCountdown((prev) => {
        if (prev <= 0.1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, stepMs);

    // After exactly 5000ms, smoothly transition back to CLOSED (0°)
    holdTimerRef.current = setTimeout(() => {
      setIsLidHeldOpen(false);
      setLidCountdown(0);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }, durationSeconds * 1000);
  }, []);

  // Watch for incoming telemetry packets with lid_status === "OPEN"
  const rawLidStatus = (prototypeBin.lid_status || 'CLOSED').toUpperCase();
  const packetKey = `${prototypeBin.updated_at}_${rawLidStatus}`;

  useEffect(() => {
    // Initial mount check
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      const packetAgeMs = Date.now() - new Date(prototypeBin.updated_at).getTime();
      // If packet arrived in last 5 seconds with OPEN, hold for remaining duration
      if (rawLidStatus === 'OPEN' && packetAgeMs < 5000 && packetAgeMs >= 0) {
        const remainingSeconds = Math.max(1, Math.round((5000 - packetAgeMs) / 1000));
        triggerLidHold(remainingSeconds);
      }
      lastProcessedPacketRef.current = packetKey;
      return;
    }

    // Whenever a fresh telemetry packet arrives with lid_status === "OPEN"
    if (packetKey !== lastProcessedPacketRef.current) {
      lastProcessedPacketRef.current = packetKey;
      if (rawLidStatus === 'OPEN') {
        triggerLidHold(5);
      }
    }
  }, [packetKey, rawLidStatus, prototypeBin.updated_at, triggerLidHold]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Manual interactive IR hand detection simulation (triggers same 5s hold)
  const triggerIRHandDetection = () => {
    triggerLidHold(5);
  };

  // Live Telemetry Values directly from hardware node (BIN-001)
  const currentLevel = Math.max(0, Math.min(100, Math.round(prototypeBin.current_level * 10) / 10));
  const currentDist =
    prototypeBin.distance_cm !== undefined && prototypeBin.distance_cm !== null
      ? Math.round(prototypeBin.distance_cm * 10) / 10
      : Math.max(0, Math.round((27.0 - (currentLevel / 100.0) * 15.0) * 10) / 10);
  const currentTemp =
    prototypeBin.temperature !== undefined && prototypeBin.temperature !== null
      ? Math.round(prototypeBin.temperature * 10) / 10
      : 26.6;
  const currentHumidity =
    prototypeBin.humidity !== undefined && prototypeBin.humidity !== null
      ? Math.round(prototypeBin.humidity * 10) / 10
      : 55.8;

  // Visual lid state: held open for 5 seconds when triggered, then smoothly closes back
  const isLidActive = isLidHeldOpen;
  const effectiveLidStatus = isLidActive ? 'OPEN' : 'CLOSED';

  // Confirmed Threshold Classification:
  // Green ("SAFE / NORMAL") when fill < 40%
  // Yellow ("MODERATE") when fill is between 40% and 64%
  // Red ("CRITICAL / OVERFLOW") when fill >= 65%
  const isCritical = currentLevel >= 65;
  const isModerate = currentLevel >= 40 && currentLevel < 65;
  const isSafe = currentLevel < 40;

  const statusLabel = isCritical
    ? 'CRITICAL / OVERFLOW'
    : isModerate
    ? 'MODERATE'
    : 'SAFE / NORMAL';

  const themeColor = isCritical ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
  const themeBgLight = isCritical ? '#fef2f2' : isModerate ? '#fffbeb' : '#ecfdf5';
  const themeBorder = isCritical ? '#fecaca' : isModerate ? '#fde68a' : '#a7f3d0';

  const isOnline = isBinOnline(prototypeBin.updated_at, 60);

  // Manual reset to 0% handler
  const handleEmptyBin = () => {
    if (updateBinTelemetry) {
      updateBinTelemetry(prototypeBin.id, {
        current_level: 0,
        distance_cm: 27.0,
        temperature: currentTemp,
        humidity: currentHumidity,
        lid_status: 'CLOSED',
        status: 'Safe',
      });
    }
    onEmptyBin(prototypeBin.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <FiCpu size={12} /> Hardware Lab
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: isOnline ? '#065f46' : '#334155',
                color: isOnline ? '#a7f3d0' : '#94a3b8',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isOnline ? '#10b981' : '#94a3b8',
                }}
              />
              {isOnline ? 'ESP32 DEVKIT V1 (Live)' : 'ESP32 DEVKIT V1 (Standby)'}
            </span>
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Physical Prototype ({prototypeBin.id}) — Live Telemetry
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '0.35rem', margin: 0 }}>
            Active physical ESP32 DEVKIT V1 node streaming live ultrasonic fill, headspace, DHT11 climate, and touchless servo lid telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.5rem 0.9rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Last Hardware Sync</div>
            <div style={{ fontWeight: 700, color: '#38bdf8' }}>
              {new Date(prototypeBin.updated_at).toLocaleTimeString()}
            </div>
          </div>

          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid #334155',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <FiRefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleEmptyBin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.1rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            <FiTrash2 size={14} />
            <span>Mark Empty (0%)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Dashboard Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 480px) 1fr',
          gap: '1.75rem',
          alignItems: 'start',
        }}
        className="prototype-lab-grid"
      >
        {/* ============================================================== */}
        {/* COLUMN 1: VERTICAL CYLINDRICAL BIN VISUALIZER (CLEAN & CENTRAL) */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Visualizer Card Header */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '0.85rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Vertical Bin Visualizer
                </h2>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Calibrated for {prototypeBin.id} (15cm Usable Depth | 12cm Full ↔ 27cm Empty)
                </span>
              </div>

              {/* Touchless IR Hand Detection Simulator Button */}
              <button
                onClick={triggerIRHandDetection}
                disabled={isLidActive}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: isLidActive ? '#e0f2fe' : '#0284c7',
                  color: isLidActive ? '#0284c7' : '#ffffff',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: isLidActive ? 'not-allowed' : 'pointer',
                  boxShadow: isLidActive ? 'none' : '0 2px 6px rgba(2, 132, 199, 0.25)',
                  transition: 'all 0.2s',
                }}
                title="Simulate approaching hand to trigger IR sensor on GPIO 10"
              >
                <span>✋</span>
                <span>{isLidActive ? `Lid Open (${lidCountdown}s)` : 'Simulate IR Hand'}</span>
              </button>
            </div>

            {/* Ultrasonic Safety Interlock Banner */}
            {isLidActive && (
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: '#1d4ed8',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  animation: 'fadeIn 0.3s ease-in',
                }}
              >
                <FiRadio size={14} className="spin-slow" />
                <span>
                  Lid Open: Ultrasonic sampling FROZEN to prevent false hand/lid reflections.
                </span>
              </div>
            )}

            {/* Central Graphic Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2.5rem',
                padding: '1.25rem 0',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              {/* Vertical Physical Bin Graphic */}
              <div
                style={{
                  position: 'relative',
                  width: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Servo Lid Graphic */}
                <div
                  style={{
                    position: 'relative',
                    width: '210px',
                    height: '34px',
                    backgroundColor: '#334155',
                    borderRadius: '10px 10px 3px 3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    transformOrigin: 'left center',
                    transform: isLidActive ? 'rotate(-65deg) translateY(-10px)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
                    zIndex: 2,
                  }}
                >
                  <span>{isLidActive ? 'LID OPEN (90°)' : 'SERVO LID (0° CLOSED)'}</span>
                </div>

                {/* Ultrasonic Sensor Pod on Lid */}
                <div
                  style={{
                    width: '76px',
                    height: '18px',
                    backgroundColor: '#1e293b',
                    borderRadius: '0 0 8px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    padding: '2px',
                    border: '1px solid #475569',
                    borderTop: 'none',
                    zIndex: 3,
                  }}
                  title="HC-SR04 Transducer (GPIO 4 TRIG / GPIO 3 ECHO)"
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                </div>

                {/* Bin Outer Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '200px',
                    height: '360px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0 0 20px 20px',
                    border: '4px solid #64748b',
                    borderTop: 'none',
                    overflow: 'hidden',
                    marginTop: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Dynamic Headspace Acoustic Beam Visualization */}
                  {!isLidActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: `${Math.max(10, 100 - currentLevel)}%`,
                        background:
                          'linear-gradient(180deg, rgba(56, 189, 248, 0.28) 0%, rgba(56, 189, 248, 0.04) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: '#0284c7',
                          backgroundColor: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                        }}
                      >
                        {currentDist.toFixed(1)} cm
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                        ↓ Headspace
                      </div>
                    </div>
                  )}

                  {/* Liquid / Garbage Fill Fluid */}
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.min(100, Math.max(3, currentLevel))}%`,
                      backgroundColor: themeColor,
                      transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                      position: 'relative',
                    }}
                    className={isCritical ? 'status-pulse-red' : ''}
                  >
                    {/* Top fluid meniscus ripple */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      }}
                    />
                    <span style={{ fontSize: '1.9rem', fontWeight: 900, lineHeight: 1 }}>
                      {currentLevel.toFixed(1)}%
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        marginTop: '4px',
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Base Pedestal */}
                <div
                  style={{
                    width: '220px',
                    height: '12px',
                    backgroundColor: '#475569',
                    borderRadius: '6px',
                    marginTop: '3px',
                  }}
                />
              </div>

              {/* Dynamic Measurement Readouts Beside Bin */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: '180px' }}>
                <div
                  style={{
                    backgroundColor: themeBgLight,
                    border: `1px solid ${themeBorder}`,
                    padding: '1rem',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Fill Percentage
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: themeColor, lineHeight: 1.2 }}>
                    {currentLevel.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: themeColor, fontWeight: 800, marginTop: '2px' }}>
                    {statusLabel}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Headspace Distance
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                    {currentDist.toFixed(1)} cm
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {currentDist >= 27 ? 'Empty (≥27cm)' : currentDist <= 12 ? 'Full (≤12cm)' : 'Depth: 15cm scale'}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Servo Lid State
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isLidActive ? '#0284c7' : '#059669', lineHeight: 1.2 }}>
                    {isLidActive ? 'OPEN (90°)' : 'CLOSED (0°)'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {isLidActive ? `Closing in ${lidCountdown}s` : 'Touchless IR Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hardware Actuator Live Indicators Card */}
          <div
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '1.35rem 1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Hardware Actuators & Signal LEDs
              </span>
              <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                ESP32 GPIO Outputs
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', alignItems: 'center' }}>
              {/* Green LED */}
              <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '0.75rem 0.5rem', borderRadius: '10px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isSafe ? '#10b981' : '#334155',
                    boxShadow: isSafe ? '0 0 14px #10b981' : 'none',
                    margin: '0 auto 0.4rem auto',
                  }}
                />
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isSafe ? '#a7f3d0' : '#64748b' }}>Green LED</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>GPIO 6 (&lt;40%)</div>
              </div>

              {/* Yellow LED */}
              <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '0.75rem 0.5rem', borderRadius: '10px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isModerate ? '#f59e0b' : '#334155',
                    boxShadow: isModerate ? '0 0 14px #f59e0b' : 'none',
                    margin: '0 auto 0.4rem auto',
                  }}
                />
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isModerate ? '#fde68a' : '#64748b' }}>Yellow LED</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>GPIO 5 (40-64%)</div>
              </div>

              {/* Red Alert LED */}
              <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '0.75rem 0.5rem', borderRadius: '10px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isCritical ? '#ef4444' : '#334155',
                    boxShadow: isCritical ? '0 0 14px #ef4444' : 'none',
                    margin: '0 auto 0.4rem auto',
                  }}
                  className={isCritical ? 'status-badge-pulse' : ''}
                />
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isCritical ? '#fecaca' : '#64748b' }}>Red LED</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>GPIO 2 (≥65%)</div>
              </div>

              {/* Buzzer */}
              <div style={{ textAlign: 'center', backgroundColor: '#1e293b', padding: '0.75rem 0.5rem', borderRadius: '10px' }}>
                <div
                  style={{
                    fontSize: '1.2rem',
                    lineHeight: 1,
                    margin: '0 auto 0.4rem auto',
                    filter: isCritical ? 'none' : 'grayscale(100%) opacity(0.4)',
                  }}
                >
                  🔔
                </div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isCritical ? '#ef4444' : '#94a3b8' }}>
                  {isCritical ? 'ALARM ON' : 'SILENT'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>GPIO 9 (Buzzer)</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: CLEAN DEDICATED LIVE TELEMETRY CARDS (NO SIMULATOR)  */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card A: DHT11 Live Telemetry */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  DHT11 Live Telemetry
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Ambient thermal & relative humidity sensor (Single-Bus GPIO 8)
                </p>
              </div>
              <div style={{ padding: '8px', borderRadius: '10px', background: '#fff7ed', color: '#f97316' }}>
                <FiThermometer size={22} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Temperature Reading */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Temperature
                    </span>
                    <FiThermometer style={{ color: '#f97316' }} size={18} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                    {currentTemp.toFixed(1)}
                    <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 700, marginLeft: '3px' }}>°C</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.4rem' }}>
                    Calibrated Range: 0°C – 50°C (±2°C)
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: currentTemp > 38 ? '#b91c1c' : '#0369a1',
                    backgroundColor: currentTemp > 38 ? '#fee2e2' : '#e0f2fe',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginTop: '0.75rem',
                  }}
                >
                  {currentTemp > 38 ? '⚠️ High Fermentation Heat' : 'Thermal Level Normal'}
                </div>
              </div>

              {/* Relative Humidity Reading */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Relative Humidity
                    </span>
                    <FiDroplet style={{ color: '#0284c7' }} size={18} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                    {currentHumidity.toFixed(1)}
                    <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 700, marginLeft: '3px' }}>%RH</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.4rem' }}>
                    Moisture Range: 20% – 90% RH
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: currentHumidity > 75 ? '#b45309' : '#047857',
                    backgroundColor: currentHumidity > 75 ? '#fef3c7' : '#d1fae5',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginTop: '0.75rem',
                  }}
                >
                  {currentHumidity > 75 ? 'Damp / Wet Waste' : 'Optimal Moisture'}
                </div>
              </div>
            </div>
          </div>

          {/* Card B: HC-SR04 Ultrasonic Telemetry */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  HC-SR04 Ultrasonic Telemetry
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Acoustic time-of-flight headspace measurement (GPIO 4 TRIG / GPIO 3 ECHO)
                </p>
              </div>
              <div style={{ padding: '8px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7' }}>
                <FiActivity size={22} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Fill Level */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Garbage Fill Level
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: themeColor, lineHeight: 1.1 }}>
                  {currentLevel.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: themeColor, marginTop: '0.35rem' }}>
                  Status: {statusLabel}
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    margin: '0.75rem 0 0.35rem 0',
                  }}
                >
                  <div
                    style={{
                      width: `${currentLevel}%`,
                      height: '100%',
                      backgroundColor: themeColor,
                      borderRadius: '999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Headspace Distance */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Headspace Distance
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                  {currentDist.toFixed(1)}
                  <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 700, marginLeft: '3px' }}>cm</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Sensor to Waste Surface
                </div>

                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    backgroundColor: '#f0f9ff',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #bae6fd',
                    marginTop: '0.75rem',
                  }}
                >
                  Usable: 12cm (Full) ↔ 27cm (Empty)
                </div>
              </div>
            </div>
          </div>

          {/* Card C: Lid & IR Dynamics */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Lid & Touchless IR Dynamics
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  SG90 Micro-Servo PWM Lid (GPIO 7) & Touchless IR Sensor (GPIO 10)
                </p>
              </div>
              <div style={{ padding: '8px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981' }}>
                <FiZap size={22} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Servo Position */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Lid Physical State
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 900, color: isLidActive ? '#0284c7' : '#059669', lineHeight: 1.1 }}>
                  {isLidActive ? 'OPEN 90°' : 'CLOSED 0°'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                  {isLidActive ? `Auto-closing in ${lidCountdown}s` : 'Touchless Auto-Lid Enabled'}
                </div>
              </div>

              {/* IR Sensor Status */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  IR Obstacle Detection
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isLidActive ? '#1d4ed8' : '#0f172a', lineHeight: 1.2 }}>
                  {isLidActive ? 'Obstacle Detected' : 'No Obstacle (Scanning)'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
                  {isLidActive ? 'Safety Ultrasonic Freeze ACTIVE' : 'Ultrasonic Sampling ACTIVE'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discreet Collapsible Technical Specifications & Pinout (Optional for Engineers) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <button
          onClick={() => setShowTechSpecs((prev) => !prev)}
          style={{
            width: '100%',
            padding: '0.85rem 1.25rem',
            backgroundColor: showTechSpecs ? '#f8fafc' : '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#475569',
            transition: 'background-color 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <FiSettings size={15} style={{ color: '#0284c7' }} />
            <span>⚙️ Technical Specifications & Pinout (ESP32 DEVKIT V1)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.75rem' }}>
            <span>{showTechSpecs ? 'Collapse Specs' : 'Expand Specs'}</span>
            <FiChevronDown
              size={16}
              style={{
                transform: showTechSpecs ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </div>
        </button>

        {showTechSpecs && (
          <div
            style={{
              padding: '1.25rem',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              fontSize: '0.75rem',
              color: '#334155',
              animation: 'fadeIn 0.2s ease-in',
            }}
          >
            {/* Spec Section 1: GPIO Pinout */}
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiShield style={{ color: '#0284c7' }} size={14} />
                <span>Confirmed ESP32 DEVKIT V1 Pinout</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6', color: '#64748b' }}>
                <li><b>HC-SR04:</b> GPIO 4 (TRIG), GPIO 3 (ECHO)</li>
                <li><b>SG90 Servo:</b> GPIO 7 (PWM Lid Control)</li>
                <li><b>IR Sensor:</b> GPIO 10 (Touchless Obstacle)</li>
                <li><b>DHT11:</b> GPIO 8 (Single-Bus Temp/Humidity)</li>
                <li><b>Active Buzzer:</b> GPIO 9 (Digital High Alert)</li>
                <li><b>Status LEDs:</b> GPIO 6 (Green), 5 (Yellow), 2 (Red)</li>
                <li><b>Power Rails:</b> 5V/VIN for Servo & Sensors, Common GND</li>
              </ul>
            </div>

            {/* Spec Section 2: Calibration & Mathematics */}
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiZap style={{ color: '#10b981' }} size={14} />
                <span>BIN-001 Calibration Formula</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6', color: '#64748b' }}>
                <li><b>Empty Depth (D_empty):</b> 27.0 cm</li>
                <li><b>Full Depth (D_full):</b> 12.0 cm</li>
                <li><b>Usable Bin Depth:</b> 15.0 cm (100% capacity)</li>
                <li><b>Fill % Formula:</b> <code>((27.0 - distance) / 15.0) * 100</code></li>
                <li><b>Classification:</b> &lt;40% Safe, 40–64% Moderate, &ge;65% Critical</li>
                <li><b>Interlock:</b> Sampling frozen when lid is open</li>
              </ul>
            </div>

            {/* Spec Section 3: Ingestion Protocol */}
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FiRadio style={{ color: '#f59e0b' }} size={14} />
                <span>Telemetry Ingestion Specs</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.6', color: '#64748b' }}>
                <li><b>Endpoint:</b> <code>POST /api/sensor-data</code></li>
                <li><b>Protocol:</b> HTTP 1.1 / JSON Payload</li>
                <li><b>Payload:</b> <code>bin_id, fill_level, distance_cm, temperature, humidity, lid_status</code></li>
                <li><b>Response:</b> <code>&#123; success: true, message: "Telemetry recorded" &#125;</code></li>
                <li><b>Database:</b> Dual-write to <code>bins</code> and <code>sensor_data</code></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
