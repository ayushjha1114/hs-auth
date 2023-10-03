"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class follow_up extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			follow_up.belongsTo(models.ticket, { foreignKey: "ticket_id" });
			models.ticket.hasMany(follow_up, { foreignKey: "ticket_id" });
		}
	}
	follow_up.init(
		{
			type: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			problem: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			remark: {
				type: DataTypes.STRING,
				defaultValue: null,
			},
			extra_field: {
				type: DataTypes.JSON,
				defaultValue: null,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			ticket_id: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "follow_up",
		}
	);
	return follow_up;
};
