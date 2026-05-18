<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=IoT%20Smart%20Garbage%20System&fontSize=40&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Real-time%20Bin%20Monitoring%20Dashboard&descAlignY=55&descSize=18"/>

</div>

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://javascript.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://css3.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)

![Status](https://img.shields.io/badge/Status-In%20Progress-orange?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Complete-brightgreen?style=for-the-badge)
![University](https://img.shields.io/badge/NUML-Multan-blue?style=for-the-badge)

</div>

---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [System Architecture](#-system-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Dashboard Screenshots](#-dashboard-screenshots)
- [Hardware Components](#-hardware-components)
- [Data Flow](#-data-flow)
- [Current Progress](#-current-progress)
- [Future Work](#-future-work)
- [Team](#-team)

---

## 🗑️ About The Project

> **IoT Enabled Smart Garbage Monitoring System** is a Final Year Project developed at **NUML University, Multan** that addresses the real-world problem of unmonitored overflowing garbage bins.

Traditional garbage bins overflow because there is no real-time monitoring system. Workers check bins manually, which causes delays, wastes resources, and creates health risks. Our system solves this by:

- 🔴 **Detecting** bin fill level, weight, temperature, humidity, and gas in real-time
- 📡 **Transmitting** data wirelessly via ESP32 Wi-Fi module
- 🗄️ **Storing** all sensor readings in a MySQL database via Flask API
- 📊 **Displaying** live bin status on a beautiful React dashboard
- 🔔 **Alerting** workers instantly when bins are full or unsafe

---

## 🏗️ System Architecture

```
IoT Sensors → ESP32 → Wi-Fi → Flask API → MySQL → React Dashboard
```
Hardware Layer                    Software Layer
─────────────                     ──────────────
Ultrasonic Sensor (HC-SR04)  →   Flask (Python) Backend
Load Cell (HX711)            →   MySQL + XAMPP Database
DHT11 (Temp/Humidity)        →   React.js Frontend
MQ-135 (Gas Sensor)          →   Recharts Visualization
IR Sensor (Lid Control)      →   Real-time Alerts
Servo Motor (Auto Lid)       →   Worker Management
---

## ✨ Features

### 🔐 Authentication System
- ✅ Admin & Worker login
- ✅ Secure signup with CNIC, phone validation
- ✅ Profile picture & document upload
- ✅ Role-based access (Admin / Worker)
- ✅ LocalStorage session management

### 📊 Admin Dashboard
- ✅ Real-time overview of all bins
- ✅ Total bins, avg fill level, critical bins counter
- ✅ Color-coded bin status (Green / Orange / Red)
- ✅ Refresh stats & export report
- ✅ Active workers count

### 🗑️ Bins Management
- ✅ View all bins with real-time data
- ✅ Bin details: fill level, temperature, humidity, weight, gas
- ✅ Filter bins by area and status
- ✅ Critical bin alerts
- ✅ Bin location coordinates

### 👷 Workers Management
- ✅ Add, edit, delete workers
- ✅ Assign bins to specific workers
- ✅ View worker details and assigned areas
- ✅ Active/inactive worker status
- ✅ CSV export per worker

### 📈 Analytics & Reports
- ✅ Fill level charts per bin
- ✅ Temperature monitoring graph
- ✅ Humidity level visualization
- ✅ Historical data trends
- ✅ 6 interactive charts

### 🔔 Notifications
- ✅ Real-time critical alerts
- ✅ Workers receive bin assignment notifications
- ✅ Full bin & hazardous gas warnings
- ✅ Notification badge counter
- ✅ Clear all notifications

### 👤 User (Worker) Dashboard
- ✅ Personalized welcome screen
- ✅ Assigned bins overview
- ✅ Bin analytics for assigned bins
- ✅ Collect now button per bin
- ✅ Schedule management

---

## 🛠️ Tech Stack

### Frontend (Complete ✅)
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI Framework |
| **React Router** | Page Navigation |
| **Recharts** | Data Visualization |
| **lucide-react** | Icons |
| **JavaScript (ES6+)** | Logic & Interactivity |
| **CSS3 / Inline Styles** | Styling |
| **LocalStorage** | Data Persistence |
| **CSV Data** | Simulated Sensor Data |

### Backend (In Progress 🔄)
| Technology | Purpose |
|-----------|---------|
| **Python** | Backend Language |
| **Flask** | REST API Server |
| **MySQL** | Database |
| **XAMPP** | Local Server |

### Hardware (In Progress 🔄)
| Component | Purpose |
|-----------|---------|
| **ESP32** | Wi-Fi Microcontroller |
| **HC-SR04** | Ultrasonic Fill Sensor |
| **DHT11** | Temperature & Humidity |
| **MQ-135** | Gas / Air Quality |
| **HX711 + Load Cell** | Weight Measurement |
| **IR Sensor** | Proximity Detection |
| **Servo Motor** | Automatic Lid Control |
| **Arduino IDE** | ESP32 Programming (C++) |

---


---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/umehani7584/smart-garbage-system.git
```

**2. Navigate to project folder**
```bash
cd smart-garbage-system
```

**3. Install dependencies**
```bash
npm install
```

**4. Install required packages**
```bash
npm install react-router-dom recharts lucide-react react-icons
```

**5. Start the development server**
```bash
npm start
```

**6. Open in browser**
http://localhost:3000
### 🔑 Test Credentials
Admin Login:
Email:    admin@test.com
Password: admin123
Worker Login:
Email:    ahmed@test.com
Password: 123
---

## 📸 Dashboard Screenshots

| Page | Description |

|------|-------------|
| 🏠 **Home Page** | Landing page with navigation |
| 🔐 **Login** | Modal login with validation |
| 📝 **Signup** | Full registration form |
| 📊 **Admin Overview** | Real-time bin dashboard |
| 📈 **Analytics** | Charts and graphs |
| 🗑️ **Bins Management** | All bins with details |
| 👷 **Workers Management** | Team management |
| 👤 **User Dashboard** | Worker personal view |

> 📷 *Screenshots coming soon — project in active development*

---

---

## 🔄 Data Flow
Step 1 → Sensors detect bin conditions
Step 2 → ESP32 reads and processes sensor data
Step 3 → Data sent to Flask API via Wi-Fi (HTTP POST)
Step 4 → Flask stores data in MySQL database
Step 5 → React dashboard fetches data via API (HTTP GET)
Step 6 → Recharts displays real-time graphs
Step 7 → Alerts sent to workers if bin is full / unsafe
---



## 🔮 Future Work

- 🗺️ **Google Maps Integration** — Show bin locations on map
- 📱 **Mobile App** — React Native version for workers
- 🤖 **AI Route Optimization** — Smart collection routes
- ☁️ **Cloud Deployment** — Host on AWS / Firebase
- 📊 **Predictive Analytics** — Forecast bin fill times
- 🔔 **SMS Alerts** — Twilio integration for urgent alerts



## 👩‍💻 Team

<div align="center">

| Member | Role | ID |
|--------|------|----|
| **UmmeHani** | React Frontend Developer | BSCS-MC-211 |
| **Yusra Bilal** | Frontend Developer | BSCS-MC-246 |

**Supervisor:** Faisal Hussain

**Institution:** NUML University, Multan

**Department:** Computer Science

**Year:** Defence 2025

</div>

---

## 📄 License

This project is developed as a Final Year Project at **NUML University, Multan**.
All rights reserved © 2025 UmmeHani & Yusra Bilal.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer"/>

**⭐ If you find this project helpful, please give it a star! ⭐**

**Made with ❤️ by UmmeHani & Yusra Bilal — NUML University Multan**

</div>
