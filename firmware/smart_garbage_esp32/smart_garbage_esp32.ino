#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ESP32Servo.h>

// ==========================================
// SMART GARBAGE BIN - FINAL INTEGRATED CODE
// ESP32 DEVKIT V1 (WITH ROCK-SOLID WI-FI)
// ==========================================

// ==========================================
// 0. WI-FI & BACKEND SERVER CREDENTIALS
// ==========================================
const char* ssid = "Not For U";
const char* password = "12345678";

// AAPKA EXACT IP ADDRESS (Current Session):
String serverUrl = "http://10.204.149.191:3000/api/sensor-data";

// ==========================================
// 1. PIN DEFINITIONS
// ==========================================
// 1. ULTRASONIC SENSOR
#define TRIG_PIN 23
#define ECHO_PIN 18

// 2. IR SENSOR
#define IR_PIN 15
#define IR_ACTIVE_STATE LOW

// 3. SERVO MOTOR
#define SERVO_PIN 27

// 4. DHT11 SENSOR
#define DHT_PIN 4
#define DHTTYPE DHT11
DHT dht(DHT_PIN, DHTTYPE);

// 5. LEDS
#define GREEN_LED 14
#define YELLOW_LED 13
#define RED_LED 12

// 6. BUZZER DRIVER
#define BUZZER_PIN 26
const bool BUZZER_ENABLED = true;

// ==========================================
// 2. CALIBRATION & THRESHOLDS (SAFE DISTANCE)
// ==========================================
const float EMPTY_DISTANCE = 19.0;
const float YELLOW_LEVEL = 40.0;  // 40% fill par Yellow LED (~11.5 cm door)
const float RED_LEVEL = 65.0;     // 65% fill par Red LED (~6.6 cm door)
const float BUZZER_LEVEL = 65.0;  // 65% fill par Buzzer ON (Safe 6.6 cm distance)

// ==========================================
// 3. SERVO SETTINGS
// ==========================================
const int LID_OPEN_ANGLE = 130;    // 130 degrees for smooth operation
const int LID_CLOSE_ANGLE = 0;
const unsigned long LID_HOLD_TIME = 4500;

// ==========================================
// 4. TIMERS (NON-BLOCKING)
// ==========================================
const unsigned long DISTANCE_INTERVAL = 1000;
const unsigned long DHT_INTERVAL = 2000;
const unsigned long TELEMETRY_INTERVAL = 1000; // Har 1 sec baad server ko update!

// ==========================================
// 5. VARIABLES
// ==========================================
Servo lidServo;
bool lidIsOpen = false;

unsigned long lastHandDetected = 0;
unsigned long lastDistanceRead = 0;
unsigned long lastDHTRead = 0;
unsigned long lastTelemetrySent = 0;
unsigned long lastBuzzerToggle = 0;
bool buzzerState = false;

float distanceCM = -1;
float garbagePercentage = -1;
float temperature = NAN;
float humidity = NAN;

// ==========================================
// ULTRASONIC DISTANCE FUNCTION
// ==========================================
float readDistance() {
  float readings[5];
  int count = 0;

  for (int i = 0; i < 5; i++) {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(3);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);

    if (duration > 0) {
      float distance = duration * 0.0343 / 2.0;
      if (distance >= 2.0 && distance <= 25.0) {
        readings[count] = distance;
        count++;
      }
    }
    delay(60);
  }

  if (count < 3) return -1;

  for (int i = 0; i < count - 1; i++) {
    for (int j = i + 1; j < count; j++) {
      if (readings[i] > readings[j]) {
        float temp = readings[i];
        readings[i] = readings[j];
        readings[j] = temp;
      }
    }
  }

  return readings[count / 2];
}

// ==========================================
// CALCULATE GARBAGE PERCENTAGE
// ==========================================
float calculateFill(float distance) {
  float fill = ((EMPTY_DISTANCE - distance) / EMPTY_DISTANCE) * 100.0;
  return constrain(fill, 0.0, 100.0);
}

// ==========================================
// LED AND BUZZER CONTROL
// ==========================================
void updateIndicators(float fill) {
  if (fill < 0) {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    return;
  }

  // LED Alerts
  if (fill < YELLOW_LEVEL) {
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
  } else if (fill < RED_LEVEL) {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, LOW);
  } else {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, HIGH);
  }

  // SMART BUZZER: Agar bin full hai (>= 65%), tabhi bajega jab koi banda pass aaye (IR active ya lid open)
  // Bina wajah room mein continuous buzzer nahi bajega!
  int irDetect = digitalRead(IR_PIN);
  bool personApproaching = (irDetect == IR_ACTIVE_STATE || lidIsOpen);
  unsigned long now = millis();

  if (BUZZER_ENABLED && fill >= BUZZER_LEVEL && personApproaching) {
    // Pulsing Warning Alert (120ms beep / 120ms pause)
    if (now - lastBuzzerToggle >= 120) {
      lastBuzzerToggle = now;
      buzzerState = !buzzerState;
      digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
    buzzerState = false;
  }
}

// ==========================================
// IR SENSOR + AUTOMATIC SERVO LID
// ==========================================
void controlLid() {
  int irValue = digitalRead(IR_PIN);
  unsigned long currentTime = millis();

  if (irValue == IR_ACTIVE_STATE) {
    lastHandDetected = currentTime;
    if (!lidIsOpen) {
      lidServo.write(LID_OPEN_ANGLE);
      lidIsOpen = true;
      Serial.println("HAND DETECTED: LID OPENED");
      // INSTANT CLOUD UPDATE: Server/Dashboard ko foran OPEN state bhejega!
      sendTelemetryToServer();
    }
  }

  if (lidIsOpen && currentTime - lastHandDetected >= LID_HOLD_TIME) {
    lidServo.write(LID_CLOSE_ANGLE);
    lidIsOpen = false;
    Serial.println("LID CLOSED");
    // INSTANT CLOUD UPDATE: Server/Dashboard ko foran CLOSED state bhejega!
    sendTelemetryToServer();
  }
}

