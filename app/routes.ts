import express from 'express';
const expressRouter = express.Router();
import defaultRoutes from './routes/defaultRoutes';
import adminRoutes from './routes/adminRoutes';

expressRouter.use('/hc-index', defaultRoutes);
expressRouter.use('/admin', adminRoutes);
export default expressRouter;
