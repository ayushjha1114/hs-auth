const { Op } = require("sequelize");
import db from "../models";
const UserProfile = db.user_profile;
const AMC = db.amc;

export const UserService = {

    async getAllUserBySearchTerm(searchTerm : string, userType: any){
        let searchTermForQuery = '%'+searchTerm.toLocaleLowerCase()+'%';

        const response = await UserProfile.findAll({
            include: { model: AMC, as: 'amcDetail' },
            where: {
              [Op.or]: [
                { first_name: {[Op.like]: searchTermForQuery } },
                { middle_name: {[Op.like]: searchTermForQuery } },
                { last_name: {[Op.like]: searchTermForQuery } }
              ]
            }
          });
          const userDetail: any = JSON.parse(JSON.stringify(response, null, 2));
          //return [{Id:userID,name: firstname+middlename+lastName,isAmc:Boolean}]

    }
}