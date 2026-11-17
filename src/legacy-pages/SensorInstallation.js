import React from 'react';
import { Link } from 'react-router-dom';

function SensorInstallation() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Sensor Installation</h1>
        <p style={styles.heroSubtitle}>
          Learn about the IoT sensors that make our smart garbage system intelligent
        </p>
      </section>

      {/* Content */}
      <div style={styles.content}>
        {/* Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📡 Overview</h2>
          <p style={styles.cardText}>
            Our smart garbage system uses multiple IoT sensors installed inside each garbage bin.
            These sensors work together to collect real-time data about the bin's status.
            All sensors are connected to an ESP32 microcontroller which processes and transmits the data.
          </p>
        </div>

        {/* Sensors Grid */}
        <h2 style={styles.sectionTitle}>Sensors Used in Our System</h2>
        <div style={styles.sensorsGrid}>
          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>📏</div>
            <h3 style={styles.sensorTitle}>Ultrasonic Sensor (HC-SR04)</h3>
            <p style={styles.sensorDesc}>
              Measures the fill level of the garbage bin by sending sound waves and calculating 
              the distance to the garbage surface. This helps determine how full the bin is.
            </p>
            <div style={styles.sensorSpecs}>
              <span>Range: 2cm - 400cm</span>
              <span>Accuracy: 3mm</span>
            </div>
          </div>

          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>⚖️</div>
            <h3 style={styles.sensorTitle}>Load Cell + HX711</h3>
            <p style={styles.sensorDesc}>
              Measures the weight of garbage inside the bin. The HX711 module amplifies the 
              small signal from the load cell and converts it to digital data.
            </p>
            <div style={styles.sensorSpecs}>
              <span>Capacity: Up to 50kg</span>
              <span>Accuracy: ±5g</span>
            </div>
          </div>

          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🌡️</div>
            <h3 style={styles.sensorTitle}>DHT11 Temperature Sensor</h3>
            <p style={styles.sensorDesc}>
              Monitors the temperature inside the bin to detect any abnormal heat that could
              indicate a fire hazard or chemical reaction.
            </p>
            <div style={styles.sensorSpecs}>
              <span>Range: 0°C - 50°C</span>
              <span>Accuracy: ±2°C</span>
            </div>
          </div>

          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>💨</div>
            <h3 style={styles.sensorTitle}>MQ-135 Gas Sensor</h3>
            <p style={styles.sensorDesc}>
              Detects harmful gases like methane, ammonia, and other toxic emissions produced
              by decomposing waste. Alerts authorities about hazardous conditions.
            </p>
            <div style={styles.sensorSpecs}>
              <span>Detects: NH3, NOx, CO2</span>
              <span>Range: 10-1000 ppm</span>
            </div>
          </div>

          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>👁️</div>
            <h3 style={styles.sensorTitle}>IR Sensor</h3>
            <p style={styles.sensorDesc}>
              Detects human presence near the bin to automatically open the lid using a servo motor.
              Improves hygiene by enabling touchless operation.
            </p>
            <div style={styles.sensorSpecs}>
              <span>Range: 2cm - 30cm</span>
              <span>Detection: Human/Objects</span>
            </div>
          </div>

          <div style={styles.sensorCard}>
            <div style={styles.sensorIcon}>🔄</div>
            <h3 style={styles.sensorTitle}>Servo Motor</h3>
            <p style={styles.sensorDesc}>
              Controls the automatic opening and closing of the bin lid when the IR sensor
              detects someone approaching.
            </p>
            <div style={styles.sensorSpecs}>
              <span>Rotation: 0° - 180°</span>
              <span>Control: PWM Signal</span>
            </div>
          </div>
        </div>

        {/* ESP32 Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔌 The Brain: ESP32 Microcontroller</h2>
          <p style={styles.cardText}>
            The ESP32 is the central processing unit of our smart bin. It:
          </p>
          <ul style={styles.list}>
            <li>Reads data from all sensors simultaneously</li>
            <li>Processes and filters the raw sensor data</li>
            <li>Controls the servo motor for lid operation</li>
            <li>Sends data to the Flask server via WiFi</li>
            <li>Triggers buzzer alerts when needed</li>
          </ul>
          <div style={styles.infoBox}>
            <strong>💡 Technical Specs:</strong> Dual-core processor, built-in WiFi & Bluetooth,
            multiple ADC pins, low power consumption
          </div>
        </div>

        {/* Installation Steps */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔧 Installation Process</h2>
          <div style={styles.stepsList}>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>1</span>
              <span>Mount all sensors inside the garbage bin at appropriate positions</span>
            </div>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>2</span>
              <span>Connect sensors to ESP32 using jumper wires</span>
            </div>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>3</span>
              <span>Upload the Arduino code to ESP32</span>
            </div>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>4</span>
              <span>Connect ESP32 to WiFi network</span>
            </div>
            <div style={styles.stepItem}>
              <span style={styles.stepNum}>5</span>
              <span>Test all sensors and calibrate if needed</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link to="/" style={styles.backButton}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, #023047 0%, #0077b6 100%)',
    borderRadius: '30px',
    color: 'white',
    marginBottom: '3rem'
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    opacity: 0.9
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#023047',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  card: {
    background: '#f8f9fa',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#023047',
    marginBottom: '1rem'
  },
  cardText: {
    fontSize: '1rem',
    lineHeight: 1.8,
    color: '#666'
  },
  sensorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  sensorCard: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '15px',
    transition: 'transform 0.3s'
  },
  sensorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  sensorTitle: {
    fontSize: '1.2rem',
    color: '#023047',
    marginBottom: '0.5rem'
  },
  sensorDesc: {
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '1rem'
  },
  sensorSpecs: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#00b4d8',
    flexWrap: 'wrap'
  },
  list: {
    paddingLeft: '1.5rem',
    color: '#666',
    lineHeight: 1.8
  },
  infoBox: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#e8f4f8',
    borderRadius: '10px',
    color: '#023047'
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.8rem',
    background: 'white',
    borderRadius: '10px'
  },
  stepNum: {
    width: '30px',
    height: '30px',
    background: '#00b4d8',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  backButton: {
    display: 'inline-block',
    textAlign: 'center',
    padding: '1rem 2rem',
    background: '#00b4d8',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    marginTop: '1rem',
    transition: 'all 0.3s'
  }
};

export default SensorInstallation;