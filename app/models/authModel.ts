/**
 * @file auth model
 * @description defines auth model methods
*/
import logger from '../lib/logger';
import pool from '../lib/postgresql';
export const AuthModel = {
    async getUserById(login_id: any) {
        const client = await pool.connect();
        const sqlStatement = `SELECT u.id,u.name,u.email,u.mobile,u.type,u.password,d.status FROM user_profile AS u INNER JOIN distributor_master AS d ON u.id = d.profile_id WHERE u.id='${login_id}' AND d.deleted = false`;

        const { rows } = await client.query(sqlStatement);

        client.release();
        return rows;
    },
    async updatePassword({ hash, login_id }) {
        const client = await pool.connect();
        const updateSql = `UPDATE user_profile SET password = '${hash}' WHERE id='${login_id}' RETURNING *`;
        const { rows } = await client.query(updateSql);
        client.release();
        return rows;
    },
    async getSessionLogs(data) {
        const { type = '', from, to, login_id, search } = data;

        const client = await pool.connect();
        let commonSqlStatement = `SELECT * FROM session_log`;

        let sqlStatement = `${commonSqlStatement} WHERE ((login_time BETWEEN '${from}' AND '${to}')
                            OR (failed_attempt_time BETWEEN '${from}' AND '${to}') OR (logout_time BETWEEN '${from}' AND '${to}'))`;
        if (type === 'success') {
            sqlStatement = `${commonSqlStatement} WHERE ((login_time BETWEEN '${from}' AND '${to}') OR (logout_time BETWEEN '${from}' AND '${to}')) AND failed_attempts_count=0`;
        } else if (type === 'failure') {
            sqlStatement = `${commonSqlStatement} WHERE failed_attempts_count!=0 AND failed_attempt_time BETWEEN '${from}' AND '${to}'`;
        } else if (type === 'active') {
            sqlStatement = `${commonSqlStatement} WHERE ${login_id ? `login_id='${login_id}'` : ''} ${login_id ? 'AND' : ''} failed_attempts_count=0 AND login_time BETWEEN '${from}' AND '${to}'`;
        }

        if (search) {
            sqlStatement += ` AND login_id ILIKE '%${search}%'`;
        }
        const { rows } = await client.query(sqlStatement);
        client.release();
        return rows;
    },
    async getTotalSessionLogsCount(data) {
        const { type = '', from, to, login_id, search } = data;

        const client = await pool.connect();
        let commonSqlStatement = `SELECT count(id) FROM session_log`;

        let sqlStatement = `${commonSqlStatement} WHERE ((login_time BETWEEN '${from}' AND '${to}')
                            OR (failed_attempt_time BETWEEN '${from}' AND '${to}') OR (logout_time BETWEEN '${from}' AND '${to}'))`;
        if (type === 'success') {
            sqlStatement = `${commonSqlStatement} WHERE failed_attempts_count=0 AND ((login_time BETWEEN '${from}' AND '${to}') OR (logout_time BETWEEN '${from}' AND '${to}'))`;
        } else if (type === 'failure') {
            sqlStatement = `${commonSqlStatement} WHERE failed_attempts_count!=0 AND failed_attempt_time BETWEEN '${from}' AND '${to}'`;
        } else if (type === 'active') {
            sqlStatement = `${commonSqlStatement} WHERE ${login_id ? `login_id='${login_id}'` : ''} ${login_id ? 'AND' : ''} failed_attempts_count=0 AND login_time BETWEEN '${from}' AND '${to}'`;
        }

        if (search) {
            sqlStatement += ` AND login_id ILIKE '%${search}%'`;
        }
        const { rows } = await client.query(sqlStatement);

        client.release();
        return rows;
    },
    async getLastFailedAttemptCount(login_id) {

        const client = await pool.connect();
        let sqlStatement = `SELECT * FROM session_log WHERE login_id='${login_id}'`;

        const { rows } = await client.query(sqlStatement);

        client.release();
        return rows;
    },
    async insertSession(data) {
        const { failedAttemptCount, login_id, UUID } = data;

        const client = await pool.connect();
        let insertStatement = '';

        if (!failedAttemptCount && failedAttemptCount !== 0) {
            insertStatement = `INSERT INTO session_log (login_id,logout_time,correlation_id) 
                               VALUES ('${login_id}', CURRENT_TIMESTAMP, '${UUID}');`;
        } else {
            if (failedAttemptCount === 0) {
                insertStatement = `INSERT INTO session_log (login_id,login_time,failed_attempts_count,correlation_id) 
                                   VALUES ('${login_id}', CURRENT_TIMESTAMP, ${failedAttemptCount}, '${UUID}');`;
            } else {
                insertStatement = `INSERT INTO session_log (login_id,failed_attempts_count,failed_attempt_time,correlation_id) 
                                   VALUES ('${login_id}', ${failedAttemptCount}, CURRENT_TIMESTAMP, '${UUID}');`;
            }
        }
        const insertResponse = await client.query(insertStatement);

        client.release();
        return insertResponse;
    },
    async getSSOUserDetail(emailId) {
        const client = await pool.connect();
        const sqlStatement = `SELECT * FROM sales_hierarchy_details WHERE LOWER(email) = LOWER('${emailId}') AND deleted=false AND status='ACTIVE'`;

        const { rows } = await client.query(sqlStatement);

        client.release();
        return rows;
    },
    async fetchAppLevelSettings(roles?: string | undefined) {
        logger.info(`inside authModel.fetchAppLevelSettings`);
        const client = await pool.connect();
        try {
            let sqlStatement = '';
            if (roles && roles === 'SUPER_ADMIN') {
                sqlStatement = `SELECT a.key,a.value,a.updated_by,a.remarks,a.allowed_values,a.field_type,a.description,s.first_name,s.last_name,s.user_id FROM app_level_settings AS a LEFT JOIN sales_hierarchy_details AS s ON a.updated_by = s.user_id ORDER BY a.key ASC`;
            } else {
                sqlStatement = `SELECT key, value FROM app_level_settings`;
            }
            const { rows } = await client.query(sqlStatement);
            client.release();
            return rows;
        } catch (error) {
            logger.error(`error in authModel.fetchAppLevelSettings: `, error);
            client.release();
            return null;
        }
    },

}