// ==========================================
// DHT11 TEMPERATURE & HUMIDITY
// ==========================================
void readDHT() {
  unsigned long currentTime = millis();

  if (currentTime - lastDHTRead >= DHT_INTERVAL) {
    lastDHTRead = currentTime;
    float newHumidity = dht.readHumidity();
    float newTemperature = dht.readTemperature();

    if (!isnan(newHumidity) && !isnan(newTemperature)) {
      humidity = newHumidity;
      temperature = newTemperature;

      Serial.print("Temperature: ");
      Serial.print(temperature);
      Serial.println(" C");

      Serial.print("Humidity: ");
      Serial.print(humidity);
      Serial.println(" %");
    } else {
      Serial.println("DHT11 SENSOR ERROR");
    }
  }
}

// ==========================================
// HTTP POST TELEMETRY TO NEXT.JS / SUPABASE
// ==========================================
void sendTelemetryToServer() {
  // Agar Wi-Fi connect na ho toh wait karein (ESP32 background mein khud reconnect karta hai)
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WIFI] Connecting to Hotspot in background...");
    return;
  }

  float safeFill = (garbagePercentage >= 0) ? garbagePercentage : 0.0;
  float safeDist = (distanceCM >= 0) ? distanceCM : EMPTY_DISTANCE;
  float safeTemp = isnan(temperature) ? 25.0 : temperature;
  float safeHum  = isnan(humidity) ? 50.0 : humidity;

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(800);

  String jsonPayload = "{";
  jsonPayload += "\"bin_id\":\"BIN-001\",";
  jsonPayload += "\"fill_level\":" + String(safeFill, 1) + ",";
  jsonPayload += "\"distance_cm\":" + String(safeDist, 1) + ",";
  jsonPayload += "\"temperature\":" + String(safeTemp, 1) + ",";
  jsonPayload += "\"humidity\":" + String(safeHum, 1) + ",";
  jsonPayload += "\"lid_status\":\"" + String(lidIsOpen ? "OPEN" : "CLOSED") + "\"";
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("[CLOUD] Telemetry Sent! Server Response: ");
    Serial.println(httpResponseCode);
  } else {
    // Server abhi laptop par on nahi hai, is liye yeh aayega (yeh normal hai!)
    Serial.println("[SERVER] Wi-Fi OK! Waiting for Next.js Web Server on laptop...");
  }

  http.end();
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);

  // Ultrasonic
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  // IR
  pinMode(IR_PIN, INPUT);

  // LEDs
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // Buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);

  // DHT11
  dht.begin();

  // Servo
  lidServo.setPeriodHertz(50);
  lidServo.attach(SERVO_PIN, 500, 2400);
  lidServo.write(LID_CLOSE_ANGLE);
  delay(1000);

  // Wi-Fi Connection (Rock Solid Configuration)
  Serial.println("\n==================================");
  Serial.print("Connecting to Hotspot: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true); // Auto-reconnect enabled
  WiFi.setSleep(false);         // Sleep mode DISABLED taake connection drop na ho
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n>>> WI-FI CONNECTED SUCCESSFULLY! <<<");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[!] Hotspot timeout. Hardware running in standalone mode.");
  }

  Serial.println("==================================");
  Serial.println("SMART GARBAGE BIN INITIALIZED");
  Serial.println("==================================");
}

// ==========================================
// MAIN LOOP
// ==========================================
void loop() {
  unsigned long currentTime = millis();

  // 1. IR + SERVO
  controlLid();

  // 2. DHT11 MONITORING
  readDHT();

  // 3. ULTRASONIC + GARBAGE LEVEL
  if (!lidIsOpen && currentTime - lastDistanceRead >= DISTANCE_INTERVAL) {
    lastDistanceRead = currentTime;

    float newDistance = readDistance();

    if (newDistance >= 0) {
      distanceCM = newDistance;
      garbagePercentage = calculateFill(distanceCM);

      updateIndicators(garbagePercentage);

      Serial.println("--------------------------");
      Serial.print("Distance: ");
      Serial.print(distanceCM);
      Serial.println(" cm");
      Serial.print("Garbage Level: ");
      Serial.print(garbagePercentage);
      Serial.println(" %");

      if (garbagePercentage < YELLOW_LEVEL) {
        Serial.println("STATUS: LOW - GREEN LED");
      } else if (garbagePercentage < RED_LEVEL) {
        Serial.println("STATUS: MEDIUM - YELLOW LED");
      } else {
        Serial.println("STATUS: OVERFLOW / CRITICAL - RED + BUZZER");
      }
      Serial.println("--------------------------");
    } else {
      Serial.println("ULTRASONIC ERROR: NO VALID READING");
      updateIndicators(-1);
      distanceCM = -1;
      garbagePercentage = -1;
    }
  }

  // 4. CLOUD TELEMETRY (Har 3 sec baad Next.js ko data bhejega)
  if (currentTime - lastTelemetrySent >= TELEMETRY_INTERVAL) {
    lastTelemetrySent = currentTime;
    sendTelemetryToServer();
  }

  delay(10);
}