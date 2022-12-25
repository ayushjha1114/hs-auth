/**
 * @file auth model
 * @description defines auth model methods
*/
import logger from '../lib/logger';
import pool from '../lib/postgresql';
export const AuthModel = {
    async getUserById(login_id: any) {
        const client = await pool.connect();
        const sqlStatement = ''

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

}

