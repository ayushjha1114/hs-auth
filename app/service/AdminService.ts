const Sequelize = require('sequelize');
import db from "../models";
const UserProfile = db.user_profile;

export const AdminService = {

    async getUserByMobileNumber(mobile: string) {
        return await UserProfile.findOne({ where : { mobile }});
    },

    async getUserByMobileEmail(mobile: string, email: string) {
        return await UserProfile.findOne({ where : { email, mobile}});
    },

    async insertNewUser(data: object) {
        return await UserProfile.create(data);
    },

    async getUserList(role: string, limit: number, offset: number) {
        return await UserProfile.findAll();
    },
    
    async getUserListCount(role: string) {
        return await db.sequelize.query("SELECT COUNT(id) FROM user_profiles");
    },

    async updateUserDetail(data: any) {
        let updateStatement = '';
        const dataKeys = Object.keys(data);
        let count = 0;
        let sqlStatement = `UPDATE user_profiles SET `;
        Object.values(data).map(item => {
            if (dataKeys[count] !== 'mobile') {
                updateStatement += ` ${dataKeys[count]} = '${item}',`;
            }
            count++;
        });
        sqlStatement += updateStatement.replace(/,\s*$/, "");
        const whereStatement = ` WHERE mobile = '${data.mobile}'`;
        sqlStatement += whereStatement;
        console.log("🚀 ~ file: AdminModel.ts:118 ~ updateUserDetail ~ sqlStatement", sqlStatement)
        return await db.sequelize.query(sqlStatement);
    },
};