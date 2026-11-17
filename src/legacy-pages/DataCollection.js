import React from 'react';
import { Link } from 'react-router-dom';

function DataCollection() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Data Collection Process</h1>
        <p style={styles.heroSubtitle}>
          How sensor data is collected, processed, and transmitted to the server
        </p>
      </section>

      {/* Content */}
      <div style={styles.content}>
        {/* How Sensors Work */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔍 How Sensors Collect Data</h2>
          <p style={styles.cardText}>
            Each sensor in our smart garbage system works differently to collect specific types of data:
          </p>
          <div style={styles.sensorExplanation}>
            <div style={styles.explanationItem}>
              <strong>📏 Ultrasonic Sensor:</strong> Emits high-frequency sound waves that bounce off the garbage surface.
              The time taken for the echo to return is used to calculate distance = fill level.
            </div>
            <div style={styles.explanationItem}>
              <strong>⚖️ Load Cell:</strong> Converts weight/force into an electrical signal. The HX711 amplifier
              makes this signal readable by the ESP32.
            </div>
            <div style={styles.explanationItem}>
              <strong>🌡️ DHT11:</strong> Uses a capacitive humidity sensor and a thermistor to measure
              temperature and humidity.
            </div>
            <div style={styles.explanationItem}>
              <strong>💨 MQ-135:</strong> Has a heating element that makes it sensitive to gases.
              Different gases change the sensor's resistance, indicating gas levels.
            </div>
          </div>
        </div>

        {/* ESP32 Processing */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📡 ESP32: The Data Collector</h2>
          <p style={styles.cardText}>
            The ESP32 microcontroller continuously reads data from all sensors. Here's the process:
          </p>
          <div style={styles.flowSteps}>
            <div style={styles.flowStep}>
              <div style={styles.flowStepNum}>1</div>
              <div>Read analog/digital signals from sensors</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowStep}>
              <div style={styles.flowStepNum}>2</div>
              <div>Convert raw readings to meaningful values</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowStep}>
              <div style={styles.flowStepNum}>3</div>
              <div>Apply filters to remove noise</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowStep}>
              <div style={styles.flowStepNum}>4</div>
              <div>Format data as JSON</div>
            </div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.flowStep}>
              <div style={styles.flowStepNum}>5</div>
              <div>Send via WiFi to Flask server</div>
            </div>
          </div>
        </div>

        {/* Sample Data */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Sample Data Format</h2>
          <p style={styles.cardText}>
            The ESP32 sends data to the Flask server in JSON format:
          </p>
          <pre style={styles.codeBlock}>
{`{
  "bin_id": "BIN-001",
  "fill_level": 75,
  "weight": 12.5,
  "temperature": 32.4,
  "gas_level": 280,
  "timestamp": "2024-03-10T10:30:00"
}`}
          </pre>
        </div>

        {/* Data Transmission */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📶 Data Transmission</h2>
          <p style={styles.cardText}>
            The ESP32 uses WiFi to send data to the Flask server via HTTP POST requests.
            Data is sent every 5 minutes or immediately when a critical threshold is reached.
          </p>
          <div style={styles.transmissionInfo}>
            <div style={styles.transmissionItem}>
              <strong>Protocol:</strong> HTTP/HTTPS
            </div>
            <div style={styles.transmissionItem}>
              <strong>Frequency:</strong> Every 5 minutes (normal) / Immediate (critical)
            </div>
            <div style={styles.transmissionItem}>
              <strong>Security:</strong> API Key authentication
            </div>
          </div>
        </div>

        {/* Arduino Code Snippet */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💻 Arduino Code Example</h2>
          <pre style={styles.codeBlock}>
{`// ESP32 Code for reading sensors
void loop() {
  int fillLevel = getUltrasonicReading();
  float weight = getLoadCellReading();
  float temp = getDHT11Reading();
  int gas = getMQ135Reading();
  
  String jsonData = "{";
  jsonData += "\\"fill_level\\":" + String(fillLevel) + ",";
  jsonData += "\\"weight\\":" + String(weight) + ",";
  jsonData += "\\"temperature\\":" + String(temp) + ",";
  jsonData += "\\"gas_level\\":" + String(gas);
  jsonData += "}";
  
  sendToServer(jsonData);
  delay(300000); // Wait 5 minutes
}`}
          </pre>
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
    color: '#666',
    marginBottom: '1rem'
  },
  sensorExplanation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem'
  },
  explanationItem: {
    padding: '1rem',
    background: 'white',
    borderRadius: '10px',
    lineHeight: 1.6,
    color: '#666'
  },
  flowSteps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  flowStep: {
    textAlign: 'center',
    padding: '1rem',
    background: 'white',
    borderRadius: '10px',
    minWidth: '120px'
  },
  flowStepNum: {
    width: '30px',
    height: '30px',
    background: '#00b4d8',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.5rem',
    fontWeight: 'bold'
  },
  flowArrow: {
    fontSize: '1.5rem',
    color: '#00b4d8'
  },
  codeBlock: {
    background: '#1a2a3a',
    color: '#e0e0e0',
    padding: '1rem',
    borderRadius: '10px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.9rem'
  },
  transmissionInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  transmissionItem: {
    padding: '1rem',
    background: 'white',
    borderRadius: '10px',
    textAlign: 'center'
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

export default DataCollection;