/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner of the req.params.classroomId classroom
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 */

const { reqUserError, nonExistenceError } = require("../utils/errorMessages");
const User = require("../models/User");

/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner of the req.params.classroomId classroom
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 *
 * @modifies req.user to queried User
 */
module.exports.loggedUserExistsVerify = async (req, res, next) => {
	try {
		// check loged in
		if (!req.user._id) throw reqUserError;

		const userFound = await User.findById(req.user._id);
		if (!userFound) throw nonExistenceError("user");

		req.user = userFound;

		next();
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		res.status(400).send(err);
	}
};

/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner or member of the req.params.classroomId classroom
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 */
module.exports.classworkExistVerify = async (req, res, next) => {
	try {
		// check logged in
		if (!req.user._id) throw reqUserError;

		// check if classroomId parameter available in url endpoints
		if (!req.params.classroomId) throw endPointError;
		if (!req.params.classworkId) throw endPointError;

		const classroomFound = await Classroom.findOne({ _id: req.params.classroomId });
		if (!classroomFound) throw nonExistenceError("classroom");

		//check logged in user is the owner or member of classroom
		let classworkExist = classroomFound.classworks.some(
			(doc) => doc === req.params.classworkId
		);

		if (!classworkExist)
			throw {
				error: {
					status: 400,
					type: "Bad Request!",
					message:
						"Requested classwork does not exist in requested Classroom. Please check to see if endpoint params are correct.",
				},
			};

		req.customField.classwork = await ClassworkComment.findById(req.params.classworkId);
		next();
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		res.status(400).send(err);
	}
};
