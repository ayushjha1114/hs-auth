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
		// result = userData;
		console.log(
			"🚀 ~ file: AdminService.ts:78 ~ getTicketById ~ ticket",
			ticket
		);
		return ticket;
	},

	async saveFollowUp(data: any) {
		console.log("🚀 ~ file: TicketService.ts:24 ~ saveFollowUp ~ data:", data);

		const response = await Follow_up.create(data);
		console.log(
			"🚀 ~ file: TicketService.ts:26 ~ saveFollowUp ~ response:",
			response
		);
		const followUp: any = JSON.parse(JSON.stringify(response, null, 2));
		console.log(
			"🚀 ~ file: TicketService.ts:28 ~ saveFollowUp ~ followUp:",
			followUp
		);
		return followUp;
	},
};
