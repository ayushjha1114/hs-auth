require('dotenv').config();
import http from 'http';
// After you declare "app"
const env = process.env.NODE_ENV || 'dev'
console.log(` using ${process.env.NODE_ENV} to run application`);
global.configuration = require(`./app/config/environments/${env}`);
import App from './express';

const port = (process.env.AUTH_SERVICE_PORT);
import logger from './app/lib/logger';
import postgresql from './app/lib/postgresql';
global['connection'] = postgresql;
const server = http.createServer(App);
server.listen(process.env.AUTH_SERVICE_PORT);
server.on('error', onError);
server.on('listening', onListening);


function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const gracefulStopServer = function () {
  // Wait 10 secs for existing connection to close and then exit.
  setTimeout(() => {
    logger.info('Shutting down server');
    process.exit(0);
  }, 1000);
};

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('unhandledRejection', {
    promise,
    reason
  });
  logger.error('reason: ', reason);
  logger.error('promise: ', promise);
  process.exit(1);
});

process.on('SIGINT', gracefulStopServer);
process.on('SIGTERM', gracefulStopServer);

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}