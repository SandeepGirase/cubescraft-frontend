/**
 * Custom React Hooks
 */

import { useEffect, useState, useCallback } from 'react';
import { useLoading } from '../context/LoadingContext';
import api from '../api/axiosConfig';

/**
 * useFetch Hook - Fetch data from API
 * @param {string} url - API endpoint
 * @param {object} options - Axios options
 * @returns {object} - { data, loading, error, refetch }
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useLoading();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    startLoading('Loading...');

    try {
      const response = await api.get(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [url, options, startLoading, stopLoading]);

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * useMutation Hook - Mutate data (POST, PUT, DELETE)
 * @param {function} mutationFn - Async function to execute
 * @returns {object} - { mutate, loading, error, data }
 */
export const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { startLoading, stopLoading } = useLoading();

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      startLoading('Processing...');

      try {
        const result = await mutationFn(...args);
        setData(result);
        setError(null);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
        stopLoading();
      }
    },
    [mutationFn, startLoading, stopLoading]
  );

  return { mutate, loading, error, data };
};

/**
 * useLocalStorage Hook - Persist state in localStorage
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {array} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * useDebounce Hook - Debounce a value
 * @param {*} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {*} - Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle Hook - Throttle a callback
 * @param {function} callback - Function to throttle
 * @param {number} delay - Throttle delay in ms
 * @returns {function} - Throttled function
 */
export const useThrottle = (callback, delay = 500) => {
  const [canCall, setCanCall] = useState(true);

  return useCallback(
    (...args) => {
      if (canCall) {
        callback(...args);
        setCanCall(false);
        setTimeout(() => setCanCall(true), delay);
      }
    },
    [callback, delay, canCall]
  );
};

/**
 * useAsync Hook - Handle async operations
 * @param {function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Execute immediately
 * @returns {object} - { data, loading, error, execute }
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading: status === 'pending', error, execute };
};

/**
 * usePrevious Hook - Get previous state/prop value
 * @param {*} value - Value to track
 * @returns {*} - Previous value
 */
export const usePrevious = (value) => {
  const ref = useState(null)[1];
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    setPrev(ref.current);
    ref.current = value;
  }, [value]);

  return prev;
};
