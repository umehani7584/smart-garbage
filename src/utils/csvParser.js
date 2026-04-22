// CSV file read karne ka utility function

// Base URL for CSV files
const CSV_BASE_PATH = '/data/';

// Generic function to read any CSV file
export const fetchCSV = async (filename) => {
  try {
    const response = await fetch(`${CSV_BASE_PATH}${filename}`);
    const text = await response.text();
    
    // Split into rows
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].trim()) {
        const values = rows[i].split(',');
        const row = {};
        headers.forEach((header, idx) => {
          row[header.trim()] = values[idx]?.trim();
        });
        data.push(row);
      }
    }
    return data;
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};

// Get all users from users.csv
export const getUsers = async () => {
  return await fetchCSV('users.csv');
};

// Get all bins data from bins.csv
export const getBins = async () => {
  return await fetchCSV('bins.csv');
};

// Login function - check email and password from users.csv
export const loginUser = async (email, password) => {
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Remove password before returning
    const { password: pwd, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Get user by ID
export const getUserById = async (id) => {
  const users = await getUsers();
  return users.find(u => u.id === id);
};

// Get bins assigned to a specific user (by name)
export const getBinsByUserName = async (userName) => {
  const bins = await getBins();
  return bins.filter(bin => bin.assigned_to === userName);
};

// Get all unique bin IDs
export const getAllBinIds = async () => {
  const bins = await getBins();
  const binIds = [...new Set(bins.map(bin => bin.Device_Tag || bin.bin_id))];
  return binIds;
};

// Calculate fill percentage from distance (mm)
// Distance 100mm = 90% full, Distance 900mm = 10% full
export const calculateFillPercentage = (distanceInMm) => {
  const maxDistance = 1000;
  const fillPercent = ((maxDistance - distanceInMm) / maxDistance) * 100;
  return Math.min(100, Math.max(0, Math.round(fillPercent)));
};