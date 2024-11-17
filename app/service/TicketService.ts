const Sequelize = require("sequelize");
const { Op } = require("sequelize");
import db from "../models";
const Ticket = db.ticket;
const Follow_up = db.follow_up;

export const TicketService = {
	async getTicketDetail(id: any) {
		let result: any = {};
		const response = await Ticket.findOne({
			where: { id },
			include: Follow_up,
		});
		const ticket: any = JSON.parse(JSON.stringify(response, null, 2));
		
		return ticket;
	},

	async saveFollowUp(data: any) {
		

		const response = await Follow_up.create(data);
		
		const followUp: any = JSON.parse(JSON.stringify(response, null, 2));
		
		return followUp;
	},
};
