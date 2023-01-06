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
            const response: any = await AdminService.getUserByMobileNumber(mobile);
            const userData = JSON.parse(JSON.stringify(response, null, 2));
    
            if (userData !== 'null') {
                logger.info('Check mobile number exists');

                // if (userData.rows[0].role !== 'ADMIN') {
                //     return res.status(403).json(Template.error('Unauthorized', ErrorMessage.PERMISSION_ISSUE));
                // } else {
                    const buildTokenPayload = {
                        id: userData.id,
                        name: `${userData.first_name} ${userData.last_name}`,
                        email: userData.email,
                        mobile: userData.mobile,
                        role: userData.role
                    };
                    const bytes = AES.decrypt(body.password, 'qwerty987secret');
                    const decryptedPassword = bytes.toString(enc.Utf8);
        
                    const flag = helper.comparePassword(decryptedPassword, userData.password);
    
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
                        return res.status(401).json(Template.userdoesNotExist(ErrorMessage.INVALID_CREDS));
                    }
                // }
            }
            else {
                logger.info('If mobile number does not match');
                return res.status(404).json(Template.userdoesNotExist(ErrorMessage.USER_NOT_FOUND));
            }
        } catch (error) {
            logger.error(`Error in login:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, ErrorMessage.LOGIN_ERROR));
        }
    }
    
    static async registerUser(req, res) {
        const { body } = req;
        let { mobile, email, password:  passwordHash } = body;
        try {
            logger.info('Register user controller');
            const response: any = await AdminService.getUserByMobileEmail(mobile, email);
            const userData = JSON.parse(JSON.stringify(response, null, 2));
            
            if (userData !== 'null') {
                logger.info('If mobile and email already not exists');
                let password = Math.random().toString(36).slice(2);
                if (passwordHash && passwordHash != null && passwordHash != "") {
                    const bytes = AES.decrypt(passwordHash, 'qwerty987secret');
                    password = bytes.toString(enc.Utf8);
                }
                const hash = helper.generateSaltValue(password);
                body.password = hash;
                const result: any = await AdminService.insertNewUser(body);
                const insertedData = JSON.stringify(result, null, 2);
                if (insertedData && insertedData !== 'null') {
                    return res.json(Template.successMessage(SuccessMessage.USER_INSERTED));
                } else {
                    return res.status(400).json(Template.errorMessage(ErrorMessage.REGISTER_ERROR_INSERT));
                }
            }
            else {
                logger.info('mobile and email already exists');
                return res.status(404).json(Template.userAlreadyExist());
            }
        } catch (error) {
            logger.error(`Error in login:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, ErrorMessage.INSERT_ERROR));
        }
    }

    static async getUserList(req: Request, res: Response) {
        try {
            logger.info('function getUserList ');
            const { limit, offset } = req.body;
            // const { role } = req.user;
            const role = 'USER';
            let response = await AdminService.getUserList(role, limit, offset);
            const userList: any = JSON.parse(JSON.stringify(response, null, 2));
            const [results] = await AdminService.getUserListCount(role);
            if (userList && userList.length > 0 && results && results.length > 0) {
                logger.info('If success getUserList', userList);
                let modifiedList = userList.map(item => {
                    item.password = '';
                    return item;
                })
                return res.json(Template.success({ rows: modifiedList, totalCount: results[0]['COUNT(id)'] }, SuccessMessage.USER_LIST));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_LIST_ERROR));

        } catch (error) {
            logger.error(`error getUserList ${error}`);
            return res.json(Template.error());

        }
    }

    static async updateUserDetail(req: Request, res: Response) {
        try {
            logger.info('function updateUserDetail');
            const { body } = req;
            const [results] = await AdminService.updateUserDetail(body);
            if (results && results.affectedRows && results.changedRows) {
                logger.info('If success updateUserDetail', results);
                return res.json(Template.success({ rows: results }, SuccessMessage.USER_DETAIL_UPDATED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_DETAIL_UPDATE_ERROR));

        } catch (error) {
            logger.error(`error getUserList ${error}`);
            return res.json(Template.error());

        }
    }

}

export default AdminController;
