// services/api.js
import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Login with email and password
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User services
export const userService = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Create a new user (admin only)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

// Company services
export const companyService = {
  // Get all companies (admin only) or current company
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Create a new company (admin only)
  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },
};

// Project services
export const projectService = {
  // Get all projects based on user role
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Create a new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
};

export default api;