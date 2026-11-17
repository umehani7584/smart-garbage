/* ============================================================================
 * IoT Smart Garbage Monitoring System - ESP32-S3 Physical Firmware
 * ============================================================================
 * Target Microcontroller : ESP32-S3 N16RB (16MB Flash, 8MB Octal PSRAM)
 * Target Prototype Node  : BIN-001 (Pedal Smart Dustbin Prototype)
 * Ingestion Endpoint     : POST /api/sensor-data -> Supabase Realtime Database
 *
 * ----------------------------------------------------------------------------
 * CONFIRMED HARDWARE GPIO PIN MATRIX (Source of Truth):
 * ----------------------------------------------------------------------------
 * Component            Pin          Direction      Notes
 * -------------------  -----------  -------------  ---------------------------
 * HC-SR04 TRIG         GPIO 4       OUTPUT         10µs ultrasonic trigger ping
 * HC-SR04 ECHO         GPIO 3       INPUT          Via 5V-to-3.3V divider
 * Servo Signal         GPIO 7       OUTPUT (PWM)   Lid actuator (SG90 / MG90S)
 * IR Sensor OUT        GPIO 10      INPUT          Touchless hand detection
 * DHT11 DATA           GPIO 8       INPUT/PULLUP   Ambient Temp & Humidity
 * MQ-135 Analog (AO)   GPIO 1       ANALOG (ADC1)  Gas Level Index (0 - 100)
 * Buzzer (+)           GPIO 9       OUTPUT         Non-blocking Critical alert
 * Green LED            GPIO 6       OUTPUT         Safe status (< 30%)
 * Yellow LED           GPIO 5       OUTPUT         Moderate status (30% - 80%)
 * Red LED              GPIO 2       OUTPUT         Critical status (> 80%)
 * Power & GND Rails    Common GND   -              All grounds interconnected
 * ----------------------------------------------------------------------------
 *
 * PROTOTYPE CALIBRATION PARAMETERS (BIN-001):
 * - Empty bin distance (sensor to bottom): D_empty = 27.0 cm (0% fill)
 * - Full bin distance (sensor to max fill): D_full = 12.0 cm (100% fill)
 * - Total fill depth: 27.0 cm - 12.0 cm = 15.0 cm garbage height = 100% fill
 * - Formula: ((27.0 - distance_cm) / (27.0 - 12.0)) * 100.0, clamped [0.0, 100.0]
 *
 * REQUIRED ARDUINO LIBRARIES:
 * 1. WiFi.h              (Built into ESP32 Arduino Core)
 * 2. HTTPClient.h        (Built into ESP32 Arduino Core)
 * 3. ArduinoJson.h       (Install "ArduinoJson" by Benoit Blanchon - v6 or v7)
 * 4. ESP32Servo.h        (Install "ESP32Servo" by Kevin Harrington - v1.1.0+)
 * 5. DHT.h               (Install "DHT sensor library" by Adafruit - v1.4.4+)
 * 6. Adafruit_Sensor.h   (Install "Adafruit Unified Sensor" by Adafruit)
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>

// ============================================================================
// SECTION 1: USER CONFIGURATION & NETWORK CREDENTIALS
// ============================================================================
// >>> REPLACE THESE PLACEHOLDERS WITH YOUR WI-FI NETWORK CREDENTIALS <<<
const char* WIFI_SSID     = "YOUR_WIFI_SSID";         // 2.4 GHz Wi-Fi SSID
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";     // Wi-Fi Password

// >>> REPLACE WITH YOUR DEPLOYED NEXT.JS ENDPOINT BASE URL <<<
// Local Development Example: "http://192.168.1.105:3000/api/sensor-data"
// Production Vercel Example: "https://your-project.vercel.app/api/sensor-data"
const char* API_ENDPOINT  = "http://192.168.1.100:3000/api/sensor-data";

// Identity of this physical prototype bin (matches Supabase public.bins.id)
const char* BIN_ID        = "BIN-001";

// ============================================================================
// SECTION 2: GPIO PIN DEFINITIONS
// ============================================================================
const int PIN_HC_TRIG     = 4;   // HC-SR04 TRIG
const int PIN_HC_ECHO     = 3;   // HC-SR04 ECHO (through 5V -> 3.3V voltage divider)
const int PIN_SERVO       = 7;   // SG90/MG90S Servo PWM signal
const int PIN_IR_OUT      = 10;  // Touchless IR Sensor OUT (Active LOW)
const int PIN_DHT_DATA    = 8;   // DHT11 Single-Wire Data Bus
const int PIN_MQ135_AO    = 1;   // MQ-135 Analog Output (ESP32-S3 ADC1 Channel 0)
const int PIN_BUZZER      = 9;   // Active Buzzer Positive Terminal
const int PIN_LED_GREEN   = 6;   // Green LED (Safe: < 30%)
const int PIN_LED_YELLOW  = 5;   // Yellow LED (Moderate: 30% - 80%)
const int PIN_LED_RED     = 2;   // Red LED (Critical: > 80%)

// ============================================================================
// SECTION 3: CALIBRATION & TIMING CONSTANTS
// ============================================================================
// Physical Prototype Calibration (BIN-001)
const float D_EMPTY_CM         = 27.0f; // Headspace distance when bin is empty
const float D_FULL_CM          = 12.0f; // Headspace distance when bin is 100% full
const float USABLE_DEPTH_CM    = 15.0f; // 27.0 - 12.0 = 15.0 cm fill height

// Touchless Lid Angles & Timings
const int SERVO_ANGLE_CLOSED   = 0;     // Resting closed position (degrees)
const int SERVO_ANGLE_OPEN     = 90;    // Fully open disposal position (degrees)
const unsigned long LID_OPEN_HOLD_MS    = 4500; // Hold open for ~4.5 seconds
const unsigned long LID_SETTLE_DELAY_MS = 1200; // Mechanical settling after closing

// Active logic for IR Sensor (True = LOW on detection, False = HIGH)
const bool IR_ACTIVE_LOW       = true;

// Non-blocking Timers (milliseconds)
const unsigned long TELEMETRY_INTERVAL_MS = 30000; // Send cloud update every 30s
const unsigned long SENSOR_INTERVAL_MS    = 1000;  // Refresh sensor values every 1s
const unsigned long DHT_INTERVAL_MS       = 2500;  // DHT11 minimum refresh cycle
const unsigned long WIFI_RECONNECT_MS     = 10000; // Attempt background reconnect every 10s

// ============================================================================
// SECTION 4: GLOBAL OBJECTS & STATE VARIABLES
// ============================================================================
Servo lidServo;
DHT dht(PIN_DHT_DATA, DHT11);

// State Machine for Non-Blocking Lid Automation
enum LidState {
  LID_STATE_CLOSED,    // Lid closed; ultrasonic headspace sensing active
  LID_STATE_OPEN,      // Lid open; ultrasonic measurement FROZEN
  LID_STATE_SETTLING   // Lid closing; waiting for mechanical vibrations to settle
};

LidState currentLidState = LID_STATE_CLOSED;
unsigned long lidStateTimer = 0;

// Non-blocking Execution Timers
unsigned long lastTelemetryTime   = 0;
unsigned long lastSensorReadTime  = 0;
unsigned long lastDHTReadTime     = 0;
unsigned long lastWifiRetryTime   = 0;
unsigned long lastBuzzerCycleTime = 0;
bool buzzerActiveState = false;

// Cached Telemetry Values
float currentDistanceCm    = 27.0f;
float currentGarbageLevel  = 0.0f;
float currentTemperature   = 25.0f;
float currentHumidity      = 50.0f;
float currentGasLevelIndex = 15.0f;

// ============================================================================
// SECTION 5: HC-SR04 ULTRASONIC & FILL-LEVEL ENGINE
// ============================================================================
/**
 * Triggers a single ultrasonic burst and measures pulse return time.
 * Returns distance in centimeters, or -1.0 if timed out / invalid.
 */
