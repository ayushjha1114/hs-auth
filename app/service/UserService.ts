const { Op } = require("sequelize");
import db from "../models";
const UserProfile = db.user_profile;
const AMC = db.amc;

export const UserService = {

    async getAllUserBySearchTerm(searchTerm : string, isTypeCustomer: any){
      let searchTermForQuery = '%'+searchTerm.toLocaleLowerCase()+'%';
      const role = isTypeCustomer ? ['AMC', 'USER']: ['ENGINEER']
      console.log("🚀 ~ file: AdminService.ts:43 ~ getAllUserBySearchTerm ~ search:", searchTerm, isTypeCustomer, {typ: isTypeCustomer} , role)

      const response = await UserProfile.findAll({
          include: { model: AMC },
          where: {
              role: role,
              [Op.or]: [
                  { first_name: {[Op.like]: searchTermForQuery } },
                  { middle_name: {[Op.like]: searchTermForQuery } },
                  { last_name: {[Op.like]: searchTermForQuery } }
              ]
          }
        });
        const userDetail: any = JSON.parse(JSON.stringify(response, null, 2));
        return userDetail;
    }
}