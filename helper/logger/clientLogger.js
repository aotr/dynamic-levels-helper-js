import axios from 'axios';

const clientLogService = {
  emergency: (message, meta = {}) => {
    console.error(`[EMERGENCY]: ${message}`, meta);
    sendLog('emergency', message, meta);
  },
  alert: (message, meta = {}) => {
    console.error(`[ALERT]: ${message}`, meta);
    sendLog('alert', message, meta);
  },
  critical: (message, meta = {}) => {
    console.error(`[CRITICAL]: ${message}`, meta);
    sendLog('critical', message, meta);
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR]: ${message}`, meta);
    sendLog('error', message, meta);
  },
  warning: (message, meta = {}) => {
    console.warn(`[WARNING]: ${message}`, meta);
    sendLog('warning', message, meta);
  },
  notice: (message, meta = {}) => {
    console.info(`[NOTICE]: ${message}`, meta);
    sendLog('notice', message, meta);
  },
  info: (message, meta = {}) => {
    console.info(`[INFO]: ${message}`, meta);
    sendLog('info', message, meta);
  },
  debug: (message, meta = {}) => {
    console.debug(`[DEBUG]: ${message}`, meta);
    sendLog('debug', message, meta);
  },
  notify: (message, meta = {}) => {
    console.log(`[NOTIFY]: ${message}`, meta);
    sendLog('notify', message, meta);
  },
  // Custom log with dynamic path
  custom: (level, message, meta = {}, customPath = '') => {
    console.log(`[${level.toUpperCase()}]: ${message}`, meta);
    sendLog(level, message, meta, customPath);
  },
};

// Helper function to send log to the server
const sendLog = async (level, message, meta = {}, customPath = '') => {
  try {
    await axios.post('/api/logs', {
      level,
      message,
      meta,
      customPath,
    });
  } catch (error) {
    console.error('Failed to send log to server:', error);
  }
};

export default clientLogService;
