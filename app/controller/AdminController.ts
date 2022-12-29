const jwt = require('jsonwebtoken');
import { AES, enc } from 'crypto-js';
import helper from '../helper/bcrypt';
import logger from '../lib/logger';
import Template from "../helper/responseTemplate";
import { SuccessMessage } from '../constant/successMessage';
import { AdminService } from '../service/AdminService';
import { ErrorMessage } from '../constant/errorMessage';
import { Request, Response } from 'express';
import { EXPIRE_TIME } from '../constant';

class AdminController {
    static async validateAdmin(req, res) {
        const { body } = req;
        const { mobile } = body;
        try {
            logger.info('Validate admin controller');
            const userData: any = await AdminService.getUserByMobileNumber(mobile);
            console.log("🚀 ~ file: AdminController.ts ~ line 19 ~ AdminController ~ validateAdmin ~ userData", userData.rows)
    
            if (userData && userData.rows.length) {
                logger.info('Check mobile number exists');

                // if (userData.rows[0].role !== 'ADMIN') {
                //     return res.status(403).json(Template.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                // } else {
                    const buildTokenPayload = {
                        id: userData.rows[0].id,
                        name: `${userData.rows[0].first_name} ${userData.rows[0].last_name}`,
                        email: userData.rows[0].email,
                        mobile: userData.rows[0].mobile,
                        role: userData.rows[0].role
                    };
                    const bytes = AES.decrypt(body.password, 'qwerty987secret');
                    const decryptedPassword = bytes.toString(enc.Utf8);
                    console.log("🚀 ~ file: AdminController.ts:39 ~ AdminController ~ validateAdmin ~ userData.rows[0].password", userData.rows[0].password)
                    console.log("🚀 ~ file: AdminController.ts:36 ~ AdminController ~ validateAdmin ~ decryptedPassword", decryptedPassword)
        
                    const flag = helper.comparePassword(decryptedPassword, userData.rows[0].password);
    
                    if (flag) {
                        logger.info('If password match return true');
                        jwt.sign(helper.buildUserToken(buildTokenPayload), process.env.SECRET_KEY, { expiresIn: EXPIRE_TIME }, (tokError, token) => {
                            return res.status(200).json({
                                success: true,
                                message: SuccessMessage.LOGIN,
                                token
                            });
                        });
                    } else {
                        logger.info('If password does not match');
                        return res.status(401).json(Template.userdoesNotExist('ErrorMessage.INVALID_CREDS'));
                    }
                // }
            }
            else {
                logger.info('If mobile number does not match');
                return res.status(404).json(Template.userdoesNotExist('ErrorMessage.NOT_FOUND_BY_ID'));
            }
        } catch (error) {
            logger.error(`Error in login:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, ErrorMessage.LOGIN_ERROR));
        }
    }
    
    static async registerUser(req, res) {
        const { body } = req;
        const { mobile, email } = body;
        try {
            logger.info('Validate user controller');
            const userData: any = await AdminService.getUserByMobileEmail(mobile, email);

            if (userData && userData.rows.length === 0 && userData.rowCount === 0) {
                logger.info('mobile and email not exists');
                const result: any = await AdminService.insertNewUser(body);
                if (result.rowCount === 1) {
                    return res.json(Template.successMessage(SuccessMessage.PASSWORD_UPDATED));
                } else {
                    return res.status(400).json(Template.errorMessage(ErrorMessage.REGISTER_ERROR_INSERT));
                }
            }
            else {
                logger.info('mobile and email already exists');
                return res.status(404).json(Template.userdoesNotExist('ErrorMessage.NOT_FOUND_BY_ID'));
            }
        } catch (error) {
            logger.error(`Error in login:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, ErrorMessage.LOGIN_ERROR));
        }
    }

    static async getUserList(req: Request, res: Response) {
        try {
            logger.info('function getUserList ');
            const { limit, offset } = req.body;
            // const { role } = req.user;
            const role = 'USER';
            let userList = await AdminService.getUserList(role, limit, offset);
            let userCount = await AdminService.getUserListCount(role);
            if (userList && userList.rows.length > 0 && userList.rowCount !== 0) {
                logger.info('If success getUserList', userList && userList.rowCount);
                let modifiedList = userList.rows.map(item => {
                    item.password = '';
                    return item;
                })
                return res.json(Template.success({ rowCount: userList.rowCount, 
                    rows: modifiedList, totalCount: userCount.rows[0].count }, 'SuccessMessage.USER_LIST'));
            }
            return res.json(Template.errorMessage('ErrorMessage._LIST_ERROR'));

        } catch (error) {
            logger.error(`error getUserList ${error}`);
            return res.json(Template.error());

        }
    }

    static async updateUserDetail(req: Request, res: Response) {
        try {
            logger.info('function updateUserDetail');
            const { body } = req;
            let userData = await AdminService.updateUserDetail(body);
            if (userData) {
                logger.info('If success getuserData', userData && userData.rowCount);
                return res.json(Template.success({ rows: userData.rows }, 'SuccessMessage.USER_LIST'));
            }
            return res.json(Template.errorMessage('ErrorMessage._LIST_ERROR'));

        } catch (error) {
            logger.error(`error getUserList ${error}`);
            return res.json(Template.error());

        }
    }

}

export default AdminController;
