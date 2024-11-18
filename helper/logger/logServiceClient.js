import clientLogService from './clientLogger.js';

const logServiceClient = {
  emergency: (message, meta = {}) => {
    clientLogService.emergency(message, meta);
  },
  alert: (message, meta = {}) => {
    clientLogService.alert(message, meta);
  },
  critical: (message, meta = {}) => {
    clientLogService.critical(message, meta);
  },
  error: (message, meta = {}) => {
    clientLogService.error(message, meta);
  },
  warning: (message, meta = {}) => {
    clientLogService.warning(message, meta);
  },
  notice: (message, meta = {}) => {
    clientLogService.notice(message, meta);
  },
  info: (message, meta = {}) => {
    clientLogService.info(message, meta);
  },
  debug: (message, meta = {}) => {
    clientLogService.debug(message, meta);
  },
  notify: (message, meta = {}) => {
    clientLogService.notify(message, meta);
  },
  custom: (level, message, meta = {}, customPath = '') => {
    clientLogService.custom(level, message, meta, customPath);
  },
};

export default logServiceClient;
