/**
 * Logging Service
 * Centralized logging with environment-aware levels
 */

import { config } from '../config/env';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const logLevelValue = LOG_LEVELS[config.logging.level.toUpperCase()] ?? LOG_LEVELS.INFO;

class Logger {
  constructor(name) {
    this.name = name;
  }

  _shouldLog(level) {
    return LOG_LEVELS[level] <= logLevelValue;
  }

  _format(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.name}] [${level}]`;
    return { prefix, message, data };
  }

  _log(level, message, data = null) {
    if (!this._shouldLog(level)) return;

    const { prefix, message: msg, data: d } = this._format(level, message, data);

    if (config.logging.enableConsole) {
      const consoleMethod = level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log';
      if (d) {
        console[consoleMethod](`${prefix} ${msg}`, d);
      } else {
        console[consoleMethod](`${prefix} ${msg}`);
      }
    }

    // Send critical errors to monitoring service in production
    if (config.isProduction && level === 'ERROR') {
      this._sendToMonitoring(msg, d);
    }
  }

  _sendToMonitoring(message, data) {
    // Implement monitoring service integration (e.g., Sentry, LogRocket)
    const payload = { message, data };
    void payload;
    try {
      // Example: Send to monitoring service
      // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(payload) });
    } catch {
      // Silently fail to avoid error loops
    }
  }

  debug(message, data) {
    this._log('DEBUG', message, data);
  }

  info(message, data) {
    this._log('INFO', message, data);
  }

  warn(message, data) {
    this._log('WARN', message, data);
  }

  error(message, data) {
    this._log('ERROR', message, data);
  }
}

export const createLogger = (name) => new Logger(name);
export default Logger;
