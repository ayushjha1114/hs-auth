/**
 * @file user.service
 * @description defines user service methods
*/
import { AuthModel } from '../models/authModel';
import commenHelper from '../helper';
// import { BearerStrategy } from 'passport-azure-ad';
// import passport from 'passport';
// import credsConfig from '../config/SSOCreds';

export const AuthService = {
    /**
    * @param login_id - where condition
    */
    async getUserById(login_id: any) {
        return await AuthModel.getUserById(login_id);
    },

    async updatePassword({ hash, login_id }) {
        return AuthModel.updatePassword({ hash, login_id });
    },

    async getSessionLogs(data) {
        const sessionLogs = await AuthModel.getSessionLogs(data);
        const formattedLogs = sessionLogs.map(item => {
            if (item.login_time && item.login_time !== null) {
                item.login_time = commenHelper.changeDateTimeInIST(item.login_time);
            }
            if (item.logout_time && item.logout_time !== null) {
                item.logout_time = commenHelper.changeDateTimeInIST(item.logout_time)
            }
            if (item.failed_attempt_time && item.failed_attempt_time !== null) {
                item.failed_attempt_time = commenHelper.changeDateTimeInIST(item.failed_attempt_time)
            }
            return item;
        });

        return formattedLogs;
    },
    async getTotalSessionLogsCount(data) {
        return await AuthModel.getTotalSessionLogsCount(data);
    },
    async getLastFailedAttemptCount(login_id: any) {
        return await AuthModel.getLastFailedAttemptCount(login_id);
    },
    async insertSession(data) {
        return await AuthModel.insertSession(data);
    },
    async getSSOUserDetail(emailId) {
        return await AuthModel.getSSOUserDetail(emailId);
    },
    async fetchAppLevelSettings(roles?: string | undefined) {
        return await AuthModel.fetchAppLevelSettings(roles);
    },

}

