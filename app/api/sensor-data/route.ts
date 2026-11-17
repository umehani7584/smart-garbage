import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, calculateBinStatus } from '@/lib/supabase';

// Helper to format bin ID (e.g. 1 -> 'BIN-001' or preserves 'BIN-001')
function normalizeBinId(rawId: string | number): string {
  if (typeof rawId === 'number') {
    return `BIN-${String(rawId).padStart(3, '0')}`;
  }
  const str = String(rawId).trim();
  if (/^\d+$/.test(str)) {
    return `BIN-${str.padStart(3, '0')}`;
  }
  return str;
}

// CORS Headers for ESP32 DEVKIT V1 / IoT Devices
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/sensor-data -> Quick health check and latest sensor readings
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        status: 'online',
        device: 'ESP32 DEVKIT V1',
        message: 'ESP32 API is online. Live database operations available upon Supabase configuration.',
      },
      { headers: corsHeaders }
    );
  }

  try {
    const { data: latestReadings, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, data: latestReadings }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/sensor-data
// Receives live telemetry from ESP32 DEVKIT V1:
// {
//   "bin_id": "BIN-001",
//   "fill_level": 4.9,
//   "distance_cm": 18.0,
//   "temperature": 26.6,
//   "humidity": 55.8,
//   "lid_status": "CLOSED"
// }
export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload. Please send valid application/json.' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const { bin_id, fill_level, garbage_level, current_level, distance_cm, temperature, humidity, lid_status } = body;

    // 1. Validate bin_id
    if (bin_id === undefined || bin_id === null || String(bin_id).trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Missing required field: bin_id' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Validate fill_level (supports fill_level, garbage_level, or current_level aliases)
    const rawLevel = fill_level !== undefined ? fill_level : (garbage_level !== undefined ? garbage_level : current_level);
    if (rawLevel === undefined || rawLevel === null) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: fill_level' },
        { status: 400, headers: corsHeaders }
      );
    }

    const level = parseFloat(String(rawLevel));
    if (isNaN(level) || !isFinite(level) || level < 0 || level > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid fill_level. Must be a numeric value between 0 and 100.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Validate optional distance_cm (HC-SR04 ultrasonic headspace reading in cm)
    let parsedDistance: number | undefined = undefined;
    if (distance_cm !== undefined && distance_cm !== null) {
      const dist = parseFloat(String(distance_cm));
      if (!isNaN(dist) && isFinite(dist) && dist >= 0) {
        parsedDistance = Math.round(dist * 10) / 10;
      }
    }

    // 4. Validate optional temperature (°C)
    let parsedTemp: number | undefined = undefined;
    if (temperature !== undefined && temperature !== null) {
      const temp = parseFloat(String(temperature));
      if (!isNaN(temp) && isFinite(temp)) {
        parsedTemp = Math.round(temp * 10) / 10;
      }
    }

    // 5. Validate optional humidity (%RH)
    let parsedHumidity: number | undefined = undefined;
    if (humidity !== undefined && humidity !== null) {
      const hum = parseFloat(String(humidity));
      if (!isNaN(hum) && isFinite(hum)) {
        parsedHumidity = Math.round(hum * 10) / 10;
      }
    }

    // 6. Validate optional lid_status ("OPEN" | "CLOSED")
    let parsedLidStatus: string = 'CLOSED';
    if (lid_status !== undefined && lid_status !== null) {
      parsedLidStatus = String(lid_status).trim().toUpperCase() === 'OPEN' ? 'OPEN' : 'CLOSED';
    }

    // Gas sensor permanently removed from physical hardware:
    // No validation or requirement for gas telemetry.

    const normalizedId = normalizeBinId(bin_id);
    const status = calculateBinStatus(level);
    const now = new Date().toISOString();

    // Check if Supabase is connected
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: true,
          message: 'Telemetry recorded',
          data: {
            bin_id: normalizedId,
            fill_level: level,
            distance_cm: parsedDistance,
            temperature: parsedTemp,
            humidity: parsedHumidity,
            lid_status: parsedLidStatus,
            status,
            timestamp: now,
          },
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // 1. Insert into sensor_data table (telemetry history)
    const sensorPayload: any = {
      bin_id: normalizedId,
      garbage_level: level,
      timestamp: now,
    };
    if (parsedDistance !== undefined) sensorPayload.distance_cm = parsedDistance;
    if (parsedTemp !== undefined) sensorPayload.temperature = parsedTemp;
    if (parsedHumidity !== undefined) sensorPayload.humidity = parsedHumidity;

    // Defensive insert: include lid_status if column exists, fallback gracefully if not
    const payloadWithLid = { ...sensorPayload, lid_status: parsedLidStatus };
    let { error: sensorError } = await supabase
      .from('sensor_data')
      .insert([payloadWithLid]);

    if (sensorError && (sensorError.message?.includes('lid_status') || sensorError.code === '42703')) {
      const retry = await supabase.from('sensor_data').insert([sensorPayload]);
      sensorError = retry.error;
    }

    if (sensorError) {
      console.error('Error inserting sensor_data:', sensorError);
      // Foreign key fail: if bin record does not exist yet, create it first
      if (sensorError.code === '23503') {
        const initialBin: any = {
          id: normalizedId,
          location: `Sector ${normalizedId}`,
          capacity: 100,
          current_level: level,
          status,
          updated_at: now,
        };
        if (parsedDistance !== undefined) initialBin.distance_cm = parsedDistance;
        if (parsedTemp !== undefined) initialBin.temperature = parsedTemp;
        if (parsedHumidity !== undefined) initialBin.humidity = parsedHumidity;
        await supabase.from('bins').insert([initialBin]);
        await supabase.from('sensor_data').insert([sensorPayload]);
      }
    }

    // 2. Update current_level, distance_cm, temperature, humidity, and status in bins table
    const binUpdatePayload: any = {
      current_level: level,
      status,
      updated_at: now,
    };
    if (parsedDistance !== undefined) binUpdatePayload.distance_cm = parsedDistance;
    if (parsedTemp !== undefined) binUpdatePayload.temperature = parsedTemp;
    if (parsedHumidity !== undefined) binUpdatePayload.humidity = parsedHumidity;

    const binPayloadWithLid = { ...binUpdatePayload, lid_status: parsedLidStatus };
    let { error: binUpdateError } = await supabase
      .from('bins')
      .update(binPayloadWithLid)
      .eq('id', normalizedId);

    if (binUpdateError && (binUpdateError.message?.includes('lid_status') || binUpdateError.code === '42703')) {
      const retry = await supabase.from('bins').update(binUpdatePayload).eq('id', normalizedId);
      binUpdateError = retry.error;
    }

    if (binUpdateError) {
      console.error('Error updating bin status:', binUpdateError);
    }

    // 3. Auto-create alert if fill_level >= 65% (Critical status threshold)
    let alertCreated = null;
    let alertGenerated = false;
    if (level >= 65) {
      const { data: existingAlerts, error: checkAlertError } = await supabase
        .from('alerts')
        .select('*')
        .eq('bin_id', normalizedId)
        .eq('is_resolved', false)
        .limit(1);

      const hasUnresolvedAlert = !checkAlertError && existingAlerts && existingAlerts.length > 0;

      if (!hasUnresolvedAlert) {
        const alertPayload = {
          bin_id: normalizedId,
          message: `CRITICAL ALERT: Bin ${normalizedId} fill level exceeded threshold at ${level.toFixed(1)}%! Immediate collection required.`,
          created_at: now,
          is_resolved: false,
        };

        const { data: newAlert, error: alertError } = await supabase
          .from('alerts')
          .insert([alertPayload])
          .select()
          .maybeSingle();

        if (!alertError) {
          alertCreated = newAlert;
          alertGenerated = true;
        } else {
          console.error('Error creating critical alert:', alertError);
        }
      } else {
        alertCreated = existingAlerts[0];
        alertGenerated = false;
      }
    }

    // 4. Return clean HTTP 200 response
    return NextResponse.json(
      {
        success: true,
        message: 'Telemetry recorded',
        data: {
          bin_id: normalizedId,
          fill_level: level,
          distance_cm: parsedDistance,
          temperature: parsedTemp,
          humidity: parsedHumidity,
          lid_status: parsedLidStatus,
          status,
          updated_at: now,
          alert_generated: alertGenerated,
          alert: alertCreated,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('ESP32 API route exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
