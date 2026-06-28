/**
 * Application Constants
 * Centralized constants for the application
 */

// API Endpoints
export const API_ENDPOINTS = {
  EMPLOYEES: '/employees',
  CLIENTS: '/clients',
  TASKS: '/tasks',
  TRACKING: '/tracking',
  AUTH: '/auth',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Application Settings
export const APP_SETTINGS = {
  APP_NAME: 'Employee Task Tracking System',
  LOGO: '/favicon.svg',
  THEME_COLOR: '#1976d2',
  VERSION: '1.0.0',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
};

// Date Format
export const DATE_FORMAT = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MM/dd/yyyy HH:mm',
};

// Timeout Values (ms)
export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
};

// Cache Keys
export const CACHE_KEYS = {
  EMPLOYEES: 'employees',
  CLIENTS: 'clients',
  TASKS: 'tasks',
  USER: 'user',
  AUTH_TOKEN: 'authToken',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  LANGUAGE: 'language',
  THEME: 'theme',
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10}$/,
  ZIPCODE: /^\d{5}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  EMPLOYEES: '/employees',
  CLIENTS: '/clients',
  TASKS: '/tasks',
  TRACKING: '/tracking',
  LOGIN: '/login',
  LOGOUT: '/logout',
  NOT_FOUND: '/404',
};

// Languages
export const LANGUAGES = {
  EN: 'en',
  DE: 'de',
};

export const LANGUAGE_NAMES = {
  en: 'English',
  de: 'Deutsch',
};
