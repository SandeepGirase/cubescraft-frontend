/**
 * Environment configuration management
 * Provides centralized access to environment variables
 */

export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL || 'debug',
    enableConsole: import.meta.env.VITE_ENABLE_CONSOLE_LOG === 'true',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;
