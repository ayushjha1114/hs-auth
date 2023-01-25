const jwt = require('jsonwebtoken');
import { AES, enc } from 'crypto-js';
import moment from 'moment';
import helper from '../helper/bcrypt';
import logger from '../lib/logger';
import Template from "../helper/responseTemplate";
import { SuccessMessage } from '../constant/successMessage';
import { AdminService } from '../service/AdminService';
import { ErrorMessage } from '../constant/errorMessage';
import { Request, Response } from 'express';
import { EXPIRE_TIME } from '../constant';
import Helper from '../helper';

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
        let { mobile, password: passwordHash } = body.userDetail;
        try {
            logger.info('Register user controller');
            const response: any = await AdminService.getUserByMobileEmail(mobile);
            const userData = /* JSON.parse( */JSON.stringify(response, null, 2);
            console.log("🚀 ~ file: AdminController.ts:71 ~ AdminController ~ registerUser ~ userData >>>", userData, typeof userData)

            if ((userData === 'null') || (Object.keys(userData).length === 0)) {
                logger.info('If mobile and email already not exists');
                let password = Math.random().toString(36).slice(2);
                if (passwordHash && passwordHash != null && passwordHash != "") {
                    const bytes = AES.decrypt(passwordHash, 'qwerty987secret');
                    password = bytes.toString(enc.Utf8);
                }
                const hash = helper.generateSaltValue(password);
                body.password = hash;

                const response = await AdminService.getLastUser();
                const lastUser = JSON.stringify(response, null, 2);
                console.log("🚀 ~ file: AdminController.ts:87 ~ AdminController ~ registerUser ~ lastUser", lastUser)
                console.log("🚀 ~ file: AdminController.ts:88 ~ AdminController ~ registerUser ~ body.userList.user_id ", body.userDetail)
                body.userDetail.user_id = Helper.createUniqueUserNumber(lastUser);
                console.log("🚀 ~ file: AdminController.ts:89 ~ AdminController ~ registerUser ~ Helper.createUniqueUserNumber(lastUser)", Helper.createUniqueUserNumber(lastUser))
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
            const { limit = 10, offset = 0 }: any = req.query;
            console.log("🚀 ~ file: AdminController.ts:113 ~ AdminController ~ getUserList ~ req.query", req.query)
            let response = await AdminService.getUserList(limit, offset);
            console.log("🚀 ~ file: AdminController.ts:109 ~ AdminController ~ getUserList ~ response", response)
            const { userList, amcList } = response;
            console.log("🚀 ~ file: AdminController.ts:111 ~ AdminController ~ getUserList ~ amcList", amcList)
            const [results] = await AdminService.getUserListCount();
            if (userList && userList.length > 0 && results && results.length > 0) {
                logger.info('If success getUserList', userList);
                let modifiedList = userList.map(item => {
                    item.password = '';
                    return item;
                })
                return res.json(Template.success({ rows: modifiedList, totalCount: results[0]['COUNT(id)'], amcList }, SuccessMessage.USER_LIST));
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

    static async getUserById(req: Request, res: Response) {
        try {
            logger.info('function getUserById ');
            const { id } = req.params;
            let response = await AdminService.getUserById(id);
            const user: any = JSON.parse(JSON.stringify(response, null, 2));
            console.log("🚀 ~ file: AdminController.ts:152 ~ AdminController ~ getUserById ~ user", user)
            if (user && Object.keys(user).length > 0) {
                logger.info('If success getUserById', user);
                user.userDetail.password = '';
                return res.json(Template.success({ rows: user }, SuccessMessage.USER_BY_ID));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error getUserById ${error}`);
            return res.json(Template.error());

        }
    }

    static async createBrand(req: Request, res: Response) {
        try {
            logger.info('function createBrand ');
            const { body } = req;
            let response = await AdminService.createBrand(body);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ createBrand ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success createBrand', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.BRAND_CREATED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error createBrand ${error}`);
            return res.json(Template.error());

        }
    }

    static async getBrandList(req: Request, res: Response) {
        try {
            logger.info('function getBrandList ');
            const { limit = 10, offset = 0 }: any = req.query;
            console.log("🚀 ~ file: AdminController.ts:198 ~ AdminController ~ getBrandList ~ req.query;", req.query)
            let response = await AdminService.getBrandList(limit, offset);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ getBrandList ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success getBrandList', response);
                return res.json(Template.success({ rows: response.rows, totalCount: response.totalCount }, SuccessMessage.BRAND_LIST));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error getBrandList ${error}`);
            return res.json(Template.error());

        }
    }

    static async updateBrand(req: Request, res: Response) {
        try {
            logger.info('function updateBrand ');
            const { id } = req.params;
            const { body } = req;
            console.log("🚀 ~ file: AdminController.ts:207 ~ AdminController ~ updateBrand ~ body", id, '>>>', body)
            let response = await AdminService.updateBrand(body, id);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ updateBrand ~ response", response)
            if (response && response[0] === 1) {
                logger.info('If success updateBrand', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.BRAND_UPDATE));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error updateBrand ${error}`);
            return res.json(Template.error());

        }
    }

    static async getServiceList(req: Request, res: Response) {
        try {
            logger.info('function getServiceList ');
            let response = await AdminService.getServiceList();
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ getServiceList ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success getServiceList', response);
                return res.json(Template.success({ rows: response.rows, totalCount: response.totalCount }, SuccessMessage.SERVICE_LIST));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error getServiceList ${error}`);
            return res.json(Template.error());

        }
    }

    static async createService(req: Request, res: Response) {
        try {
            logger.info('function createService ');
            const { body } = req;
            let response = await AdminService.createService(body);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ createService ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success createService', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.SERVICE_CREATED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error createService ${error}`);
            return res.json(Template.error());

        }
    }

    static async updateService(req: Request, res: Response) {
        try {
            logger.info('function updateService ');
            const { id } = req.params;
            const { body } = req;
            console.log("🚀 ~ file: AdminController.ts:207 ~ AdminController ~ updateService ~ body", id, '>>>', body)
            let response = await AdminService.updateService(body, id);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ updateService ~ response", response)
            if (response && response[0] === 1) {
                logger.info('If success updateService', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.SERVICE_UPDATE));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error updateService ${error}`);
            return res.json(Template.error());

        }
    }

    static async createTicket(req: Request, res: Response) {
        try {
            logger.info('function createTicket ');
            let { body } = req;
            const result = await AdminService.getLastTicket();
            const lastTicket = JSON.stringify(result, null, 2);
            console.log("🚀 ~ file: AdminController.ts:289 ~ AdminController ~ createTicket ~ lastTicket", lastTicket)
            body.ticket_number = Helper.createUniqueTicketNumber(lastTicket);
            body.date = moment().format('DD-MM-YYYY');
            console.log("🚀 ~ file: AdminController.ts:287 ~ AdminController ~ createTicket ~ body", body)
            let response = await AdminService.createTicket(body);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ createTicket ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success createTicket', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.TICKET_CREATED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error createTicket ${error}`);
            return res.json(Template.error());

        }
    }

    static async getTicketList(req: Request, res: Response) {
        try {
            logger.info('function getTicketList ');
            const { limit = 10, offset = 0 }: any = req.query;
            console.log("🚀 ~ file: AdminController.ts:321 ~ AdminController ~ getTicketList ~ req.query", req.query)
            let response = await AdminService.getTicketList(limit, offset);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ getTicketList ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success getTicketList', response);
                return res.json(Template.success({ rows: response.rows, totalCount: response.totalCount, paymentDetailList: response.paymentDetailList }, SuccessMessage.TICKET_LIST));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error getTicketList ${error}`);
            return res.json(Template.error());

        }
    }

    static async savePaymentDetail(req: Request, res: Response) {
        try {
            logger.info('function savePaymentDetail ');
            let { body } = req;
            console.log("🚀 ~ file: AdminController.ts:287 ~ AdminController ~ savePaymentDetail ~ body", body)
            let response = await AdminService.savePaymentDetail(body);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ savePaymentDetail ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success savePaymentDetail', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.PAYMENT_DETAIL_SAVED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error savePaymentDetail ${error}`);
            return res.json(Template.error());

        }
    }

    static async getAllPaymentDetail(req: Request, res: Response) {
        try {
            logger.info('function getAllPaymentDetail ');
            let response = await AdminService.getAllPaymentDetail();
            const paymentData: any = JSON.parse(JSON.stringify(response, null, 2));
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ getAllPaymentDetail ~ paymentData", paymentData)
            if (paymentData && Object.keys(paymentData).length > 0) {
                logger.info('If success getAllPaymentDetail', paymentData);
                return res.json(Template.success({ rows: paymentData }, SuccessMessage.TICKET_LIST));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error getAllPaymentDetail ${error}`);
            return res.json(Template.error());

        }
    }

    static async updatePaymentDetail(req: Request, res: Response) {
        try {
            logger.info('function updatePaymentDetail ');
            const { id } = req.params;
            let { body } = req;
            delete body['ticket_id'];
            console.log("🚀 ~ file: AdminController.ts:287 ~ AdminController ~ updatePaymentDetail ~ body", body)
            let response = await AdminService.updatePaymentDetail(body, id);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ updatePaymentDetail ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success updatePaymentDetail', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.PAYMENT_DETAIL_SAVED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error updatePaymentDetail ${error}`);
            return res.json(Template.error());

        }
    }

    static async updateTicket(req: Request, res: Response) {
        try {
            logger.info('function updateTicket ');
            const { id } = req.params;
            let { body } = req;
            console.log("🚀 ~ file: AdminController.ts:287 ~ AdminController ~ updateTicket ~ body", body)
            let response = await AdminService.updateTicket(body, id);
            console.log("🚀 ~ file: AdminController.ts:170 ~ AdminController ~ updateTicket ~ response", response)
            if (response && Object.keys(response).length > 0) {
                logger.info('If success updateTicket', response);
                return res.json(Template.success({ rows: response }, SuccessMessage.PAYMENT_DETAIL_SAVED));
            }
            return res.json(Template.errorMessage(ErrorMessage.USER_BY_ID_ERROR));

        } catch (error) {
            logger.error(`error updateTicket ${error}`);
            return res.json(Template.error());

        }
    }

}

export default AdminController;
