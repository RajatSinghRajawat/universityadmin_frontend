// Mock authentication utility for Frontend
// This provides a simple auth system without complex context setup

export const getCurrentUser = () => {
  // Check if user is logged in via localStorage
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  // Return mock admin user for development
  return {
    id: 'admin123',
    role: 'admin',
    name: 'Administrator',
    email: 'admin@university.edu',
    universityCode: 'GYAN001'
  };
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.role === 'admin' || user.role === 'superadmin');
};

export const isStudent = () => {
  const user = getCurrentUser();
  return user && user.role === 'student';
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('universityCode');
  // Redirect to login page
  window.location.href = '/auth/login';
};

export const login = (userData, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  if (userData.universityCode) {
    localStorage.setItem('universityCode', userData.universityCode);
  }
};
