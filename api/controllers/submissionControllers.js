const Classroom = require("../models/Classroom");
const User = require("../models/User");
const Submission = require("../models/Submission");
const { createSubmissionValidate } = require("../middleware/validation");
const {
	validationError,
	nonExistenceError,
	ownerAccessDenailError,
} = require("../utils/errorMessages");

//
//
// Classwork submisssions
module.exports.submit_classwork_post = async (req, res) => {
	try {
		// before this check LoggedIn, ClassroomMember, ClassworkExist
		const reqClasswork = req.customField.classwork;
		// const reqClassroom = req.customField.classroom;
		const reqUser = req.user;

		// Validate req.body
		const { error } = createSubmissionValidation(req.body);
		if (error) throw validationError(error);

		// Create
		let submission = {};
		for (let key in req.body) submission[key] = req.body[key];

		const savedSubmission = await new Submission(submission).save();

		// Update Users, Classwork
		await Classwork.update(
			{ _id: reqClasswork._id },
			{ $set: { submissions: { user: reqUser._id, submission: savedSubmission._id } } }
		);

		await User.update(
			{ _id: reqUser._id },
			{
				$set: {
					submissions: { classwork: reqClasswork._id, submission: savedSubmission._id },
				},
			}
		);

		return res.status(201).send({
			success: {
				status: 201,
				type: "Request Successful!",
				message: "Submission created",
				submission: savedSubmission,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

module.exports.update_classwork_submissioin_patch = async (req, res) => {
	try {
		// before this check LoggedIn, ClassroomMember, ClassworkExist
		const reqClasswork = req.customField.classwork;
		const reqClassroom = req.customField.classroom;
		const reqUser = req.user;

		//check submission
		const paramsSubmission = await Submission.findById(req.params.submissionId);
		if (!paramsSubmission) throw nonExistenceError("Submission");
		if (paramsSubmission._usedId != reqUser._id) throw ownerAccessDenailError;

		// Validate req.body
		const { error } = createSubmissionValidation(req.body);
		if (error) throw validationError(error);

		// UPDATE data
		let updateQuery = { $set: {} };
		for (let key in req.body) {
			if (paramsSubmission[key] && paramsSubmission[key] != req.body[key])
				updateQuery.$set[key] = req.body[key];
		}

		// TODO files handling

		// Update Users, Classwork
		const updatedSubmission = await Submission.update(
			{ _id: paramsSubmission._id },
			{ updateQuery }
		);

		return res.status(201).send({
			success: {
				status: 201,
				type: "Request Successful!",
				message: "Submission updated",
				submission: updatedSubmission,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

module.exports.delete_classwork_submissioin_delete = async (req, res) => {
	try {
		// before this check LoggedIn, ClassroomMember, ClassworkExist
		const reqClasswork = req.customField.classwork;
		const reqClassroom = req.customField.classroom;
		const reqUser = req.user;

		//check submission
		const paramsSubmission = await Submission.findById(req.params.submissionId);
		if (!paramsSubmission) throw nonExistenceError("Submission");
		if (paramsSubmission._usedId != reqUser._id) throw ownerAccessDenailError;

		//Delete
		await Submission.deleteOne({ _id: paramsSubmission._id });

		// Update Users, Classwork
		await Classwork.update(
			{ _id: reqClasswork._id },
			{ $pull: { submissions: { submission: paramsSubmission._id } } }
		);

		await User.update(
			{ _id: reqUser._id },
			{
				$pull: {
					submissions: { submission: paramsSubmission._id },
				},
			}
		);

		return res.status(200).send({
			success: {
				status: 200,
				type: "Request Successful!",
				message: "Submission Deleted",
				submission: paramsSubmission,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};
