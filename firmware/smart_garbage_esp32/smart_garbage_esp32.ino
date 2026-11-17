#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ESP32Servo.h>

// ==========================================
// SMART GARBAGE BIN - PRODUCTION CLOUD FIRMWARE
// VERCEL LIVE: smart-garbage-ihlq.vercel.app
// ==========================================

// ==========================================
// 0. WI-FI CREDENTIALS & VERCEL ENDPOINT
// ==========================================
const char* ssid = "Not For U";          // Aapka Wi-Fi / Hotspot Name
const char* password = "12345678";      // Aapka Wi-Fi / Hotspot Password

// PERMANENT VERCEL CLOUD ENDPOINT (NO MORE IP CHANGES!):
const char* serverUrl = "https://smart-garbage-ihlq.vercel.app/api/sensor-data";

// ==========================================
// 1. PIN DEFINITIONS
// ==========================================
#define TRIG_PIN 23
#define ECHO_PIN 18
#define IR_PIN 15
#define IR_ACTIVE_STATE LOW
#define SERVO_PIN 27
#define DHT_PIN 4
#define DHTTYPE DHT11
DHT dht(DHT_PIN, DHTTYPE);

#define GREEN_LED 14
#define YELLOW_LED 13
#define RED_LED 12
#define BUZZER_PIN 26
const bool BUZZER_ENABLED = true;

// ==========================================
// 2. CALIBRATION & THRESHOLDS
// ==========================================
const float EMPTY_DISTANCE = 19.0;
const float YELLOW_LEVEL = 40.0;  // 40% fill -> Yellow LED
const float RED_LEVEL = 65.0;     // 65% fill -> Red LED
const float BUZZER_LEVEL = 65.0;  // 65% fill -> Smart Buzzer Warning

const int LID_OPEN_ANGLE = 130;
const int LID_CLOSE_ANGLE = 0;
const unsigned long LID_HOLD_TIME = 4500;

// ==========================================
// 3. TIMERS & STATE (ULTRA-FAST LIVE TELEMETRY)
// ==========================================
const unsigned long DISTANCE_INTERVAL = 400;   // Har 400ms baad distance read
const unsigned long DHT_INTERVAL = 2000;        // 2 sec DHT read
const unsigned long TELEMETRY_INTERVAL = 500;   // Sub-second (0.5 sec) live cloud update!

Servo lidServo;
bool lidIsOpen = false;

unsigned long lastHandDetected = 0;
unsigned long lastDistanceRead = 0;
unsigned long lastDHTRead = 0;
unsigned long lastTelemetrySent = 0;

float distanceCM = -1;
float garbagePercentage = -1;
float temperature = NAN;
float humidity = NAN;

// ==========================================
// ULTRASONIC SENSOR (FAST SAMPLING)
// ==========================================
float readDistance() {
  float readings[3];
  int count = 0;

  for (int i = 0; i < 3; i++) {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(3);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    unsigned long duration = pulseIn(ECHO_PIN, HIGH, 25000);

    if (duration > 0) {
      float distance = duration * 0.0343 / 2.0;
      if (distance >= 2.0 && distance <= 25.0) {
        readings[count] = distance;
        count++;
      }
    }
    delay(15);
  }

  if (count == 0) return -1;
  if (count == 1) return readings[0];

  // Median / Average
  float sum = 0;
  for (int i = 0; i < count; i++) {
    sum += readings[i];
  }
  return sum / count;
}

float calculateFill(float distance) {
  float fill = ((EMPTY_DISTANCE - distance) / EMPTY_DISTANCE) * 100.0;
  return constrain(fill, 0.0, 100.0);
}

// ==========================================
// LEDS & SMART BUZZER
// ==========================================
void updateIndicators(float fill) {
  if (fill < 0) {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    return;
  }

  // Visual LED Indications
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

  // SMART BUZZER: Pehle ki tarah jab bin FULL ho (>= 65%) aur koi person kachra
  // phenkne aaye (IR detect / lid open) to FULL AWAZ se continuous buzzer baje!
  // Aur jaise hi hand door ho, foran band ho jaye!
  int irDetect = digitalRead(IR_PIN);
  bool personApproaching = (irDetect == IR_ACTIVE_STATE || lidIsOpen);

  if (BUZZER_ENABLED && fill >= BUZZER_LEVEL && personApproaching) {
    digitalWrite(BUZZER_PIN, HIGH); // FULL AWAZ continuous alarm!
  } else {
    digitalWrite(BUZZER_PIN, LOW);  // Hand door hotay hi foran band!
  }
}

// ==========================================
// FORWARD DECLARATION
// ==========================================
void sendTelemetryToServer();

// ==========================================
// IR + SERVO LID
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
      sendTelemetryToServer(); // Instant cloud update on open!
    }
  }

  if (lidIsOpen && currentTime - lastHandDetected >= LID_HOLD_TIME) {
    lidServo.write(LID_CLOSE_ANGLE);
    lidIsOpen = false;
    Serial.println("LID CLOSED");
    sendTelemetryToServer(); // Instant cloud update on close!
  }
}

// ==========================================
// DHT11 SENSOR
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
    }
  }
}

// ==========================================
// SECURE CLOUD TELEMETRY (HTTPS VERCEL)
// ==========================================
void sendTelemetryToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  float safeFill = (garbagePercentage >= 0) ? garbagePercentage : 0.0;
  float safeDist = (distanceCM >= 0) ? distanceCM : EMPTY_DISTANCE;
  float safeTemp = isnan(temperature) ? 25.0 : temperature;
  float safeHum  = isnan(humidity) ? 50.0 : humidity;

  WiFiClientSecure secureClient;
  secureClient.setInsecure(); // Connects securely to Vercel HTTPS without certificate bloat

  HTTPClient http;
  http.begin(secureClient, serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(1200);

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
    Serial.print("[VERCEL CLOUD] Data Sent! Status: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("[VERCEL CLOUD] Connection error: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  lastTelemetrySent = millis();
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  pinMode(IR_PIN, INPUT);

  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);

  dht.begin();

  lidServo.setPeriodHertz(50);
  lidServo.attach(SERVO_PIN, 500, 2400);
  lidServo.write(LID_CLOSE_ANGLE);
  delay(1000);

  Serial.println("\nConnecting to Wi-Fi...");
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.setSleep(false);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n>>> WI-FI CONNECTED TO INTERNET! <<<");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());
  }
}

// ==========================================
// MAIN LOOP
// ==========================================
void loop() {
  unsigned long currentTime = millis();

  controlLid();
  readDHT();
  updateIndicators(garbagePercentage);

  if (!lidIsOpen && currentTime - lastDistanceRead >= DISTANCE_INTERVAL) {
    lastDistanceRead = currentTime;
    float newDistance = readDistance();

    if (newDistance >= 0) {
      distanceCM = newDistance;
      garbagePercentage = calculateFill(distanceCM);

      Serial.print("Fill: ");
      Serial.print(garbagePercentage);
      Serial.print("% | Distance: ");
      Serial.print(distanceCM);
      Serial.println(" cm");
    }
  }

  // 1-Second Cloud Transmission
  if (currentTime - lastTelemetrySent >= TELEMETRY_INTERVAL) {
    lastTelemetrySent = currentTime;
    sendTelemetryToServer();
  }

  delay(10);
}