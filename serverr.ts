require('dotenv').config()
import cookieParser from 'cookie-parser';
import passport from 'passport';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
// import correlator from 'express-correlation-id';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './docs/swagger/swagger.json'
import errorHandlers from './app/helper/errorHandler';
import nocache from 'nocache';

import router from './app/routes';

const port = process.env.AUTH_SERVICE_PORT || 3002;


const app = express();
app.use(logger('dev'));
app.disable('x-powered-by');
app.disable('etag');
app.use(helmet());
app.use(nocache());

app.use(helmet.noSniff()); // set X-Content-Type-Options header
app.use(helmet.frameguard()); // set X-Frame-Options header
app.use(helmet.xssFilter()); // set X-XSS-Protection header
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, Referer');
  next();
});
// register all custom Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(cookieParser()); // cookies-parser
// manage session by cookies
app.set('views', path.join(__dirname, 'views')); // setting views
app.set('view engine', 'hbs');
// server side template rendering
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/auth', router);
app.use('/auth/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandlers.internalServerError);
app.use(errorHandlers.PageNotFound);

app.get('/', (req, res) => {
    res.send(`<h1>API Works !!!</h1>`)
});



app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
})