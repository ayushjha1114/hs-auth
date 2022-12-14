require('dotenv').config();
const jwt = require('jsonwebtoken');
import { AES, enc } from 'crypto-js';
import moment from 'moment';
import helper from '../helper/bcrypt';
import logger from '../lib/logger';
import pool from '../lib/postgresql';
import responseTemplate from '../helper/responseTemplate';
import { EXPIRE_TIME } from '../constant';
import Template from "../helper/responseTemplate";
import { AuthService } from '../service/authService';
import { SuccessMessage } from '../constant/successMessage';
import { ErrorMessage } from '../constant/errorMessage';
import OtpConfig from '../config/environments/dev';

class authController {

    static async checkOtpGenerationLimit(distributorId: string, type: string) {
        const client = await pool.connect();
        try {
            logger.info('AuthController.checkOtpGenerationLimit controller');
            const retryOtpSqlStatement = `
                SELECT retry_count, retry_time FROM otp 
                WHERE distributor_id = '${distributorId}' AND type = '${type}'`;
            const { rows } = await client.query(retryOtpSqlStatement);
            if (rows && rows.length) {
                const retryCountLimit = OtpConfig.retryCountLimit ? parseInt(OtpConfig.retryCountLimit) : 5;
                const retryIntervalLimit = OtpConfig.retryIntervalLimit ? parseInt(OtpConfig.retryIntervalLimit) : 60;
                if (rows[0].retry_count && rows[0].retry_time && (parseInt(rows[0].retry_count) >= retryCountLimit)) {
                    const retryTime = moment(rows[0].retry_time);
                    const now = moment();
                    const diff = now.diff(retryTime, 'minutes');
                    if (diff >= retryIntervalLimit) {
                        const updateOtpRetrySqlStatement = `
                            UPDATE otp set retry_count = 0, retry_time = CURRENT_TIMESTAMP 
                            WHERE distributor_id = '${distributorId}' AND type = '${type}'`;
                        await client.query(updateOtpRetrySqlStatement);
                    } else {
                        const retryTimeLeft = retryTime.add(retryIntervalLimit, 'minutes').diff(now, 'minutes') + 1;
                        return { success: false, retryTimeLeft };
                    }
                }
            }
            client.release();
        } catch (error) {
            client.release();
            logger.error(`Error in AuthController.checkOtpGenerationLimit: `, error);
        }
        return { success: true };
    }

    static async checkInvalidOtpEnteredLimit(distributorId: string, type: string) {
        const client = await pool.connect();
        try {
            logger.info('AuthController.checkInvalidOtpEnteredLimit controller');
            const retryOtpSqlStatement = `
                SELECT invalid_count, invalid_time FROM otp 
                WHERE distributor_id = '${distributorId}' AND type = '${type}'`;
            const { rows } = await client.query(retryOtpSqlStatement);
            if (rows && rows.length) {
                const invalidCountLimit = OtpConfig.invalidCountLimit ? parseInt(OtpConfig.invalidCountLimit) : 5;
                const invalidIntervalLimit = OtpConfig.invalidIntervalLimit ? parseInt(OtpConfig.invalidIntervalLimit) : 60;
                if (rows[0].invalid_count && rows[0].invalid_time && (parseInt(rows[0].invalid_count) >= invalidCountLimit)) {
                    const invalidTime = moment(rows[0].invalid_time);
                    const now = moment();
                    const diff = now.diff(invalidTime, 'minutes');
                    if (diff >= invalidIntervalLimit) {
                        const updateOtpRetrySqlStatement = `
                            UPDATE otp set invalid_count = 0
                            WHERE distributor_id = '${distributorId}' AND type = '${type}'`;
                        await client.query(updateOtpRetrySqlStatement);
                    } else {
                        const retryTimeLeft = invalidTime.add(invalidIntervalLimit, 'minutes').diff(now, 'minutes') + 1;
                        return { success: false, retryTimeLeft };
                    }
                }
            }
            client.release();
        } catch (error) {
            client.release();
            logger.error(`Error in AuthController.checkInvalidOtpEnteredLimit: `, error);
        }
        return { success: true };
    }

