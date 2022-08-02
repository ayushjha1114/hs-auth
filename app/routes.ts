/* eslint func-names: ["error", "never"] */
/* eslint prefer-destructuring: 0 */
import express from 'express';
const expressRouter = express.Router();
import authRoutes from './routes/authRoutes';
import defaultRoutes from './routes/defaultRoutes';

expressRouter.use('/hc-index', defaultRoutes);
expressRouter.use('/', authRoutes);
export default expressRouter;
