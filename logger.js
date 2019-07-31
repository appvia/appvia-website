const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    format.splat(),
    label({ label: 'appvia-website' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console({ silent: process.env.NODE_ENV === 'test' })]
});

/** Example log usage
 *
 * const logger = require('./logger');
 *
 * logger.info('info statement with string %s', 'hello');
 * logger.warning('warning statement with number %d', 123);
 * logger.error('error statement with object %j', { a: 1 });
 * logger.info('log statement with string %s, number %d and stringified JSON %j', 'hello', 123, { a: 1 });
 */

module.exports = logger;
