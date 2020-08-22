const mongoose = require("mongoose");
const User = require("./User");

const Classroom = mongoose.Schema({
	_creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: User,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	classCode: {
		type: String,
		required: true,
		maxlength: 16,
	},
	className: {
		type: String,
		required: true,
		maxlength: 256,
	},
	classDescription: {
		type: String,
		required: true,
		maxlength: 2000,
	},
	classMembers: {
		acceptedMembers: [
			{
				_memberId: mongoose.Schema.Types.ObjectId,
				// role: String,
				ref: User,
			},
		],
		invitedMembers: [
			{
				_memberId: ongoose.Schema.Types.ObjectId,
				// role: String,
				ref: User,
			},
		],
		memberRequests: [
			{
				_memberId: mongoose.Schema.Types.ObjectId,
				// role: String,
				ref: User,
			},
		],
	},
	classWorks: {
		general: [
			{
				_generalId: mongoose.Schema.Types.ObjectId,
			},
		],
		assignment: [
			{
				_generalId: mongoose.Schema.Types.ObjectId,
			},
		],
		questions: [
			{
				_generalId: mongoose.Schema.Types.ObjectId,
			},
		],
		materials: [
			{
				_generalId: mongoose.Schema.Types.ObjectId,
			},
		],
	},
});

module.exports.Classroom = mongoose.model("classroom", Classroom);