    static async generateOtp(id: any) {
        const client = await pool.connect();
        try {
            logger.info('Generate Otp controller');
            const expireOtpSqlStatement = `
            UPDATE otp 
            SET expires_at = CURRENT_TIMESTAMP
            WHERE distributor_id = '${id}' AND expires_at >= NOW() AND type = 'RESET_PASS'`;
            await client.query(expireOtpSqlStatement);
            client.release();
        } catch (error) {
            client.release();
            logger.error(`Error in Generate OTP: `, error);
        }
        return Math.floor(100000 + Math.random() * 900000);
    }

    static async sendAndSaveOtp(otpData: { login_id: any, name: any, mobile: any, otp: any }) {
        const client = await pool.connect();
        try {
            logger.info('Send OTP Controller');
            // logic to send otp to registered mobile number and update the expiredAt & refrence in otp table
            // const otpEventResponse = await otpEvents.send_otp(otpData);
            // if (otpEventResponse.status == 202) {
            //     logger.info('If OTP send save the otp into db');
            //     const referenceCode = otpEventResponse.data.id;
            //     const sqlStatement = `
            //         INSERT INTO 
            //             otp (distributor_id, mobile_number, otp_code, refrence_code, expires_at, type, retry_count, retry_time) 
            //         VALUES 
            //             ('${otpData.login_id}', ${otpData.mobile}, ${otpData.otp}, '${referenceCode}', CURRENT_TIMESTAMP + (interval '3 minute'), 'RESET_PASS', 1, CURRENT_TIMESTAMP) 
            //         ON CONFLICT ON CONSTRAINT unique_otp DO UPDATE SET
            //             mobile_number = EXCLUDED.mobile_number, otp_code = EXCLUDED.otp_code, retry_count = otp.retry_count + 1, refrence_code = EXCLUDED.refrence_code, expires_at = EXCLUDED.expires_at
            //         RETURNING *`;
            //     const result = await client.query(sqlStatement);
            //     client.release();
            //     if (result) {
            //         logger.info('If success (otp update in db) return true');
            //         return { success: true }
            //     } else {
            //         logger.info('else fail (otp update in db) return false');
            //         return { success: false }
            //     }
            // } else {
            //     client.release();
            //     logger.info('else case (otp send failed) return false');
            //     return { success: false }
            // }
        } catch (error) {
            client.release();
            logger.error(`Error in send OTP:`, error);
            return { success: false }
        }
    }

    static async verifyOtp(otpData: { id: any, otp: any }) {
        const client = await pool.connect();
        try {
            logger.info('Verify OTP Controller');
            const otp = parseInt(otpData.otp);
            const sqlStatement = `SELECT id FROM otp WHERE distributor_id='${otpData.id}' AND otp_code=${otp} AND expires_at >= NOW() ORDER BY created_on DESC LIMIT 1`;
            const { rows } = await client.query(sqlStatement);
            const responseData = rows[0];
            if (responseData) {
                logger.info('If OTP is verified return success true');
                const invalidOtpCounterSqlStatement = `
                UPDATE otp SET invalid_count = 0
                WHERE distributor_id = '${otpData.id}' AND type = 'RESET_PASS'`;
                await client.query(invalidOtpCounterSqlStatement);
                client.release();
                return { success: true };
            } else {
                logger.info('else OTP not verified return success false');
                const invalidOtpCounterSqlStatement = `
                UPDATE otp SET invalid_count = invalid_count + 1,
                invalid_time =   
                CASE  
                    WHEN invalid_count = 0 THEN CURRENT_TIMESTAMP 
                    ELSE invalid_time
                END 
                WHERE distributor_id = '${otpData.id}' AND type = 'RESET_PASS'`;
                await client.query(invalidOtpCounterSqlStatement);
                client.release();
                return { success: false };
            }
        } catch (error) {
            client.release();
            logger.error(`Error in Verify OTP:`, error);
            return { success: false }
        }
    }


