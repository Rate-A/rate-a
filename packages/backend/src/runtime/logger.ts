import winston from 'winston';
import { ENV_CAT_GIRL_LOG_LEVEL } from '../constants';

const logger = winston.createLogger({
  level: process.env[ENV_CAT_GIRL_LOG_LEVEL] ?? 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

export abstract class Logger {
  static debug(message: string, metadata?: object) {
    logger.debug(message, metadata);
  }
  static info(message: string, metadata?: object) {
    logger.info(message, metadata);
  }
  static warn(message: string, metadata?: object) {
    logger.warn(message, metadata);
  }
  static error(message: string, metadata?: object) {
    logger.error(message, metadata);
  }
}
