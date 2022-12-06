/**
 * @file user.service
 * @description defines user service methods
*/
import { AuthModel } from '../models/authModel';

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

}

