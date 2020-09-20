const mongoose = require("mongoose");
const { Classwork } = require("./Classwork");
const User = require("./User");

const classroomSchema = mongoose.Schema(
	{
		// class info
		classCode: {
			type: String,
			required: true,
			maxlength: 16,
			default: null,
		},
		className: {
			type: String,
			required: true,
			maxlength: 256,
			default: null,
		},
		classDescription: {
			type: String,
			maxlength: 2000,
			default: null,
		},
		classSubject: {
			type: String,
			maxlength: 256,
			default: null,
		},
		// affiliatedInstitution: {
		// 	type: String,
		// 	maxlength: 256,
		// 	default: null,
		// },
		coverPhoto: {
			type: String,
			default: null,
		},
		// users
		_creatorId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		classMembers: {
			enrolledMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			invitedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			memberRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		},
		// classworks
		labels: [
			{
				type: String,
			},
		],
		classworks: [
			{
				_classworkId: { type: mongoose.Schema.Types.ObjectId, ref: "Classwork" },
				classworkType: { type: String, required: true },
				labelAssociated: { type: String, default: null },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Classroom", classroomSchema);