float measureSinglePulse() {
  digitalWrite(PIN_HC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_HC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_HC_TRIG, LOW);

  // Measure echo pulse with a 30,000 µs (~5 meters) timeout
  unsigned long echoDuration = pulseIn(PIN_HC_ECHO, HIGH, 30000);

  if (echoDuration == 0) {
    return -1.0f; // Timeout or sensor disconnected
  }

  // Speed of sound: 343 m/s = 0.0343 cm/µs. Two-way travel -> divide by 2
  float distance = ((float)echoDuration * 0.0343f) / 2.0f;
  return distance;
}

/**
 * Gathers 5 consecutive ultrasonic samples and extracts the median value.
 * Filters acoustic multipath anomalies, stray echoes, and noise spikes.
 */
float getMedianFilteredDistance() {
  const int SAMPLES_COUNT = 5;
  float samples[SAMPLES_COUNT];
  int validSamples = 0;

  for (int i = 0; i < SAMPLES_COUNT; i++) {
    float dist = measureSinglePulse();
    // Valid physical detection range: 2.0 cm to 350.0 cm
    if (dist >= 2.0f && dist <= 350.0f) {
      samples[validSamples++] = dist;
    }
    delay(15); // Interval between pulses to eliminate acoustic ghosting
  }

  // If all samples were invalid/timed out, retain last known good reading
  if (validSamples == 0) {
    return currentDistanceCm;
  }

  // Insertion sort for median extraction
  for (int i = 1; i < validSamples; i++) {
    float key = samples[i];
    int j = i - 1;
    while (j >= 0 && samples[j] > key) {
      samples[j + 1] = samples[j];
      j--;
    }
    samples[j + 1] = key;
  }

  return samples[validSamples / 2];
}

