import React from 'react';
import { Link } from 'react-router-dom';

function DatabaseProcessing() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Database Processing</h1>
        <p style={styles.heroSubtitle}>
          How data is processed, stored, and managed in our system
        </p>
      </section>

      {/* Content */}
      <div style={styles.content}>
        {/* Overview */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔄 Data Flow Overview</h2>
          <p style={styles.cardText}>
            Once data is received from the ESP32, it goes through a processing pipeline
            before being stored in the MySQL database and displayed on the dashboard.
          </p>
          <div style={styles.dataFlow}>
            <div style={styles.dataFlowItem}>ESP32 Data</div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.dataFlowItem}>Flask Server</div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.dataFlowItem}>Validation</div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.dataFlowItem}>MySQL DB</div>
            <div style={styles.flowArrow}>→</div>
            <div style={styles.dataFlowItem}>Dashboard</div>
          </div>
        </div>

        {/* Flask Server */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🐍 Flask Server (Backend API)</h2>
          <p style={styles.cardText}>
            The Flask server acts as a REST API that receives data from ESP32 devices
            and serves data to the React frontend.
          </p>
          <h3 style={styles.subtitle}>API Endpoints:</h3>
          <div style={styles.endpoints}>
            <div style={styles.endpoint}>
              <code style={styles.endpointMethod}>POST</code>
              <code style={styles.endpointUrl}>/api/bins/update</code>
              <span>Receive data from ESP32</span>
            </div>
            <div style={styles.endpoint}>
              <code style={styles.endpointMethod}>GET</code>
              <code style={styles.endpointUrl}>/api/bins</code>
              <span>Get all bins data</span>
            </div>
            <div style={styles.endpoint}>
              <code style={styles.endpointMethod}>GET</code>
              <code style={styles.endpointUrl}>/api/stats</code>
              <span>Get system statistics</span>
            </div>
            <div style={styles.endpoint}>
              <code style={styles.endpointMethod}>POST</code>
              <code style={styles.endpointUrl}>/api/login</code>
              <span>User authentication</span>
            </div>
          </div>
        </div>

        {/* MySQL Database */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🗄️ MySQL Database Schema</h2>
          <p style={styles.cardText}>
            Our system uses MySQL to store all data persistently. Here are the main tables:
          </p>
          
          <h3 style={styles.subtitle}>Users Table</h3>
          <pre style={styles.codeBlock}>
{`CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  area VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active'
);`}
          </pre>

          <h3 style={styles.subtitle}>Bins Table</h3>
          <pre style={styles.codeBlock}>
{`CREATE TABLE bins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id VARCHAR(20) NOT NULL,
  location VARCHAR(255),
  fill_level INT DEFAULT 0,
  weight DECIMAL(5,2) DEFAULT 0,
  temperature DECIMAL(4,1) DEFAULT 0,
  gas_level INT DEFAULT 0,
  last_updated TIMESTAMP
);`}
          </pre>

          <h3 style={styles.subtitle}>Collections Table</h3>
          <pre style={styles.codeBlock}>
{`CREATE TABLE collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id VARCHAR(20),
  collected_by INT,
  collection_time TIMESTAMP,
  fill_level_before INT
);`}
          </pre>
        </div>

        {/* Flask Code Example */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💻 Flask API Code Example</h2>
          <pre style={styles.codeBlock}>
{`from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

@app.route('/api/bins/update', methods=['POST'])
def update_bin():
    data = request.json
    
    conn = mysql.connector.connect(
        host='localhost',
        database='smart_garbage',
        user='root',
        password=''
    )
    
    cursor = conn.cursor()
    sql = "UPDATE bins SET fill_level=%s, weight=%s, 
           temperature=%s, gas_level=%s WHERE bin_id=%s"
    
    cursor.execute(sql, (data['fill_level'], 
                         data['weight'],
                         data['temperature'], 
                         data['gas_level'],
                         data['bin_id']))
    conn.commit()
    
    return jsonify({"status": "success"})`}
          </pre>
        </div>

        {/* Data Validation */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>✅ Data Validation & Processing</h2>
          <p style={styles.cardText}>
            Before storing data in the database, the Flask server performs validation:
          </p>
          <ul style={styles.list}>
            <li>Checks if bin_id exists in the database</li>
            <li>Validates that values are within expected ranges</li>
            <li>Converts data types (string to integer/float)</li>
            <li>Adds timestamp if not provided</li>
            <li>Calculates status (Green/Yellow/Red) based on fill level</li>
          </ul>
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
  subtitle: {
    fontSize: '1.2rem',
    color: '#023047',
    marginTop: '1rem',
    marginBottom: '0.5rem'
  },
  dataFlow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  dataFlowItem: {
    padding: '0.8rem 1.2rem',
    background: '#00b4d8',
    color: 'white',
    borderRadius: '10px',
    fontWeight: 'bold'
  },
  flowArrow: {
    fontSize: '1.5rem',
    color: '#00b4d8'
  },
  endpoints: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: '1rem'
  },
  endpoint: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    padding: '0.8rem',
    background: 'white',
    borderRadius: '8px'
  },
  endpointMethod: {
    padding: '0.3rem 0.6rem',
    background: '#00b4d8',
    color: 'white',
    borderRadius: '5px',
    fontWeight: 'bold'
  },
  endpointUrl: {
    fontFamily: 'monospace',
    color: '#023047'
  },
  codeBlock: {
    background: '#1a2a3a',
    color: '#e0e0e0',
    padding: '1rem',
    borderRadius: '10px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    marginBottom: '1rem'
  },
  list: {
    paddingLeft: '1.5rem',
    color: '#666',
    lineHeight: 1.8
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

export default DatabaseProcessing;