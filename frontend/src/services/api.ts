import axios from 'axios';
import { AuthResponse, LoginCredentials, SignupData, Task, TaskRequest, TaskStats } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  signup: async (userData: SignupData): Promise<string> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

export const taskAPI = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  getTasksByStatus: async (status: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/status/${status}`);
    return response.data;
  },

  searchTasks: async (keyword: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/search?keyword=${keyword}`);
    return response.data;
  },

  createTask: async (taskData: TaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: TaskRequest): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};

export default api;