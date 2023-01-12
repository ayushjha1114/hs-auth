const Sequelize = require('sequelize');
import db from "../models";
const UserProfile = db.user_profile;
const AMC = db.amc;
const Brand = db.brand;
const Service = db.service;
const Ticket = db.ticket;
const PaymentDetail = db.payment_detail;

export const AdminService = {

    async getUserByMobileNumber(mobile: string) {
        return await UserProfile.findOne({ where: { mobile } });
    },

    async getUserByMobileEmail(mobile: string, email: string) {
        return await UserProfile.findOne({ where: { email, mobile } });
    },

    async insertNewUser(data: any) {
        let result: any = {};
        const response = await UserProfile.create(data.userDetail);
        console.log("🚀 ~ file: AdminService.ts:17 ~ insertNewUser ~ response", response)
        const insertedUserProfileData: any = JSON.parse(JSON.stringify(response, null, 2));
        result.userDetail = insertedUserProfileData;

        console.log("🚀 ~ file: AdminService.ts:20 ~ insertNewUser ~ insertedUserProfileData", insertedUserProfileData)
        const user_id = insertedUserProfileData.id;
        console.log("🚀 ~ file: AdminService.ts:22 ~ insertNewUser ~ user_id", user_id)
        console.log("🚀 ~ file: AdminService.ts:25 ~ insertNewUser ~ data.amcDetails", data.amcDetail)
        if (data.userDetail.role === 'AMC') {
            const response = await AMC.create({ ...data.amcDetail, user_profile_id: user_id });
            const insertedAMCData: any = JSON.parse(JSON.stringify(response, null, 2));
            console.log("🚀 ~ file: AdminService.ts:23 ~ insertNewUser ~ response", insertedAMCData)
            result.amcDetail = insertedAMCData;
        }
        return result;
    },

    async getUserList(role: string, limit: number, offset: number) {
        return await UserProfile.findAll();
    },

    async getUserListCount(role: string) {
        return await db.sequelize.query("SELECT COUNT(id) FROM user_profiles");
        //SELECT COUNT(U.id) FROM user_profiles AS U INNER JOIN amcs AS A ON A.user_profile_id = U.id;

    },

    async getUserById(id) {
        let result: any = {};
        const response = await UserProfile.findOne({ where: { id } })
        const userData: any = JSON.parse(JSON.stringify(response, null, 2));
        result.userDetail = userData;
        console.log("🚀 ~ file: AdminService.ts:49 ~ getUserById ~ insertedAMCData", userData)
        const amcResponse = await AMC.findOne({ where: { user_profile_id: userData.id } })
        const amcData: any = JSON.parse(JSON.stringify(amcResponse, null, 2));
        console.log("🚀 ~ file: AdminService.ts:53 ~ getUserById ~ amcData", amcData)
        result.amcDetail = amcData;
        return result;
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

    async createBrand(data: any) {
        const response = await Brand.create(data);
        console.log("🚀 ~ file: AdminService.ts:80 ~ createBrand ~ response", response)
        const insertedBrandData: any = JSON.parse(JSON.stringify(response, null, 2));
        console.log("🚀 ~ file: AdminService.ts:82 ~ createBrand ~ insertedBrandData", insertedBrandData)
        return insertedBrandData;
    },

    async getBrandList() {
        const response = await Brand.findAll();
        console.log("🚀 ~ file: AdminService.ts:80 ~ getBrandList ~ response", response)
        const insertedBrandData: any = JSON.parse(JSON.stringify(response, null, 2));
        console.log("🚀 ~ file: AdminService.ts:82 ~ getBrandList ~ insertedBrandData", insertedBrandData)
        return insertedBrandData;
    },

    async updateBrand(data: any, id) {
        const result = await Brand.update(
            data,
            { where: { id } }
        )
        console.log("🚀 ~ file: AdminService.ts:99 ~ updateBrand ~ result", result)
        return result;
    },

    async getServiceList() {
        let serviceList: any = {};
        const response = await Service.findAll();
        console.log("🚀 ~ file: AdminService.ts:80 ~ getServiceList ~ response", response)
        const serviceData: any = JSON.parse(JSON.stringify(response, null, 2));
        const [results] = await db.sequelize.query("SELECT COUNT(id) FROM services");
        console.log("🚀 ~ file: AdminService.ts:109 ~ getServiceList ~ serviceCount", results[0]['COUNT(id)'])
        console.log("🚀 ~ file: AdminService.ts:82 ~ getServiceList ~ serviceData", serviceData)
        serviceList.rows = serviceData;
        serviceList.totalCount = results[0]['COUNT(id)']
        return serviceList;
    },

    async createService(data: any) {
        const response = await Service.create(data);
        console.log("🚀 ~ file: AdminService.ts:80 ~ createService ~ response", response)
        const insertedServiceData: any = JSON.parse(JSON.stringify(response, null, 2));
        console.log("🚀 ~ file: AdminService.ts:82 ~ createService ~ insertedServiceData", insertedServiceData)
        return insertedServiceData;
    },

    async updateService(data: any, id) {
        const result = await Service.update(
            data,
            { where: { id } }
        )
        console.log("🚀 ~ file: AdminService.ts:99 ~ updateService ~ result", result)
        return result;
    },

    async createTicket(data: any) {
        const response = await Ticket.create(data);
        console.log("🚀 ~ file: AdminService.ts:80 ~ createTicket ~ response", response)
        const insertedTicketData: any = JSON.parse(JSON.stringify(response, null, 2));
        console.log("🚀 ~ file: AdminService.ts:82 ~ createTicket ~ insertedTicketData", insertedTicketData)
        return insertedTicketData;
    },

    async getTicketList() {
        let ticketList: any = {};
        const response = await Ticket.findAll();
        console.log("🚀 ~ file: AdminService.ts:80 ~ getTicketList ~ response", response)
        const ticketData: any = JSON.parse(JSON.stringify(response, null, 2));
        const [results] = await db.sequelize.query("SELECT COUNT(id) FROM tickets");
        const paymentResponse = await PaymentDetail.findAll();
        const paymentDetailList: any = JSON.parse(JSON.stringify(paymentResponse, null, 2));
        console.log("🚀 ~ file: AdminService.ts:152 ~ getTicketList ~ paymentDetailList", paymentDetailList)
        console.log("🚀 ~ file: AdminService.ts:109 ~ getTicketList ~ serviceCount", results[0]['COUNT(id)'])
        console.log("🚀 ~ file: AdminService.ts:82 ~ getTicketList ~ ticketData", ticketData)
        ticketList.rows = ticketData;
        ticketList.totalCount = results[0]['COUNT(id)'];
        ticketList.paymentDetailList = paymentDetailList;
        return ticketList;
    },

    async getLastTicket() {
        return await Ticket.findOne({
            order: [['createdAt', 'DESC']],
        });
    },

    async savePaymentDetail(data: any) {
        console.log("🚀 ~ file: AdminService.ts:167 ~ savePaymentDetail ~ data.ticket_id", data.ticket_id)
        const result = await Ticket.update(
            { status: 'Closed' , status_color: 'red'},
            { where: { id: data.ticket_id } }
        );
        console.log("🚀 ~ file: AdminService.ts:169 ~ savePaymentDetail ~ result", JSON.parse(JSON.stringify(result, null, 2)))
        const response = await PaymentDetail.create(data);
        console.log("🚀 ~ file: AdminService.ts:80 ~ savePaymentDetail ~ response", response)
        const savePaymentDetailData: any = JSON.parse(JSON.stringify(response, null, 2));
        console.log("🚀 ~ file: AdminService.ts:82 ~ savePaymentDetail ~ savePaymentDetailData", savePaymentDetailData)
        return savePaymentDetailData;
    },

    async getAllPaymentDetail() {
        return await PaymentDetail.findAll();
    },

    async updatePaymentDetail(data: any, id) {
        const result = await PaymentDetail.update(
            data,
            { where: { ticket_id: id } }
        )
        console.log("🚀 ~ file: AdminService.ts:99 ~ updatePaymentDetail ~ result", result)
        return result;
    },

    async updateTicket(data: any, id) {
        const result = await Ticket.update(
            data,
            { where: { id } }
        )
        console.log("🚀 ~ file: AdminService.ts:99 ~ updateTicket ~ result", result)
        return result;
    },

};