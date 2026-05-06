import axios from "axios";
import { config } from "../config/env";
import { createLogger } from "../utils/logger";

const logger = createLogger("AxiosConfig");

const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds authorization headers and logs requests in development
 */
api.interceptors.request.use(
  (request) => {
    logger.debug("API Request", {
      method: request.method,
      url: request.url,
    });

    // Add authorization token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    logger.error("Request Error", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors, logs responses, and manages authentication
 */
api.interceptors.response.use(
  (response) => {
    logger.debug("API Response", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    let errorMessage = "An error occurred";
    let errorData = {};

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      errorData = {
        status,
        url: error.config?.url,
        data: error.response.data,
      };

      if (status === 401) {
        errorMessage = "Unauthorized. Please log in.";
        localStorage.removeItem("authToken");
        window.dispatchEvent(new Event("unauthorized"));
      } else if (status === 403) {
        errorMessage = "Access forbidden.";
      } else if (status === 404) {
        errorMessage = "Resource not found.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (status >= 400) {
        errorMessage = error.response.data?.message || "Request failed.";
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = "No response from server. Check your connection.";
      errorData = { message: error.message };
    } else {
      // Error in request setup
      errorMessage = error.message || "Request setup error.";
      errorData = { message: error.message };
    }

    logger.error("API Error", {
      message: errorMessage,
      ...errorData,
    });

    return Promise.reject({
      message: errorMessage,
      ...error,
    });
  }
);

export default api;