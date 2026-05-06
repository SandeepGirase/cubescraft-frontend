/**
 * API Response Handler
 * Unified response handling with type safety and error management
 */

export class ApiResponse {
  constructor(data, status, message = '') {
    this.data = data;
    this.status = status;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  isSuccess() {
    return this.status >= 200 && this.status < 300;
  }

  isError() {
    return !this.isSuccess();
  }

  getErrorMessage() {
    return this.message || 'An unexpected error occurred';
  }
}

/**
 * Handle API responses with consistent formatting
 */
export const handleApiResponse = (response) => {
  return new ApiResponse(
    response.data,
    response.status,
    response.data?.message || ''
  );
};

/**
 * Handle API errors with consistent formatting
 */
export const handleApiError = (error) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || error.message || 'Unknown error';

  return new ApiResponse(null, status, message);
};

/**
 * Format error message for user display
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (error.response?.status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }
  return error.message || 'An unexpected error occurred.';
};
