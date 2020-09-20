const mongoose = require("mongoose");
const User = require("./User");

//
//
/** Token model
 *
 * @property1 _id
 * @property2 _userId
 * @property3 token
 * @property4 createdAt
 */
const tokenSchema = mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	token: {
		type: String,
		required: true,
	},
	usage: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 600,
	},
});

module.exports = mongoose.model("Token", tokenSchema);
