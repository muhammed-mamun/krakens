import axios, { AxiosError } from 'axios';
import type { 
  AuthResponse, 
  Domain, 
  APIKey, 
  RealtimeStats, 
  OverviewStats,
  DomainSettings,
  TrackEventRequest,
  TrackEventResponse
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const register = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { email, password });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

// Domains
export const getDomains = () => api.get<Domain[]>('/domains');
export const getDomainById = (id: string) => api.get<Domain>(`/domains/${id}`);
export const createDomain = (domain: string) => api.post<Domain>('/domains', { domain });
export const updateDomain = (id: string, settings: Partial<DomainSettings>) =>
  api.put<Domain>(`/domains/${id}`, { settings });
export const deleteDomain = (id: string) => api.delete(`/domains/${id}`);

// API Keys
export const getAPIKeys = () => api.get<APIKey[]>('/api-keys');
export const createAPIKey = (domain_ids: string[]) =>
  api.post<APIKey>('/api-keys', { domain_ids });
export const revokeAPIKey = (id: string) => api.delete(`/api-keys/${id}`);

// Stats
export const getRealtimeStats = (domainId: string) =>
  api.get<RealtimeStats>('/stats/realtime', { params: { domain_id: domainId } });
export const getOverviewStats = (domainId: string) =>
  api.get<OverviewStats>('/stats/overview', { params: { domain_id: domainId } });

// Tracking
export const trackEvent = (apiKey: string, data: TrackEventRequest) =>
  axios.post<TrackEventResponse>(`${API_URL}/api/track`, data, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  });

// Utility functions
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default api;
