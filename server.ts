require('dotenv').config()
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import errorHandlers from './app/helper/errorHandler';
import nocache from 'nocache';

import customLogger from './app/lib/logger';
import router from './app/routes';

const port = process.env.AUTH_SERVICE_PORT || 3002;


const app = express();
app.use(logger('dev'));
app.disable('x-powered-by');
app.disable('etag');
app.use(helmet());
app.use(nocache());
// uncomment when server create
// app.use(express.static(path.join(__dirname, "build")));


app.use(helmet.noSniff()); // set X-Content-Type-Options header
app.use(helmet.frameguard()); // set X-Frame-Options header
app.use(helmet.xssFilter()); // set X-XSS-Protection header
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// register all custom Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(cookieParser()); // cookies-parser
// server side template rendering
app.use(express.static(path.join('public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', router);
// un comment when build create for server
// app.get('/*',(req, res) => {
//   console.log(path.join(__dirname, 'build', 'index.html'));
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.use(errorHandlers.internalServerError);
app.use(errorHandlers.PageNotFound);


const gracefulStopServer = function () {
    // Wait 10 secs for existing connection to close and then exit.
    setTimeout(() => {
      customLogger.info('Shutting down server');
      process.exit(0);
    }, 1000);
  };
  
  process.on('uncaughtException', (err) => {
    customLogger.error('Uncaught exception', err);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    customLogger.error('unhandledRejection', {
      promise,
      reason
    });
    customLogger.error('reason: ', reason);
    customLogger.error('promise: ', promise);
    process.exit(1);
  });
  
  process.on('SIGINT', gracefulStopServer);
  process.on('SIGTERM', gracefulStopServer);



app.listen(port, () => {
    console.log(`Server listening on the port  ${port} in ${process.env.NODE_ENV}`);
})
