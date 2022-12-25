/**
 * @file admin.service
 * @description defines admin service methods
*/

import { AdminModel } from "../modelsXX/AdminModel";

export const AdminService = {

    async getUserByMobileNumber(mobile_number: string) {
        return await AdminModel.getUserByMobileNumber(mobile_number);
    },

    async getUserByMobileEmail(mobile: string, email: string) {
        return await AdminModel.getUserByMobileEmail(mobile, email);
    },

    async insertNewUser(data: object) {
        return await AdminModel.insertNewUser(data);
    },

    async getUserList(role: string, limit: number, offset: number) {

        return await AdminModel.getUserList(role, limit, offset);
    },
    
    async getUserListCount(role: string) {

        return await AdminModel.getUserListCount(role)
    },
};