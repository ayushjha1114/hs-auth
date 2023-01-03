require('dotenv').config();
import jwtDecode from 'jwt-decode';
import responseTemplate from '../helper/responseTemplate';
import { ErrorMessage } from '../constant/errorMessage';
import logger from '../lib/logger';

const validation: any = {
    async validateToken(req, res, next) {
        try {
            logger.info('Admin Middleware');
            const token = req.headers.authorization;
            console.log("🚀 ~ file: adminMiddleware.ts:12 ~ validateToken ~ token", token)
            // logger.info('Admin Middleware token', token);
            if (token) {
                const payload: any = jwtDecode(token);
                console.log("🚀 ~ file: adminMiddleware.ts:16 ~ validateToken ~ payload", payload)
                logger.info('Admin Middleware payload', payload);
                if (payload && payload.role === 'ADMIN') {
                    logger.error(`Admin Middleware if role is admin`);
                    next();
                } else {
                    res.status(403).json(responseTemplate.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                }
            } else {
                res.status(403).json(responseTemplate.tokenRequiredAuthError());
            }
        } catch (error) {
            logger.error(`Admin Middleware ${error}`);

            res.status(403).json(responseTemplate.error('Technical Error', 'There may some error occurred in user validation'));
        }
    }
};

export default validation;