/**
 * Calculates fill percentage based strictly on BIN-001 prototype calibration:
 * - D_empty = 27.0 cm (0% full)
 * - D_full  = 12.0 cm (100% full)
 * - Formula: ((27.0 - distance_cm) / (27.0 - 12.0)) * 100.0
 * - Clamped strictly between 0.0% and 100.0%
 */
float calculateFillPercentage(float distanceCm) {
  if (distanceCm >= D_EMPTY_CM) {
    return 0.0f;
  }
  if (distanceCm <= D_FULL_CM) {
    return 100.0f;
  }

  float fill = ((D_EMPTY_CM - distanceCm) / (D_EMPTY_CM - D_FULL_CM)) * 100.0f;

  if (fill < 0.0f) fill = 0.0f;
  if (fill > 100.0f) fill = 100.0f;

  return fill;
}

// ============================================================================
// SECTION 6: MQ-135 RELATIVE GAS LEVEL INDEX ENGINE
// ============================================================================
/**
 * Reads analog voltage on GPIO 1 (ESP32-S3 ADC1 Channel 0).
 * Converts 12-bit ADC reading (0 - 4095) into a relative Gas Level Index (0.0 - 100.0).
 * NOTE: As per project requirements, this value is strictly a relative index
 * indicating air quality trends, NOT a laboratory PPM calibration.
 */
float readGasLevelIndex() {
  const int ADC_READS = 10;
  long adcAccumulator = 0;

  for (int i = 0; i < ADC_READS; i++) {
    adcAccumulator += analogRead(PIN_MQ135_AO);
    delayMicroseconds(80);
  }

  float avgAdc = (float)adcAccumulator / (float)ADC_READS;

  // Linear scaling from 12-bit ADC (0 - 4095) to 0.0 - 100.0
  float index = (avgAdc / 4095.0f) * 100.0f;

  if (index < 0.0f) index = 0.0f;
  if (index > 100.0f) index = 100.0f;

  return index;
}

// ============================================================================
// SECTION 7: LOCAL ALERT INDICATORS (LEDS + BUZZER)
// ============================================================================
/**
 * Manages physical status indicators according to current fill level:
 * - Safe (< 30%):        Green LED ON, Yellow/Red OFF, Buzzer OFF
 * - Moderate (30% - 80%): Yellow LED ON, Green/Red OFF, Buzzer OFF
 * - Critical (> 80%):     Red LED ON, Green/Yellow OFF, Pulsed Buzzer Active
 *
 * Uses non-blocking millis() timing for pulsed audio alerts.
 */
