import logService from './logger.js';

// Unified log service to handle server-side logging
const logServiceServer = {
  emergency: (message, meta = {}) => {
    logService.emergency(message, meta);
  },
  alert: (message, meta = {}) => {
    logService.alert(message, meta);
  },
  critical: (message, meta = {}) => {
    logService.critical(message, meta);
  },
  error: (message, meta = {}) => {
    logService.error(message, meta);
  },
  warning: (message, meta = {}) => {
    logService.warning(message, meta);
  },
  notice: (message, meta = {}) => {
    logService.notice(message, meta);
  },
  info: (message, meta = {}) => {
    logService.info(message, meta);
  },
  debug: (message, meta = {}) => {
    logService.debug(message, meta);
  },
  notify: (message, meta = {}) => {
    logService.notify(message, meta);
  },
  custom: (level, message, meta = {}, customPath = '') => {
    logService.custom(level, message, meta, customPath);
  },
};

export default logServiceServer;
