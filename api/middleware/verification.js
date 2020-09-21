//imports
const jwt = require("jsonwebtoken");

// errors
const {
	nonExistenceError,
	endPointError,
	reqUserError,
	memberAccessDenailError,
	ownerAccessDenailError,
} = require("../utils/errorMessages");

// models
const User = require("../models/User");
const Classroom = require("../models/Classroom");
const { Classwork } = require("../models/Classwork");

// middleware token check function
module.exports.loggedInVerify = async (req, res, next) => {
	try {
		const token = req.header("auth-token");
		if (!token) throw { error: { status: 401, message: "Access Denied!" } };

		const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET, { expiresIn: "7d" });

		// req.user = verifiedUser;

		const userFound = await User.findById(verifiedUser._id);
		if (!userFound) throw nonExistenceError("login user account");

		req.user = userFound.toJSON();

		next();
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner of the req.params.userId account
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 */
module.exports.accountOwnerVerify = async (req, res, next) => {
	try {
		// check LOGGED IN
		if (!req.user._id) throw reqUserError;

		// check ENDPOINT
		if (!req.params.userId) throw endPointError;

		// get USER
		const paramUserFound = await User.findById(req.params.userId);
		if (!paramUserFound) throw nonExistenceError("user");

		// get IDs
		let _reqUserId = req.user._id.toString();
		let _paramUserId = paramUserFound._id.toString();

		// check IDs
		if (_reqUserId != _paramUserId) throw ownerAccessDenailError;

		// req.user = paramUserFound.toJSON();

		next();
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		res.status(400).send(err);
	}
};

/**
 *  ### NOTE: Strictly use this middleware after _loggedInVerify_ middleware
 * Middleware for verifying logged in user is the owner of the req.params.classroomId classroom
 *
 * @param {object} req the request object
 * @param {object} res the response object
 * @param {function} next the next middleware function
 */
module.exports.classroomOwnerVerify = async (req, res, next) => {
	try {
		// check LOGGED IN
		if (!req.user._id) throw reqUserError;

		// check ENDPOINTS
		if (!req.params.classroomId) throw endPointError;

		// GET DOCUMENTS
		const classroomFound = await Classroom.findOne({ _id: req.params.classroomId });
		if (!classroomFound) throw nonExistenceError("classroom");

		// GET IDs
		const _reqUserId = req.user._id.toString();
		const _creatorId = classroomFound._creatorId.toString();

		// VERIFY
		let isCreator = _reqUserId === _creatorId;
		if (!isCreator) throw ownerAccessDenailError;

		// CREATE NEW FIELD
		req["customField"] = {
			classroom: classroomFound.toJSON(),
			reqUser: { isCreator: isCreator },
		};
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
module.exports.classMemberVerify = async (req, res, next) => {
	try {
		// check LOGGED IN
		if (!req.user._id) throw reqUserError;

		// check ENDPOINTS
		if (!req.params.classroomId) throw endPointError;

		// GET DOCUMENTS
		const classroomFound = await Classroom.findOne({ _id: req.params.classroomId });
		if (!classroomFound) throw nonExistenceError("classroom");

		// GET IDs
		const _reqUserId = req.user._id.toString();
		const _creatorId = classroomFound._creatorId.toString();
		const _enrolledMembersId = [];
		for (let doc of classroomFound.toJSON().classMembers.enrolledMembers)
			_enrolledMembersId.push(doc.toString());

		// VERIFY
		let isCreator = _reqUserId === _creatorId;
		let isMember = _enrolledMembersId.some((doc) => doc === _reqUserId);
		if (!isCreator && !isMember) throw memberAccessDenailError;

		// CREATE NEW FIELD
		req["customField"] = {
			classroom: classroomFound.toJSON(),
			reqUser: { isCreator: isCreator, isMember: isMember },
		};

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

		let classroomFound = null;
		if (req.customField.classroom) {
			classroomFound = req.customField.classroom;
		} else {
			classroomFound = await Classroom.findOne({ _id: req.params.classroomId });
			if (!classroomFound) throw nonExistenceError("classroom");
		}

		//check logged in user is the owner or member of classroom
		let classworkExists = classroomFound.classworks.some(
			(doc) => doc._classworkId.toString() === req.params.classworkId
		);
		if (!classworkExists)
			throw {
				error: {
					status: 400,
					type: "Bad Request!",
					message:
						"Requested classwork does not exist in requested Classroom. Please check to see if endpoint params are correct.",
				},
			};

		req.customField.classwork = (await Classwork.findById(req.params.classworkId)).toJSON();

		next();
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		res.status(400).send(err);
	}
};