void updateLocalAlertIndicators(float fillLevel) {
  unsigned long currentMillis = millis();

  if (fillLevel < 30.0f) {
    // SAFE STATUS (< 30%)
    digitalWrite(PIN_LED_GREEN, HIGH);
    digitalWrite(PIN_LED_YELLOW, LOW);
    digitalWrite(PIN_LED_RED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    buzzerActiveState = false;
  }
  else if (fillLevel <= 80.0f) {
    // MODERATE STATUS (30% - 80%)
    digitalWrite(PIN_LED_GREEN, LOW);
    digitalWrite(PIN_LED_YELLOW, HIGH);
    digitalWrite(PIN_LED_RED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    buzzerActiveState = false;
  }
  else {
    // CRITICAL OVERFILL STATUS (> 80%)
    digitalWrite(PIN_LED_GREEN, LOW);
    digitalWrite(PIN_LED_YELLOW, LOW);
    digitalWrite(PIN_LED_RED, HIGH);

    // Non-blocking intermittent beep: 150 ms sound ON, 850 ms silence OFF
    if (buzzerActiveState && (currentMillis - lastBuzzerCycleTime >= 150)) {
      digitalWrite(PIN_BUZZER, LOW);
      buzzerActiveState = false;
      lastBuzzerCycleTime = currentMillis;
    } else if (!buzzerActiveState && (currentMillis - lastBuzzerCycleTime >= 850)) {
      digitalWrite(PIN_BUZZER, HIGH);
      buzzerActiveState = true;
      lastBuzzerCycleTime = currentMillis;
    }
  }
}

// ============================================================================
// SECTION 8: TOUCHLESS LID AUTOMATION (IR + SERVO FSM)
// ============================================================================
/**
 * Non-blocking Finite State Machine controlling hands-free lid opening:
 * 1. Checks IR sensor on GPIO 10.
 * 2. When hand is detected, smoothly commands servo on GPIO 7 to 90 degrees.
 * 3. Keeps lid open for ~4.5 seconds (resets countdown if hand remains).
 * 4. Commands servo back to 0 degrees.
 * 5. Applies a 1.2s settling buffer to allow physical vibration to cease.
 *
 * SAFETY INTERLOCK:
 * Ultrasonic headspace measurement is completely paused while lid is open
 * or settling, preventing false echoes from user hands or the open lid.
 */
void updateTouchlessLid() {
  unsigned long currentMillis = millis();
  int rawIr = digitalRead(PIN_IR_OUT);
  bool handPresent = IR_ACTIVE_LOW ? (rawIr == LOW) : (rawIr == HIGH);

  switch (currentLidState) {
    case LID_STATE_CLOSED:
      if (handPresent) {
        Serial.println(F("[LID-FSM] Touchless hand detected! Opening bin lid (90°)..."));
        lidServo.write(SERVO_ANGLE_OPEN);
        currentLidState = LID_STATE_OPEN;
        lidStateTimer = currentMillis;
      }
      break;

    case LID_STATE_OPEN:
      // Extend open window if user hand is still actively present
      if (handPresent) {
        lidStateTimer = currentMillis;
      }

      if (currentMillis - lidStateTimer >= LID_OPEN_HOLD_MS) {
        Serial.println(F("[LID-FSM] Hold duration elapsed. Closing bin lid (0°)..."));
        lidServo.write(SERVO_ANGLE_CLOSED);
        currentLidState = LID_STATE_SETTLING;
        lidStateTimer = currentMillis;
      }
      break;

    case LID_STATE_SETTLING:
      // Mechanical settling delay before ultrasonic pings resume
      if (currentMillis - lidStateTimer >= LID_SETTLE_DELAY_MS) {
        currentLidState = LID_STATE_CLOSED;
        Serial.println(F("[LID-FSM] Lid fully closed and settled. Ultrasonic sensing active."));
      }
      break;
  }
}

// ============================================================================
// SECTION 9: WI-FI & TELEMETRY CLOUD INGESTION
// ============================================================================
/**
 * Initial Wi-Fi connection attempt during setup().
 */
void connectToWiFi() {
  Serial.printf("[WIFI] Connecting to 2.4GHz network: %s\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startWait = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startWait < 8000) {
    delay(200);
    Serial.print(F("."));
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.printf("[WIFI] Successfully connected! IP Address: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println();
    Serial.println(F("[WIFI] Initial connection attempt timed out. Continuing local operations in background."));
  }
}

/**
 * Verifies Wi-Fi connectivity non-blockingly and initiates reconnect if offline.
 * Ensures local sensors, servo, LEDs, and buzzer NEVER freeze due to network drops.
 */
void maintainWiFiConnection() {
  unsigned long currentMillis = millis();
  if (WiFi.status() != WL_CONNECTED && (currentMillis - lastWifiRetryTime >= WIFI_RECONNECT_MS)) {
    lastWifiRetryTime = currentMillis;
    Serial.println(F("[WIFI] Connection lost. Attempting background reconnect..."));
    WiFi.reconnect();
  }
}

/**
 * Transmits sensor telemetry to Next.js API route (/api/sensor-data).
 * Contract:
 * {
 *   "bin_id": "BIN-001",
 *   "distance_cm": 18.5,
 *   "garbage_level": 56.7,
 *   "temperature": 26.8,
 *   "humidity": 48.0,
 *   "gas_level": 18.5
 * }
 */
void transmitTelemetry() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[HTTP] Skipped cloud transmission: Wi-Fi offline."));
    return;
  }

  Serial.println(F("[HTTP] Serializing JSON telemetry payload..."));

  // Build JSON document
  StaticJsonDocument<256> jsonDoc;
  jsonDoc["bin_id"]        = BIN_ID;
  jsonDoc["distance_cm"]   = round(currentDistanceCm * 10.0f) / 10.0f;
  jsonDoc["garbage_level"] = round(currentGarbageLevel * 10.0f) / 10.0f;
  jsonDoc["temperature"]   = round(currentTemperature * 10.0f) / 10.0f;
  jsonDoc["humidity"]      = round(currentHumidity * 10.0f) / 10.0f;
  jsonDoc["gas_level"]     = round(currentGasLevelIndex * 10.0f) / 10.0f;

  String jsonPayload;
  serializeJson(jsonDoc, jsonPayload);

  HTTPClient httpClient;
  httpClient.begin(API_ENDPOINT);
  httpClient.addHeader("Content-Type", "application/json");
  httpClient.setTimeout(5000); // 5000ms network timeout

  Serial.printf("[HTTP] POST %s\n[HTTP] Payload: %s\n", API_ENDPOINT, jsonPayload.c_str());

  int responseCode = httpClient.POST(jsonPayload);

  if (responseCode > 0) {
    String responseString = httpClient.getString();
    Serial.printf("[HTTP] Success (Status %d): %s\n", responseCode, responseString.c_str());
  } else {
    Serial.printf("[HTTP] Error during transmission: %s (Code %d)\n",
      httpClient.errorToString(responseCode).c_str(), responseCode);
  }

  httpClient.end();
}

// ============================================================================
// SECTION 10: ARDUINO SETUP
// ============================================================================
void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  delay(1000);

  Serial.println(F("\n========================================================"));
  Serial.println(F("  SMART GARBAGE MONITORING SYSTEM - ESP32-S3 FIRMWARE"));
  Serial.println(F("  Prototype Target: BIN-001 | FYP Production Node"));
  Serial.println(F("========================================================"));

  // Initialize GPIO Pin Directions
  pinMode(PIN_HC_TRIG, OUTPUT);
  pinMode(PIN_HC_ECHO, INPUT);
  pinMode(PIN_IR_OUT, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_YELLOW, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);

  // Set Default Initial States
  digitalWrite(PIN_HC_TRIG, LOW);
  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_LED_GREEN, LOW);
  digitalWrite(PIN_LED_YELLOW, LOW);
  digitalWrite(PIN_LED_RED, LOW);

  // Configure ESP32-S3 ADC for MQ-135 on GPIO 1
  analogReadResolution(12);       // 12-bit ADC resolution (0 - 4095)
  analogSetAttenuation(ADC_11db); // Full 0 - 3.1V voltage measurement range

  // Initialize Servo Actuator on GPIO 7
  ESP32PWM::allocateTimer(0);
  lidServo.setPeriodHertz(50); // 50 Hz PWM frequency for standard servos
  lidServo.attach(PIN_SERVO, 500, 2400); // 500µs - 2400µs pulse range
  lidServo.write(SERVO_ANGLE_CLOSED);
  Serial.println(F("[INIT] Servo initialized and set to CLOSED (0°)."));

  // Initialize DHT11 Sensor on GPIO 8
  dht.begin();
  Serial.println(F("[INIT] DHT11 temperature/humidity sensor initialized."));

  // Connect to Wi-Fi
  connectToWiFi();

  // Warm-up Sensor Sampling
  currentGasLevelIndex = readGasLevelIndex();
  float initialHeadspace = getMedianFilteredDistance();
  if (initialHeadspace > 0) {
    currentDistanceCm = initialHeadspace;
    currentGarbageLevel = calculateFillPercentage(currentDistanceCm);
  }
  updateLocalAlertIndicators(currentGarbageLevel);

  Serial.println(F("[INIT] Hardware setup complete. Main non-blocking loop active.\n"));
}

