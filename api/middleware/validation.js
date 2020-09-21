const Joi = require("joi");
const { schema } = require("../models/User");

//
//
// REGISTER
module.exports.registerValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().min(5).required(),
		email: Joi.string().min(6).email().required(),
		password: Joi.string().min(8).required(),
	});

	return schema.validate(data);
};

//
//
// LOGIN
module.exports.loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).email().required(),
		password: Joi.string().min(8).required(),
	});

	return schema.validate(data);
};

//
//
// EMAIL
module.exports.resendConfEmailValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).email().required(),
		password: Joi.string().min(8).required(),
	});

	return schema.validate(data);
};

module.exports.emailValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).email().required(),
	});

	return schema.validate(data);
};

//
//
// delete account
module.exports.deleteAccountValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).email(),
		password: Joi.string().min(8).required(),
	});

	return schema.validate(data);
};

//
//
// UPDATE user
module.exports.updateUserValidation = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().max(100),
		middleName: Joi.string().max(100),
		lastName: Joi.string().max(100),
		bio: Joi.string().max(1000),
		password: Joi.string().min(8).required(),
		dateOfBirth: Joi.date(),
	});

	return schema.validate(data);
};

//
//
// CREATE classroom
module.exports.createClassroomValidation = (data) => {
	const schema = Joi.object({
		className: Joi.string().required(),
		classDescription: Joi.string().required(),
		classSubject: Joi.string(),
		affiliatedInstitution: Joi.string(),
	});
	return schema.validate(data);
};

//
//
// Update classroom validation
module.exports.updateClassroomValidation = (data) => {
	const schema = Joi.object({
		_classId: Joi.string(),
		className: Joi.string().required(),
		classDescription: Joi.string().required(),
		classSubject: Joi.string(),
		affiliatedInstitution: Joi.string(),
	});

	return schema.validate(data);
};

//
module.exports.inviteBulkUserValidation = (data) => {
	const schema = Joi.array().items(
		Joi.object({
			userId: Joi.string(),
			username: Joi.string(),
			email: Joi.string().email(),
		})
	);
	return schema.validate(data);
};

module.exports.inviteUserValidation = (data) => {
	const schema = Joi.object({
		userId: Joi.string(),
		username: Joi.string(),
		email: Joi.string().email(),
	});
	return schema.validate(data);
};

module.exports.classroomRequestValidation = (data) => {
	const schema = Joi.object({
		classCode: Joi.string().min(12),
	});
	return schema.validate(data);
};

//
//
// Classwork Validations

module.exports.classworkValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string(),
		totalGrade: Joi.number().min(0).max(100),
		deadlineDate: Joi.date(),
	});
	return schema.validate(data);
};

// CREATE
module.exports.materialCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string(),
	});
	return schema.validate(data);
};

module.exports.generalCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string(),
	});
	return schema.validate(data);
};

module.exports.assignmentCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string(),
		totalGrade: Joi.number().min(0).max(100).required(),
		deadlineDate: Joi.date().required(),
	});
	return schema.validate(data);
};

module.exports.testCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string(),
		totalGrade: Joi.number().min(0).max(100).required(),
		deadlineDate: Joi.date().required(),
	});
	return schema.validate(data);
};

module.exports.questionCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string(),
		deadlineDate: Joi.date().required(),
	});
	return schema.validate(data);
};

//UPDATE
module.exports.updateMaterialCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string(),
		description: Joi.string(),
	});
	return schema.validate(data);
};

module.exports.updateGeneralCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string(),
		description: Joi.string(),
	});
	return schema.validate(data);
};

module.exports.updateAssignmentCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string(),
		description: Joi.string(),
		totalGrade: Joi.number().min(0).max(100),
		deadlineDate: Joi.date(),
	});
	return schema.validate(data);
};

module.exports.updateTestCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string(),
		description: Joi.string(),
		totalGrade: Joi.number().min(0).max(100),
		deadlineDate: Joi.date(),
	});
	return schema.validate(data);
};

module.exports.updateQuestionCWValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string(),
		description: Joi.string(),
		deadlineDate: Joi.date(),
	});
	return schema.validate(data);
};

//
//
// ! SUBMISSION

module.exports.createSubmissionValidation = (data) => {
	const schema = Joi.object({
		description: Joi.string().max(1000),
	});
	return schema.validate(data);
};

module.exports.updateSubmissionValidation = (data) => {
	const schema = Joi.object({
		description: Joi.string().max(1000),
	});
	return schema.validate(data);
};
