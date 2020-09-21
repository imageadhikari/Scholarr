const mongoose = require("mongoose");
const Classroom = require("./Classroom");
const Submission = require("./Submission");
const User = require("./User");

//classwork
const classworkSchema = mongoose.Schema(
	{
		_classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
		classworkType: { type: String, required: true },
		title: { type: String, maxlength: 200, default: null, required: true },
		description: { type: String, maxlength: 600, default: null },
		attachments: [{ name: String, mimeType: String, location: String }],
		totalGrade: { type: Number, default: null },
		deadlineDate: { type: Date, default: null },
		submissions: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
			},
		],
	},
	{ timestamps: true }
);

// //question
// const questionSchema = mongoose.Schema(
// 	{
// 		title: { type: String, maxlength: 200, default: null, required: true },
// 		description: { type: String, maxlength: 600, default: null },
// 		deadlineDate: { type: Date, default: null, required: true },
// 		_classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
// 	},
// 	{ timestamps: true }
// );
// //test
// const testSchema = mongoose.Schema(
// 	{
// 		title: { type: String, maxlength: 200, default: null, required: true },
// 		description: { type: String, maxlength: 600, default: null },
// 		attachments: [{ type: String, mimeType: String }],
// 		totalGrade: { type: Number, default: null },
// 		deadlineDate: { type: Date, default: null, required: true },
// 		_classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
// 	},
// 	{ timestamps: true }
// );

// //materials
// const materialSchema = mongoose.Schema(
// 	{
// 		title: { type: String, maxlength: 200, default: null, required: true },
// 		description: { type: String, maxlength: 600 },
// 		attachments: [{ type: String, mimeType: String }],
// 		_classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
// 	},
// 	{ timestamps: true }
// );

// //general
// const generalSchema = mongoose.Schema(
// 	{
// 		title: { type: String, maxlength: 200, default: null, required: true },
// 		description: { type: String, maxlength: 600, default: null },
// 		_classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
// 	},
// 	{ timestamps: true }
// );

//class comments
const classworkCommentSchema = mongoose.Schema(
	{
		comment: { type: String, maxlength: 500, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		classwork: { type: mongoose.Schema.Types.ObjectId, ref: "Classwork" },
	},
	{ timestamps: true }
);

module.exports.Classwork = mongoose.model("Classwork", classworkSchema);
// module.exports.Assignment = mongoose.model("Assignment", assignmentSchema);
// module.exports.Test = mongoose.model("Test", testSchema);
// module.exports.Question = mongoose.model("Question", questionSchema);
// module.exports.Material = mongoose.model("Material", materialSchema);
// module.exports.General = mongoose.model("General", generalSchema);
module.exports.ClassworkComment = mongoose.model("ClassworkComment", classworkCommentSchema);
