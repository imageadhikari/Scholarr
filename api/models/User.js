const mongoose = require("mongoose");
const Classroom = require("./Classroom");
const { ClassworkComment } = require("./Classwork");
const Submission = require("./Submission");

//
//
// USER SCHEMA
const userSchema = mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, minlength: 6, trim: true },
		email: { type: String, required: true, unique: true, minlength: 6, maxlength: 255 },
		password: { type: String, required: true, max: 1024, minlength: 8 },
		isEmailVerified: { type: Boolean, default: false },
		firstName: { type: String, maxlength: 100, default: null },
		middleName: { type: String, maxlength: 100, default: null },
		lastName: { type: String, maxlength: 100, default: null },
		bio: { type: String, maxlength: 1000, default: null },
		dateOfBirth: { type: Date, default: null, max: Date.now },
		avatarImage: {
			data: { type: String, default: null },
			contentType: { type: String, default: null },
		},
		coverImage: {
			data: { type: String, default: null },
			contentType: { type: String, default: null },
		},
		classroom: {
			classesTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
			classesAttending: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
			classesInvited: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
			classesRequested: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
		},
		classworks: [
			{
				classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
				classwork: { type: mongoose.Schema.Types.ObjectId, ref: "Classwork" },
			},
		],
		submissions: [
			{
				classwork: { type: mongoose.Schema.Types.ObjectId, ref: "Classwork" },
				submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema); // creates a new model based on userSchema named as User
