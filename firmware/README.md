# ESP32-S3 Firmware Guide - Smart Garbage Monitoring System

This directory contains the production-ready Arduino C++ firmware for the **ESP32-S3 N16RB** physical smart dustbin prototype (`BIN-001`).

---

## 📋 System Architecture

```
Physical Prototype (BIN-001)
┌─────────────────────────────────────────────────────────┐
│ ESP32-S3 N16RB Microcontroller                         │
│ ├─ HC-SR04 Ultrasonic (GPIO 4 TRIG, GPIO 3 ECHO)       │
│ ├─ Touchless IR Sensor (GPIO 10 OUT)                   │
│ ├─ SG90/MG90S Servo (GPIO 7 PWM)                       │
│ ├─ DHT11 Temp/Humidity (GPIO 8 DATA)                   │
│ ├─ MQ-135 Gas Sensor (GPIO 1 AO)                       │
│ ├─ Status LEDs (GPIO 6 Grn, GPIO 5 Yel, GPIO 2 Red)    │
│ └─ Active Buzzer (GPIO 9 (+))                          │
└────────────┬────────────────────────────────────────────┘
             │ 2.4 GHz Wi-Fi (HTTP POST every 30s)
             ▼
Next.js REST Ingestion API (`POST /api/sensor-data`)
             ▼
Supabase Realtime Database (`public.bins`, `public.sensor_data`, `public.alerts`)
             ▼
Admin Dashboard (`/admin-dashboard`)
```

---

## 🔌 Hardware Wiring & Pinout Matrix

| Component | Pin / Signal | ESP32-S3 GPIO | Signal Type | Electrical / Connection Notes |
| :--- | :--- | :--- | :--- | :--- |
| **HC-SR04** | TRIG | **GPIO 4** | Digital Output | Direct 3.3V logic trigger pulse |
| **HC-SR04** | ECHO | **GPIO 3** | Digital Input | **Requires 5V-to-3.3V voltage divider** (1kΩ + 2kΩ resistors) to protect ESP32 pin |
| **Servo Motor** | Signal | **GPIO 7** | PWM Output | SG90 / MG90S PWM signal. **Power servo VCC from external 5V**, NOT from ESP32 3.3V rail! |
| **IR Proximity** | OUT | **GPIO 10** | Digital Input | Active LOW obstacle detect (FC-51 / TCRT5000 module) |
| **DHT11** | DATA | **GPIO 8** | Digital 1-Wire | 4.7kΩ–10kΩ pull-up to 3.3V (standard on DHT breakout modules) |
| **MQ-135** | AO | **GPIO 1** | Analog Input | Connected to ESP32-S3 ADC1 Channel 0 (Wi-Fi safe, no ADC2 conflict) |
| **Active Buzzer**| (+) | **GPIO 9** | Digital Output | Controlled non-blocking pulsing alert for Critical state (>80%) |
| **Green LED** | Anode (+) | **GPIO 6** | Digital Output | In series with 330Ω resistor (Safe state: < 30%) |
| **Yellow LED** | Anode (+) | **GPIO 5** | Digital Output | In series with 330Ω resistor (Moderate state: 30% - 80%) |
| **Red LED** | Anode (+) | **GPIO 2** | Digital Output | In series with 330Ω resistor (Critical state: > 80%) |
| **Power & Ground**| GND / 5V | Common GND | Power Rails | All grounds must be tied together (ESP32 GND, Sensor GNDs, External 5V PSU GND) |

> [!WARNING]
> **Servo Power Supply**: Never power the servo motor directly from the ESP32-S3 3.3V or VBUS pin. Servos draw instantaneous current spikes up to 500mA–1A during startup, which can cause brownout resets on the ESP32. Use a dedicated 5V power supply with a shared common ground.

---

## 📐 Prototype Physical Calibration (BIN-001)

The firmware is calibrated specifically for the physical prototype container:

* **Empty Bin Reference ($D_{\text{empty}}$)**: `27.0 cm` (0% fill)
* **Full Bin Reference ($D_{\text{full}}$)**: `12.0 cm` (100% fill)
* **Effective Usable Height**: `15.0 cm` ($27.0 - 12.0$)
* **Fill Formula**:
  $$\text{Fill Percentage (\%)} = \left(\frac{27.0 - \text{distance}}{27.0 - 12.0}\right) \times 100.0$$
* **Clamping**:
  * Distance $\ge 27.0\text{ cm} \rightarrow 0.0\%$
  * Distance $\le 12.0\text{ cm} \rightarrow 100.0\%$

### Safety Interlock:
* Whenever the IR sensor triggers touchless lid opening, ultrasonic sampling is **paused/frozen**.
* The system retains the last stable fill level and distance until the lid closes and settles (1.2s buffer) to prevent false echoes and acoustic bounce.

---

## 📦 Required Arduino Libraries

Install the following libraries via **Arduino IDE -> Tools -> Manage Libraries...**:

1. **ESP32Servo** (by Kevin Harrington) - Version `1.1.0` or higher
2. **DHT sensor library** (by Adafruit) - Version `1.4.4` or higher
   *(When prompted, accept installing the **Adafruit Unified Sensor** dependency)*
3. **ArduinoJson** (by Benoit Blanchon) - Version `6.x` or `7.x`

---

## ⚙️ Arduino IDE Board Configuration (ESP32-S3 N16RB)

Select **Tools** in the Arduino IDE menu and configure these exact parameters:

* **Board**: `ESP32S3 Dev Module`
* **Port**: Select the COM port corresponding to your ESP32-S3
* **USB CDC On Boot**: `Enabled` *(Crucial! Enables `Serial.print` over native USB)*
* **CPU Frequency**: `240MHz (WiFi)`
* **Flash Mode**: `QIO 80MHz`
* **Flash Size**: `16MB (128Mb)`
* **Partition Scheme**: `16M Flash (3MB APP/9.9MB FATFS)` or `Default 4MB with spiffs`
* **PSRAM**: `OPI PSRAM` *(Matches the N16RB variant)*
* **Upload Mode**: `UART0 / Hardware CDC`
* **Upload Speed**: `921600`

---

## 🚀 Flashing & Setup Steps

1. Open `firmware/smart_garbage_esp32.ino` in the Arduino IDE.
2. Edit **Configuration & Network Settings** near the top of the file:
   ```cpp
   const char* WIFI_SSID     = "Your_WiFi_Network_Name";
   const char* WIFI_PASSWORD = "Your_WiFi_Password";
   ```
3. Set the **API Endpoint**:
   - For local development on your machine:
     ```cpp
     // Replace with your PC's local IP on the same Wi-Fi (run `ipconfig` in terminal)
     const char* API_ENDPOINT = "http://192.168.1.100:3000/api/sensor-data";
     ```
   - For deployed Next.js on Vercel:
     ```cpp
     const char* API_ENDPOINT = "https://your-project.vercel.app/api/sensor-data";
     ```
4. Put the ESP32-S3 in bootloader mode if necessary (hold `BOOT`, press `RESET`, release `BOOT`).
5. Click **Upload** (arrow icon).
6. Open the **Serial Monitor** at `115200` baud to observe startup and real-time telemetry.

---

## 📡 Telemetry Contract Verification

The firmware sends an HTTP POST every 30 seconds with:
```json
{
  "bin_id": "BIN-001",
  "distance_cm": 18.5,
  "garbage_level": 56.7,
  "temperature": 26.8,
  "humidity": 48.0,
  "gas_level": 18.5
}
```

* **HTTP Status 200**: Successfully processed by `/api/sensor-data`, updated in Supabase, and streamed live to the Admin Dashboard.
