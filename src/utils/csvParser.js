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

// Get all bins data from bins_10_bins.csv
export const getBins = async () => {
  return await fetchCSV('bins_10_bins.csv');
};

// Get all unique bin IDs
export const getAllBinIds = async () => {
  const bins = await getBins();
  const binIds = [...new Set(bins.map(bin => bin.Device_Tag || bin.bin_id))];
  return binIds;
};

// ✅ IMPROVED: Calculate fill percentage from distance (mm)
// Distance 0-100mm = 90-100% full (Critical)
// Distance 101-300mm = 70-89% full (Warning)
// Distance 301-1000mm = 0-69% full (Normal)
// Distance > 1000mm = 0% full (Empty)
export const calculateFillPercentage = (distanceInMm) => {
  // Handle invalid or missing values
  if (!distanceInMm || isNaN(distanceInMm)) return 0;
  
  // Agar distance 1000mm se zyada hai to bin empty hai
  if (distanceInMm >= 1000) return 0;
  
  // Agar distance 0 ya negative hai to bin full hai
  if (distanceInMm <= 0) return 100;
  
  // Normal calculation
  const maxDistance = 1000;
  let fillPercent = ((maxDistance - distanceInMm) / maxDistance) * 100;
  
  // Ensure value is between 0 and 100
  fillPercent = Math.min(100, Math.max(0, fillPercent));
  
  return Math.round(fillPercent);
};

// Get status based on fill percentage
export const getStatusFromFillLevel = (fillLevel) => {
  if (fillLevel >= 90) return 'critical';
  if (fillLevel >= 70) return 'warning';
  return 'normal';
};

// Get status text for display
export const getStatusText = (status) => {
  if (status === 'critical') return 'Critical';
  if (status === 'warning') return 'Warning';
  return 'Normal';
};

// Get color based on fill level
export const getFillColor = (level) => {
  if (level >= 90) return '#f44336';     // Red - Critical
  if (level >= 70) return '#ff9800';     // Orange - Warning
  return '#4caf50';                       // Green - Normal
};

// Get bins assigned to a specific user (by name)
export const getBinsByUserName = async (userName) => {
  const bins = await getBins();
  return bins.filter(bin => bin.assigned_to === userName);
};

// ========== LOGIN FUNCTIONS (CSV + LocalStorage) ==========

// Login function - ONLY CSV (old version)
export const loginUser = async (email, password) => {
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: pwd, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Login function - CSV + LocalStorage dono se check karega (NEW)
export const loginUserWithLocal = async (email, password) => {
  // 1. CSV se users lo
  const csvUsers = await getUsers();
  
  // 2. LocalStorage se users lo
  const localUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  
  // 3. Dono ko combine karo
  const allUsers = [...csvUsers, ...localUsers];
  
  // 4. User search karo
  const user = allUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: pwd, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Get all users (CSV + LocalStorage combined)
export const getAllUsersCombined = async () => {
  const csvUsers = await getUsers();
  const localUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  return [...csvUsers, ...localUsers];
};

// Add new user to LocalStorage
export const addUserToLocalStorage = (userData) => {
  const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  
  // Generate new ID
  const newId = existingUsers.length + 1;
  
  const newUser = {
    id: newId,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: 'user',
    area: userData.area,
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
    assignedBins: []
  };
  
  existingUsers.push(newUser);
  localStorage.setItem('allUsers', JSON.stringify(existingUsers));
  
  return newUser;
};

// Get user by ID (CSV + LocalStorage)
export const getUserByIdCombined = async (id) => {
  const allUsers = await getAllUsersCombined();
  return allUsers.find(u => Number(u.id) === Number(id));
};

// Update user in LocalStorage
export const updateUserInLocalStorage = (userId, updatedData) => {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const updatedUsers = allUsers.map(u => 
    Number(u.id) === Number(userId) ? { ...u, ...updatedData } : u
  );
  localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  return updatedUsers.find(u => Number(u.id) === Number(userId));
};

// Delete user from LocalStorage
export const deleteUserFromLocalStorage = (userId) => {
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  const updatedUsers = allUsers.filter(u => Number(u.id) !== Number(userId));
  localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  return updatedUsers;
};