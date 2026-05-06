/**
 * Global Error Handler
 * Centralized error handling for unhandled promise rejections and global errors
 */

import { createLogger } from './logger';

const logger = createLogger('GlobalErrorHandler');

export const setupGlobalErrorHandlers = () => {
  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', {
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack,
    });

    // Prevent the default handling (which would log to console)
    event.preventDefault();
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    logger.error('Global Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Handle API authentication errors
  window.addEventListener('unauthorized', () => {
    logger.warn('User unauthorized - redirecting to login');
    window.location.href = '/login';
  });
};

export default setupGlobalErrorHandlers;
