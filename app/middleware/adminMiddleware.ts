require('dotenv').config();
import jwtDecode from 'jwt-decode';
const adminConfig = global['configuration'].admin;
import responseTemplate from '../helper/responseTemplate';
import { AdminService } from '../service/AdminService';
import { ErrorMessage } from '../constant/errorMessage';
import logger from '../lib/logger';

const validation: any = {
    async validateToken(req, res, next) {
        try {
            logger.info('Admin Middleware');
            const token = req.headers.authorization;
            // logger.info('Admin Middleware token', token);
            if (token) {
                const payload: any = jwtDecode(token);
                logger.info('Admin Middleware payload', payload);
                if (!payload || payload.client_id !== adminConfig.cognitoClientId) {
                    logger.error(`Admin Middleware If client id does not match`);

                    res.status(403).json(responseTemplate.commonAuthUserDataError());
                } else {
                    const username = payload.username;
                    const email = username ? username.replace(adminConfig.cognitoIdpName, '') : '';
                    let adminDetails: any = await AdminService.adminDetailsStatement(email);
                    logger.info('Admin Middleware adminDetails', adminDetails && adminDetails.rows);

                    // console.log(adminDetails && adminDetails.rows);
                    if (adminDetails && adminDetails.rows && adminDetails.rows.length) {
                        // console.log('hereeer6');
                        adminDetails = adminDetails.rows;
                        const adminRole = adminDetails[0].roles;
                        const adminId = adminDetails[0].user_id;
                        const adminCode = adminDetails[0].code;
                        const distributorId = req.params.distributor_id;
                        req.user = adminDetails[0];
                        req.user.login_id = distributorId;
                        if (adminRole === 'SUPER_ADMIN') {
                            logger.info('Admin Middleware Super admin');
                            if (distributorId) {
                                let validated = false;
                                const validateAdminResponse = await AdminService.validateSuperAdminStatement(distributorId);
                                logger.info('Admin Middleware Super admin', validateAdminResponse && validateAdminResponse.rows);
                                if (validateAdminResponse && validateAdminResponse.rows && validateAdminResponse.rows.length) {
                                    validated = true;
                                }
                                if (validated) next();
                                else res.status(403).json(responseTemplate.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                            } else next();
                        } else if (adminRole === 'DIST_ADMIN' || adminRole === 'TSE') {
                            logger.info('Admin Middleware Dist admin/tse');
                            if (distributorId) {
                                const validateAdminResponse = await AdminService.validateDistAdminOrTseStatement(adminId, distributorId);
                                logger.info('Dist admin/tse validation response: ', validateAdminResponse);
                                if (validateAdminResponse && validateAdminResponse.length) {
                                    next();
                                } else res.status(403).json(responseTemplate.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                            } else next();
                        } else {
                            res.status(403).json(responseTemplate.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                        }
                    } else {
                        res.status(403).json(responseTemplate.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                    }
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
