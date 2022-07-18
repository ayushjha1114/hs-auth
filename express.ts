import router from './app/routes';
import boom from 'express-boom';
//import  expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import correlator from 'express-correlation-id';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './docs/swagger/swagger.json'
import errorHandlers from './app/helper/errorHandler';
import nocache from 'nocache';
import compression from 'compression';

class App {
  // ref to Express instance
  public express: express.Application;
  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(passport.initialize());

    // required for passport to initlize it
    //this.express.use(expressSession({ secret: 'bla bla' }));

    // this.express.use(passport.session());
    // initlize session
    this.express.use(logger('dev'));
    this.express.disable('x-powered-by');
    this.express.disable('etag');
    this.express.use(helmet());
    this.express.use(nocache());
    this.express.use(compression());

    this.express.use(boom());
    // this.express.use(helmet.noCache({ noEtag: true })); // set Cache-Control header
    this.express.use(helmet.noSniff()); // set X-Content-Type-Options header
    this.express.use(helmet.frameguard()); // set X-Frame-Options header
    this.express.use(helmet.xssFilter()); // set X-XSS-Protection header
    // logger logs on console
    this.express.use(bodyParser.urlencoded({ extended: false, limit: '5mb' })); // parse application/x-www-form-urlencoded
    this.express.use(bodyParser.json()); // parse application/json
    // enable CORS
    this.express.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, Referer');
      next();
    });
    // register all custom Middleware
    this.express.use(cors({ optionsSuccessStatus: 200 }));
    this.express.use(cookieParser()); // cookies-parser
    // manage session by cookies
    this.express.set('views', path.join(__dirname, 'views')); // setting views
    this.express.set('view engine', 'hbs');
    // server side template rendering
    this.express.use(express.static(path.join(__dirname, 'public')));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(correlator());
  }

  // Configure API endpoints.
  private routes(): void {
    // passport.serializeUser((user, done) => {
    //   done(null, user);
    // });
    // passport.deserializeUser((user, done) => {
    //   done(null, user);
    // });
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    this.express.use('/auth/api/v1', router);
    this.express.use('/auth/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.express.use(errorHandlers.internalServerError);
    this.express.use(errorHandlers.PageNotFound);
  }
}

export default new App().express;