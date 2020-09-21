/**
 * Error template for all general errors
 *
 * @param {number} status
 * @param {string} type
 * @param {string} message
 * @returns {object}
 * ```javascript
 * {
 * 	error: { status: status, type: "type", message: "message" }
 * }
 * ```
 */
module.exports.errorMessage = (status, type, message) => {
	return {
		error: {
			status: status,
			type: type,
			message: message,
		},
	};
};

/**
 * Error template for Non-existence
 *
 * @param {string} entity reference entity which is to be defined
 * @returns {object}
 * ```javascript
 * {
 * 	error: { status:404, type:"Non-existence", message:"Requested `entity` does not exist." }
 * }
 * ```
 */
module.exports.nonExistenceError = (entity) => {
	return {
		error: {
			status: 404,
			type: "Not Found!",
			message: `Requested ${entity} does not exist.`,
		},
	};
};

/**
 *
 * @param {object} error Joi error object
 *
 * @returns {object}
 * ```javascript
 * {
 *		error: { type: "Req.body Validation error", message: error.details[0].message },
 * }
 * ```
 */
module.exports.validationError = (error) => {
	return {
		error: {
			type: "Req.body Validation error",
			message: error.details[0].message,
		},
	};
};

module.exports.wrongPwError = {
	error: { status: 401, type: "Authentication failure", message: "Wrong Password." },
};

module.exports.reqBodyError = {
	error: {
		status: 400,
		type: "Request body error",
		message:
			"Request body does not contain necessary items, please refer documentation to check",
	},
};

module.exports.reqUserError = {
	error: {
		status: 400,
		type: "Request body error",
		message:
			"Request does not contain a 'req.user'. \n Possible solutions: \t 1. include a 'req.user._id' \n\t 2. [backend] Use this middleware after 'loggedInVerify' middleware",
	},
};

module.exports.endPointError = {
	error: {
		status: 400,
		type: "Request end-point error",
		message:
			"Request does not contain a 'req.params.userId' in the url end-point. \n Possible solutions: \t 1. Check the url end point to make sure it is correct",
	},
};

module.exports.memberAccessDenailError = {
	error: {
		status: 401,
		type: "Access Denied!",
		message: "You do not have permission for access! Only owners and members may get access.",
	},
};

module.exports.ownerAccessDenailError = {
	error: {
		status: 401,
		type: "Access Denied!",
		message: "You do not have permission for access! Only owners.",
	},
};

module.exports.alreadyMemberError = {
	error: {
		status: 400,
		type: "Inconsequential Request!",
		message: "User is already a member of the classroom.",
	},
};

module.exports.noMemberFoundError = {
	error: {
		status: 400,
		type: "Bad Request!",
		message: "Request member not found in the classroom.",
	},
};

module.exports.notInvitedError = {
	error: {
		status: 400,
		type: "Bad Request!",
		message: "You have not been invited to this classroom.",
	},
};

module.exports.notRequestedError = {
	error: {
		status: 400,
		type: "Bad Request!",
		message: "Queried user has not Requested to enroll in this classroom.",
	},
};