    static async getUserById(data: any) {
        const client = await pool.connect();
        try {
            logger.info('Get user details by Id Controller');
            const { id, req, res } = data;
            const { user } = req;

            if (user && user.id !== id) {
                return Template.errorMessage(ErrorMessage.UNAUTHORIZED);
            }
            const sqlStatement = `
                SELECT 
                    *
                FROM 
                    user_profile 
            `;

            const { rows } = await client.query(sqlStatement);
            const userData = rows[0];

            client.release();
            if (userData) {
                logger.info('If user details found return user details');
                return {
                    success: true,
                    msg: "User data found",
                    userData
                };
            } else {
                logger.info('If user details not found return user fails');
                return {
                    success: false,
                    msg: "User does not exist in system",
                    userData: null
                };
            }
        } catch (error) {
            client.release();
            logger.error(`Error in Get User By Id:`, error);

            return {
                success: false,
                msg: "Technical Error",
                userData: null
            };
        }
    }


    static async validateUser(req, res) {
        const UUID = req.headers['x-correlation-id'];
        const { body } = req;
        const { login_id } = body;
        let failedAttemptCount = 0;
        try {
            logger.info('Validate user controller');
            const userData: any = await AuthService.getUserById(login_id);

            if (userData && userData.length) {
                logger.info('Check login Id exist');

                if (userData[0].status === 'INACTIVE') {
                    logger.info(`If user is inactive - ${login_id}`);
                    return res.status(401).json(Template.errorMessage(ErrorMessage.USER_INACTIVE));
                }

                const buildTokenPayload = {
                    id: userData[0].id,
                    name: userData[0].name,
                    email: userData[0].email,
                    type: userData[0].type
                };
                const bytes = AES.decrypt(body.password, 'qwerty987secret');
                const decryptedPassword = bytes.toString(enc.Utf8);

                const flag = helper.comparePassword(decryptedPassword, userData[0].password);
            }
            else {
                logger.info('If Login Id does not match');
                return res.status(403).json(Template.userdoesNotExist('ErrorMessage.NOT_FOUND_BY_ID'));
            }
        } catch (error) {
            logger.error(`Error in login:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, ErrorMessage.LOGIN_ERROR));
        }
    }


    static async resetPassword(login_id, new_password, callback) {
        const client = await pool.connect();
        try {
            logger.info('Reset Password controller');
            // just generate password and send new password on mail
            const sqlStatement = `SELECT * FROM user_profile INNER JOIN distributor_master ON user_profile.id = distributor_master.profile_id WHERE user_profile.id='${login_id}' AND distributor_master.deleted = false`;
            const { rows } = await client.query(sqlStatement);
            const userData = rows;
            if (userData) {
                logger.info('If login Id exist');
                let password = Math.random().toString(36).slice(2);
                if (new_password && new_password != null && new_password != "") {
                    const bytes = AES.decrypt(new_password, 'qwerty987secret');
                    password = bytes.toString(enc.Utf8);
                }
                const hash = helper.generateSaltValue(password);
                const updateSql = `UPDATE user_profile SET password = '${hash}' WHERE id='${login_id}' RETURNING *`;
                const { rows } = await client.query(updateSql);
                const userData = rows && rows[0];
                client.release();
                if (!userData || userData.length === 0) {
                    logger.info('Error occurred while updating record');
                    callback('Error occurred while updating record');
                } else {
                    logger.info('Send the mail');
                    // mailEvents.emit("forgotPassword", userData, password);
                    callback(null, 'done');
                }
            } else {
                logger.info('User does not exist in system with this distributor id');
                callback('User does not exist in system with this distributor id');
            }
        } catch (error) {
            client.release();
            logger.error(`Error in Reset Password:`, error);
            callback('Technical Error');
        }

    }

    static async refreshToken(req, res, cb) {
        try {
            logger.info('Refresh Token controller');
            // validate token here is its valid here
            const token = req.headers.authorization;
            if (token) {
                logger.info('If token exist');
                jwt.verify(token, process.env.SECRET_KEY, (err, data) => {

                    if (err) {
                        logger.info('If token expired or invalid');
                        res.status(403).json(responseTemplate.commonAuthUserDataError());
                    } else {
                        logger.info('generate and return New token');
                        const buildTokenPayload = {
                            id: data.login_id,
                            name: data.name,
                            type: data.type
                        };
                        jwt.sign(helper.buildUserToken(buildTokenPayload), process.env.SECRET_KEY, { expiresIn: EXPIRE_TIME }, (tokError, token) => {
                            cb(null, token);
                        });
                    }
                });
            } else {
                logger.info('if token not found');
                res.status(403).json(responseTemplate.tokenRequiredAuthError());
            }
        } catch (error) {
            logger.error(`Error in Refresh Token:`, error);
            res.status(500).json(responseTemplate.error('Technical Error', 'There may some error occurred in user validation'));
        }

    }

    static async changePassword(req, res) {
        try {
            logger.info('Change Password controller', req);
            const { body, user } = req;
            const login_id = user.id;
            const { current_password, new_password } = body;

            // generate random string
            let decryptedPassword = Math.random().toString(36).slice(2);

            if (current_password && current_password !== null && current_password !== "") {
                const bytes = AES.decrypt(current_password, 'qwerty987secret');
                decryptedPassword = bytes.toString(enc.Utf8);
            }

            const userData = await AuthService.getUserById(login_id);

            // check if current_password match with stored password
            const flag = helper.comparePassword(decryptedPassword, userData[0].password);

            if (flag) {
                logger.info('If login Id exist in DB');
                let decryptedNewPassword = Math.random().toString(36).slice(2);
                if (new_password && new_password !== null && new_password !== "") {
                    const bytes = AES.decrypt(new_password, 'qwerty987secret');
                    decryptedNewPassword = bytes.toString(enc.Utf8);
                }

                if (decryptedPassword === decryptedNewPassword) {
                    logger.error(`${ErrorMessage.SAME_PASSWORD}`);
                    return res.status(400).json(Template.errorMessage(ErrorMessage.SAME_PASSWORD));
                } else {
                    const hash = helper.generateSaltValue(decryptedNewPassword);
                    const updatedRows = await AuthService.updatePassword({ hash, login_id });

                    if (!updatedRows && updatedRows.length === 0) {
                        logger.error(`${ErrorMessage.PASSWORD_NOT_UPDATED}`);
                        return res.status(400).json(Template.errorMessage(ErrorMessage.PASSWORD_NOT_UPDATED));
                    } else {
                        logger.info(`${SuccessMessage.PASSWORD_UPDATED}`);
                        return res.json(Template.successMessage(SuccessMessage.PASSWORD_UPDATED));
                    }
                }
            } else {
                logger.error(`${ErrorMessage.INCORRECT_PASSWORD}`);
                return res.status(400).json(Template.errorMessage(ErrorMessage.INCORRECT_PASSWORD));
            }
        } catch (error) {
            logger.error(`Error in change Password:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, ErrorMessage.CHANGE_PASSWORD_ERROR));
        }
    }


    static async logout(req, res) {
        try {
            const { user } = req;
            let login_id = user.id;
            logger.info('Logout controller');
            // const responseData = await AuthService.getLastFailedAttemptCount(login_id);
            // const UUID = responseData.length && responseData[responseData.length - 1].correlation_id;

            // const result = await AuthService.insertSession({ login_id, UUID });

            // if (result.rowCount === 1) {

            //     logger.info(`${SuccessMessage.LOGOUT}`);
            //     return res.json(Template.successMessage(SuccessMessage.LOGOUT));
            // }
            // else {
            //     logger.error(`${ErrorMessage.LOGOUT_ERROR_INSERT}`);
            //     return res.status(400).json(Template.errorMessage(ErrorMessage.LOGOUT_ERROR_INSERT));
            // }
        } catch (error) {
            logger.error(`Error in logout:`, error);
            return res.status(500).json(Template.error(ErrorMessage.TECHNICAL_ERROR, 'ErrorMessage.LOGOUT_ERROR_INSERT'));
        }
    }
}

export default authController;
