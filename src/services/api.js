// Centralized API configuration and base service
const sanitizeBaseUrl = (value) => {
  if (!value) return '';
  const normalized = String(value).trim();
  if (!normalized || normalized === 'undefined' || normalized === 'null') return '';
  return normalized.replace(/\/+$/, '');
};

const viteBackendUrl = sanitizeBaseUrl(import.meta.env.VITE_BACKEND_URL);
const reactBackendUrl = sanitizeBaseUrl(import.meta.env.REACT_APP_API_URL);

export const backendUrl =
  viteBackendUrl || reactBackendUrl || 'https://kishangarhcollege.in';
const API_BASE_URL = `${backendUrl}/api`;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get headers for API requests
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.isFormData),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}, isFormData = false) {
    const body = isFormData ? data : JSON.stringify(data);
    
    return this.request(endpoint, {
      method: 'POST',
      body,
      isFormData,
    });
  }

  // PUT request
  async put(endpoint, data = {}, isFormData = false) {
    const body = isFormData ? data : JSON.stringify(data);
    
    return this.request(endpoint, {
      method: 'PUT',
      body,
      isFormData,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