// ============================================================================
// SECTION 11: MAIN NON-BLOCKING EXECUTION LOOP
// ============================================================================
void loop() {
  unsigned long currentMillis = millis();

  // 1. Maintain Touchless Lid FSM (Always active, purely local)
  updateTouchlessLid();

  // 2. Periodic Distance & Gas Sensor Sampling
  if (currentMillis - lastSensorReadTime >= SENSOR_INTERVAL_MS) {
    lastSensorReadTime = currentMillis;

    // Safety Interlock: Sample ultrasonic distance ONLY when the lid is closed
    // When lid is open or settling, distance measurements are paused/frozen
    if (currentLidState == LID_STATE_CLOSED) {
      float measuredDist = getMedianFilteredDistance();
      if (measuredDist >= 2.0f && measuredDist <= 350.0f) {
        currentDistanceCm = measuredDist;
        currentGarbageLevel = calculateFillPercentage(currentDistanceCm);
      }
    }

    // Sample MQ-135 relative gas index
    currentGasLevelIndex = readGasLevelIndex();

    // Output live console telemetry
    Serial.printf("[TELEMETRY] Headspace: %.1f cm | Fill: %.1f%% | Gas Index: %.1f | Temp: %.1f°C | Hum: %.1f%% | Lid: %s\n",
      currentDistanceCm,
      currentGarbageLevel,
      currentGasLevelIndex,
      currentTemperature,
      currentHumidity,
      (currentLidState == LID_STATE_CLOSED ? "CLOSED" : (currentLidState == LID_STATE_OPEN ? "OPEN" : "SETTLING"))
    );
  }

  // 3. Periodic DHT11 Sampling (DHT11 requires at least 2s between reads)
  if (currentMillis - lastDHTReadTime >= DHT_INTERVAL_MS) {
    lastDHTReadTime = currentMillis;

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (!isnan(t)) {
      currentTemperature = t;
    }
    if (!isnan(h)) {
      currentHumidity = h;
    }
  }

  // 4. Update Local Alert Indicators (Green/Yellow/Red LEDs + Pulsed Buzzer)
  updateLocalAlertIndicators(currentGarbageLevel);

  // 5. Background Wi-Fi Reconnection
  maintainWiFiConnection();

  // 6. Transmit Telemetry to Next.js API (Every 30 seconds)
  if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = currentMillis;
    transmitTelemetry();
  }
}
