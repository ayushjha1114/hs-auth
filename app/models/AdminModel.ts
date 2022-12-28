/**
 * @file admin.model
 * @description defines admin model methods
*/

import pool from '../lib/postgresql';
import logger from '../lib/logger';

export const AdminModel = {

    async getUserByMobileNumber(mobile_number: string) {
        logger.info(`inside model AdminModel.getUserByMobileNumber`);
        const client = await pool.connect();
        try {
            const sqlStatement = `SELECT id, first_name, last_name, email, mobile, role, password FROM user_profile WHERE mobile = '${mobile_number}'`;
            const rows = await client.query(sqlStatement);
            client.release();
            return rows
        } catch (error) {
            logger.error(`error in AdminModel.getUserByMobileNumber: `, error);
            client.release();
            return null;
        }

    },

    async getUserByMobileEmail(mobile: string, email: string) {
        logger.info(`inside model AdminModel.getUserByMobileEmail`);
        const client = await pool.connect();
        try {
            const sqlStatement = `SELECT first_name, last_name, email, mobile, role FROM user_profile WHERE mobile = '${mobile}' AND email = '${email}'`;
            console.log("🚀 ~ file: AdminModel.ts:33 ~ getUserByMobileEmail ~ sqlStatement", sqlStatement)
            const rows = await client.query(sqlStatement);
            client.release();
            return rows
        } catch (error) {
            logger.error(`error in AdminModel.getUserByMobileEmail: `, error);
            client.release();
            return null;
        }

    },

    async insertNewUser(data) {
        const { first_name, middle_name = null, last_name = null, mobile, email, 
            password, date_of_birth, gender = null, role = 'USER', current_address = null, permanent_address = null, 
            current_state = null, current_city = null, current_pincode = null, permanent_state = null, permanent_city = null, permanent_pincode = null, aadhaar_number = null } = data;

        const client = await pool.connect();
        try {
            let insertStatement = `INSERT INTO user_profile (first_name, middle_name, last_name, mobile, email, 
                password, date_of_birth, gender, role, current_address, permanent_address, 
                current_state, current_city, current_pincode, permanent_state, permanent_city, permanent_pincode, aadhaar_number) 
                                   VALUES ('${first_name}', '${middle_name}', '${last_name}', '${mobile}', '${email}', 
                                    '${password}', '${date_of_birth}', '${gender}', '${role}', '${current_address}', '${permanent_address}', 
                                        '${current_state}', '${current_city}', '${current_pincode}', '${permanent_state}', '${permanent_city}', 
                                            '${permanent_pincode}', '${aadhaar_number}');`;

            const insertResponse = await client.query(insertStatement);
            client.release();
            return insertResponse;
        } catch (error) {
            logger.error(`error in AdminModel.insertNewUser: `, error);
            client.release();
            return null;
        }
    },

    async getUserList(role, limit = 10, offset = 0) {
        logger.info(`inside model AdminModel.getUserList`);
        const client = await pool.connect();
        try {
            let sqlStatement = `SELECT first_name, last_name, email, mobile, role FROM user_profile WHERE role = '${role}'`;
            const limitOffset = ` ORDER BY id LIMIT ${limit} OFFSET ${offset} `;
            sqlStatement += limitOffset;
            const rows = await client.query(sqlStatement);
            client.release();
            return rows
        } catch (error) {
            logger.error(`error in AdminModel.getUserList: `, error);
            client.release();
            return null;
        }

    },

    async getUserListCount(role: string) {
        logger.info(`inside model AdminModel.getUserListCount`);
        const client = await pool.connect();
        try {
            const sqlStatement = `SELECT COUNT(id) FROM user_profile WHERE role = '${role}'`;
            const rows = await client.query(sqlStatement);
            client.release();
            return rows
        } catch (error) {
            logger.error(`error in AdminModel.getUserListCount: `, error);
            client.release();
            return null;
        }

    },
};