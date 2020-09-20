const mongoose = require("mongoose");
const User = require("./User");
const { Classwork } = require("./Classwork");

const submissionSchema = mongoose.Schema(
	{
		_userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		_classworkId: { type: mongoose.Schema.Types.ObjectId, ref: "Classwork" },
		description: { type: String, default: null, maxlength: 1000 },
		feedback: { type: String, default: null, maxlength: 1000 },
		attachments: [{ name: String, mimeType: String, location: String }],
		obtainedGrade: { type: Number, default: null },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);

// TODO Implement feedback and grading
