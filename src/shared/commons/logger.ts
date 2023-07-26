import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    // timestamp format
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    // log format
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    // showing log on console
    new winston.transports.Console(),
    // managing log file
    new DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log', // format filename
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // compressing old log files
      maxSize: '10m', // max file size before rotated
      maxFiles: '14d' // 14 Days saved
    })
  ]
});

export default logger;
