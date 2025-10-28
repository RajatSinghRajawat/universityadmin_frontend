import apiService from './api.js';
import { validateForm, validationSchemas } from '../utils/validationSchemas.js';

class AuthService {
  // User registration
  async register(userData) {
    const validation = validateForm(userData, validationSchemas.register);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    const response = await apiService.post('/auth/register', userData);
    
    if (response.user) {
      // Store token if provided
      if (response.token) {
        apiService.setToken(response.token);
      }
    }
    
    return response;
  }

  // User login
  async login(credentials) {
    const validation = validateForm(credentials, validationSchemas.login);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
    }

    const response = await apiService.post('/auth/login', credentials);
    
    if (response.token) {
      apiService.setToken(response.token);
    }
    
    return response;
  }

  // User logout
  async logout() {
    try {
      const response = await apiService.post('/auth/logout');
      apiService.removeToken();
      return response;
    } catch (error) {
      // Even if logout fails on server, clear local token
      apiService.removeToken();
      throw error;
    }
  }

  // Get user profile
  async getProfile(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return apiService.get(`/auth/admin/${userId}`);
  }

  // Get all available university codes
  async getUniversityCodes() {
    return apiService.get('/auth/university-codes');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.token;
  }

  // Get current token
  getToken() {
    return apiService.token;
  }

  // Refresh token (if implemented in backend)
  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh');
      if (response.token) {
        apiService.setToken(response.token);
      }
      return response;
    } catch (error) {
      // If refresh fails, remove token
      apiService.removeToken();
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
