// Ana dizin yani root (logger.js)
const { createLogger, format, transports } = require('winston');

// Log formatı: timestamp + level + message
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}] - ${info.message}`)
  ),
  transports: [
    // Konsola loglama
    new transports.Console(),

    // logs/app.log dosyasına yaz
    new transports.File({ filename: 'logs/app.log' }),
  ],
});

module.exports = logger;
