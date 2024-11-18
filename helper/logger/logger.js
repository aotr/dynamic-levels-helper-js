import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { loggerEmitter } from '@/events/loggerEvents';
import { EventEmitter } from 'events';

// Increase max listeners limit to avoid memory leak warnings (optional)
EventEmitter.defaultMaxListeners = 20;

// Destructure environment variables
const {
  NODE_ENV = 'development',
  LOG_STORAGE_PATH = './storage/logs',
  LOG_MAX_SIZE = '20m',
  LOG_MAX_FILES = '7d',
} = process.env;

// Define log levels
const logLevels = {
  levels: {
    emergency: 0,
    alert: 1,
    critical: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
    notify: 8,
  },
  colors: {
    emergency: 'magenta',
    alert: 'red',
    critical: 'red',
    error: 'red',
    warning: 'yellow',
    notice: 'cyan',
    info: 'green',
    debug: 'blue',
    notify: 'white',
  },
};

// Add colors to Winston
import 'winston-daily-rotate-file'; // Ensure DailyRotateFile is registered
import { addColors } from 'winston';
addColors(logLevels.colors);

// Singleton Logger instance
let loggerInstance = null;

// Initialize the logger only once (Singleton pattern)
const initializeLogger = () => {
  if (loggerInstance) {
    return loggerInstance; // Reuse the existing logger instance if already initialized
  }

  // Ensure log directories exist
  const ensureLogDirectories = () => {
    Object.keys(logLevels.levels).forEach((level) => {
      const dir = path.join(LOG_STORAGE_PATH, level);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  };

  ensureLogDirectories();

  // Custom format to include timestamp, log level, message, origin, and stack trace
  const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Capture stack trace
    format.printf(
      ({ timestamp, level, message, stack, origin, ...metadata }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (origin) {
          log += `\nOrigin: ${origin.file}:${origin.line}:${origin.column}`;
        }
        if (stack) {
          log += `\nStack Trace:\n${stack}`;
        }
        if (Object.keys(metadata).length) {
          log += `\nMetadata: ${JSON.stringify(metadata)}`;
        }
        return log;
      },
    ),
  );

  // Initialize Winston logger
  const logger = createLogger({
    levels: logLevels.levels,
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: customFormat,
    transports: Object.keys(logLevels.levels)
      .map((level) => {
        return new DailyRotateFile({
          level,
          dirname: path.join(LOG_STORAGE_PATH, level),
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: LOG_MAX_SIZE,
          maxFiles: LOG_MAX_FILES,
          format: format.combine(format.uncolorize()),
        });
      })
      .concat([
        // Console transport for real-time logging
        new transports.Console({
          level: NODE_ENV === 'production' ? 'info' : 'debug',
          format: format.combine(format.colorize(), customFormat),
        }),
      ]),
    exitOnError: false, // Do not exit on handled exceptions
  });

  // Handle uncaught exceptions and unhandled promise rejections
  logger.exceptions.handle(
    new DailyRotateFile({
      dirname: path.join(LOG_STORAGE_PATH, 'exceptions'),
      filename: `%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: LOG_MAX_SIZE,
      maxFiles: LOG_MAX_FILES,
    }),
    new transports.Console({
      format: format.combine(format.colorize(), customFormat),
    }),
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  loggerInstance = logger; // Store the logger instance for reuse
  return logger;
};

// Extract caller's file, line, and column information
function getCallerInfo() {
  const obj = {};
  Error.captureStackTrace(obj, getCallerInfo);
  const stack = obj.stack.split('\n')[3]; // Adjust the index as needed
  const regex = /\((.*):(\d+):(\d+)\)/;
  const match = stack ? stack.match(regex) : null;
  if (match) {
    return {
      file: path.basename(match[1]),
      line: match[2],
      column: match[3],
    };
  }
  return { file: 'unknown', line: 0, column: 0 };
}

// Logger service (uses singleton logger)
const logService = {
  emergency: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().emergency(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'emergency',
      message,
      meta,
      origin: callerInfo,
    });
  },
  alert: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().alert(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'alert',
      message,
      meta,
      origin: callerInfo,
    });
  },
  critical: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().critical(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'critical',
      message,
      meta,
      origin: callerInfo,
    });
  },
  error: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().error(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'error',
      message,
      meta,
      origin: callerInfo,
    });
  },
  warning: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().warning(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'warning',
      message,
      meta,
      origin: callerInfo,
    });
  },
  notice: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().notice(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'notice',
      message,
      meta,
      origin: callerInfo,
    });
  },
  info: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().info(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'info',
      message,
      meta,
      origin: callerInfo,
    });
  },
  debug: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().debug(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'debug',
      message,
      meta,
      origin: callerInfo,
    });
  },
  notify: (message, meta = {}) => {
    const callerInfo = getCallerInfo();
    initializeLogger().notify(message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', {
      level: 'notify',
      message,
      meta,
      origin: callerInfo,
    });
  },
  // Custom log with dynamic path
  custom: (level, message, meta = {}, customPath = '') => {
    const callerInfo = getCallerInfo();
    const targetPath = customPath
      ? path.join(LOG_STORAGE_PATH, customPath)
      : path.join(LOG_STORAGE_PATH, level);

    // Ensure directory exists
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // Create a temporary logger for the custom path
    const customLogger = createLogger({
      levels: logLevels.levels,
      level: level,
      format: initializeLogger().format, // Reuse the format from the singleton
      transports: [
        new DailyRotateFile({
          level,
          dirname: targetPath,
          filename: `%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: LOG_MAX_SIZE,
          maxFiles: LOG_MAX_FILES,
          format: format.combine(format.uncolorize()),
        }),
      ],
    });

    customLogger.log(level, message, { ...meta, origin: callerInfo });
    loggerEmitter.emit('log', { level, message, meta, origin: callerInfo });
  },
};

export default logService;
