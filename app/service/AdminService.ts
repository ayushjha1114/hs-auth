const Sequelize = require('sequelize');
const { Op } = require("sequelize");
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

    async getUserByMobileEmail(mobile: string) {
        return await UserProfile.findOne({ where: { mobile } });
    },

    async insertNewUser(data: any) {
        let result: any = {};
        const response = await UserProfile.create(data);
        
        const insertedUserProfileData: any = JSON.parse(JSON.stringify(response, null, 2));
        result.userDetail = insertedUserProfileData;

        
        const user_id = insertedUserProfileData.id;
        
        
        if (data.role === 'AMC') {
            const response = await AMC.create({ ...data.amcDetail, user_profile_id: user_id });
            const insertedAMCData: any = JSON.parse(JSON.stringify(response, null, 2));
            
            result.amcDetail = insertedAMCData;
        }
        return result;
    },

    async getUserList(limit: number, offset: number) {
        const response = await UserProfile.findAll({ offset: Number(offset), limit: Number(limit) });
        const userList: any = JSON.parse(JSON.stringify(response, null, 2));
        const result = await AMC.findAll();
        const amcList: any = JSON.parse(JSON.stringify(result, null, 2));
        return { userList, amcList };
    },

    async getUserListCount() {
        return await db.sequelize.query("SELECT COUNT(id) FROM user_profiles");
        //SELECT COUNT(U.id) FROM user_profiles AS U INNER JOIN amcs AS A ON A.user_profile_id = U.id;

    },

    async getLastUser() {
        return await UserProfile.findOne({
            order: [['id', 'DESC']],
        });
    },

    async getUserById(id) {
        let result: any = {};
        const response = await UserProfile.findOne({ where: { id } })
        const userData: any = JSON.parse(JSON.stringify(response, null, 2));
        // result = userData;
        // 
        const amcResponse = await AMC.findOne({ where: { user_profile_id: userData.id } })
        const amcData: any = JSON.parse(JSON.stringify(amcResponse, null, 2));
        // 
        userData.amcDetail = amcData;
        return userData;
    },

    async getServiceById(id) {
        let result: any = {};
        const response = await Service.findOne({ where: { id } })
        const serviceDetail: any = JSON.parse(JSON.stringify(response, null, 2));
        // result = userData;
        
        return serviceDetail;
    },

    async getTicketById(id) {
        let result: any = {};
        const response = await Ticket.findOne({ where: { id } })
        const ticket: any = JSON.parse(JSON.stringify(response, null, 2));
        // result = userData;
        
        return ticket;
    },

    async updateUserDetail(data: any) {
        delete data.password;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.isDeleted;
        delete data.isActive;

        const amcData = data.amcDetail;
        delete data.amcDetail;

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
        
        if (amcData) {
            const amcResult = await AMC.update(amcData, {
                where: { user_profile_id: data.id }
            })
            
        }
        return await db.sequelize.query(sqlStatement);

        // 
        // const result = await UserProfile.update(data, {
        //     where: { id: data.id }
        // });
        // if (!result[0]) {
        //     throw new Error('User Not updated');
        // }

    },

    async createBrand(data: any) {
        const response = await Brand.create(data);
        
        const insertedBrandData: any = JSON.parse(JSON.stringify(response, null, 2));
        
        return insertedBrandData;
    },

    async getBrandList(limit: number, offset: number) {
        let brandList: any = {};
        const response = await Brand.findAll({ offset: Number(offset), limit: Number(limit) });
        
        const insertedBrandData: any = JSON.parse(JSON.stringify(response, null, 2));
        const [results] = await db.sequelize.query("SELECT COUNT(id) FROM brands");
        
        brandList.rows = insertedBrandData;
        brandList.totalCount = results[0]['COUNT(id)'];
        return brandList;
    },

    async updateBrand(data: any, id) {
        const result = await Brand.update(
            data,
            { where: { id } }
        )
        
        return result;
    },

    async getServiceList() {
        let serviceList: any = {};
        const response = await Service.findAll();
        
        const serviceData: any = JSON.parse(JSON.stringify(response, null, 2));
        const [results] = await db.sequelize.query("SELECT COUNT(id) FROM services");
        
        
        serviceList.rows = serviceData;
        serviceList.totalCount = results[0]['COUNT(id)']
        return serviceList;
    },

    async createService(data: any) {                                                                                                                                                                                                                                                                                                                                                             
        const response = await Service.create(data);
        
        const insertedServiceData: any = JSON.parse(JSON.stringify(response, null, 2));
        
        return insertedServiceData;
    },

    async updateService(data: any, id) {
        const result = await Service.update(
            data,
            { where: { id } }
        )
        
        return result;
    },

    async createTicket(data: any) {
        const response = await Ticket.create(data);
        const insertedTicketData: any = JSON.parse(JSON.stringify(response, null, 2));
        return insertedTicketData;
    },

    async getTicketList(limit: number, offset: number) {
        let ticketList: any = {};
        const response = await Ticket.findAll({
            offset: Number(offset), limit: Number(limit), 
            order: [
                ['ticket_number', 'DESC'],
            ]
        });
        const ticketData: any = JSON.parse(JSON.stringify(response, null, 2));
        const [results] = await db.sequelize.query("SELECT COUNT(id) FROM tickets");
        const paymentResponse = await PaymentDetail.findAll({ offset: Number(offset), limit: Number(limit) });
        const paymentDetailList: any = JSON.parse(JSON.stringify(paymentResponse, null, 2));
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
        
        const result = await Ticket.update(
            { status: 'Closed', status_color: 'red' },
            { where: { id: data.ticket_id } }
        );
        
        const response = await PaymentDetail.create(data);
        
        const savePaymentDetailData: any = JSON.parse(JSON.stringify(response, null, 2));
        
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
        
        return result;
    },

    async updateTicket(data: any, id) {
        const result = await Ticket.update(
            data,
            { where: { id } }
        )
        
        return result;
    },

};