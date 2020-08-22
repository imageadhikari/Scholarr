const Joi = require("joi");

//
//
// REGISTER
module.exports.registerValidation = (data) => {
	const schema = {
		username: Joi.string().min(5).required(),
		email: Joi.string().min(6).email().required(),
		password: Joi.string().min(8).required(),
	};

	return Joi.validate(data, schema);
};

//
//
// LOGIN
module.exports.loginValidation = (data) => {
	const schema = {
		email: Joi.string().min(6).email().required(),
		password: Joi.string().min(8).required(),
	};

	return Joi.validate(data, schema);
};

//
//
// EMAIL
module.exports.emailValidation = (data) => {
	const schema = {
		email: Joi.string().min(6).email(),
	};

	return Joi.validate(data, schema);
};

//
//
// delete account
module.exports.deleteAccountValidation = (data) => {
	const schema = {
		email: Joi.string().min(6).email(),
		password: Joi.string().min(8).required(),
	};

	return Joi.validate(data, schema);
};

//
//
// UPDATE user
module.exports.updateUserValidation = (data) => {
	const schema = {
		_id: Joi.string().required(),
		firstName: Joi.string().max(100),
		middleName: Joi.string().max(100),
		lastName: Joi.string().max(100),
		bio: Joi.string().max(1000),
		password: Joi.string().min(8).required(),
		dateOfBirth: Joi.date(),
	};

	return Joi.validate(data, schema);
};
