/**
 * *Authentication Controllers
 *
 * *Contails all modules for controlling activities for routes defined in `routes/authRoutes.js`
 * @available_controllers -
 * 1. user_get
 * 2. register_get
 * 3. register_post
 * 4. login_get
 * 5. login_post
 * 6. email_confirmation_handler_get
 * 7. resend_email_confirmation_post
 * 8. password_reset_email_post
 * 9. password_reset_get
 * 10. password_reset_handler_post
 * 11. delete_account_email_post
 * 12. delete_account_get
 * 13. delete_account_handler_post
 */

// require("dotenv").config({path: ''});
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// models
const User = require("../models/User");
const Token = require("../models/Token");

// middleware

//validation
const {
	registerValidation,
	loginValidation,
	emailValidation,
	resendConfEmailValidation,
	deleteAccountValidation,
} = require("../middleware/validation");
// emailer
const {
	confirmEmailSender,
	emailVerifiedEmailSender,
	resetPasswordEmailSender,
	deleteAccountEmailSender,
} = require("../middleware/emailSender");

const { nonExistenceError, errorMessage } = require("../utils/errorMessages");

// modules

// exports

// user GET
/**
 * ### returns auth methods
 * @param {object} req
 * @param {object} res
 */
module.exports.auth_get = (req, res) => {
	res.send({
		AuthMethods: {
			auth_get: "This page",
			register: {
				register_get: "GET method",
				register_post: "POST method",
			},
			login: {
				login_get: "GET method",
				login_post: "POST method",
			},
			email_confirmation: {
				email_confirmation_handler_get: "GET method",
				resend_email_confirmation_post: "POST method",
			},
			password_reset: {
				password_reset_email_post: "POST method",
				password_reset_get: "GET method",
				password_reset_handler_patch: "PATCH method",
			},
			delete_account: {
				delete_account_email_post: "POST method",
				delete_account_get: "GET method",
				delete_account_handler_post: "POST method",
			},
		},
	});
};

//
//* REGISTRATION ----------------------------
//

/** //* Controls REGISTER GET requests. */
module.exports.register_get = (req, res) => {
	res.send({
		location: "REGISTER page",
		REGISTER_method: "POST",
		POST_body: {
			username: "[your username]",
			email: "sample@example.com",
			password: "[pw here]",
		},
	});
};

/** //* Controls REGISTER POST requests.
 *
 * POST body: { username: , email: , password: }
 */
module.exports.register_post = async (req, res) => {
	try {
		// First validate req.body data
		const { error } = registerValidation(req.body);
		if (error)
			throw {
				error: {
					message: error.details[0].message,
				},
			};

		// Check unique email
		const userEmailFound = await User.findOne({ email: req.body.email });
		if (userEmailFound)
			throw {
				type: "already exists",
				message: `Email: '${req.body.email}' is already associated with another account.`,
			};

		// check unique username
		const usernameFound = await User.findOne({ username: req.body.username });
		if (usernameFound)
			throw {
				type: "already exists",
				message: `Username: '${req.body.username}' is already taken.`,
			};

		// Password hasing using bcrypt
		const salt = await bcrypt.genSalt(10);
		// console.log("\nSalt:" + salt);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// User creation in database (create a new user using the credentials provided and hashed and our schema)
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		// save the user in the databse
		const savedUser = await user.save();

		// token generator
		const tokenKey =
			Math.random().toString(36).substring(2, 10) +
			Math.random().toString(36).substring(2, 10);
		const token = new Token({
			_userId: savedUser.id,
			token: tokenKey,
			usage: "Email confirmation",
		});
		const savedToken = await token.save();
		// console.log("\nsavedToken:" + savedToken);

		// send email
		const messageResponse = await confirmEmailSender(req, user, savedToken);
		if (messageResponse) throw messageResponse;

		res.status(201).json({
			success: {
				status: 201,
				type: "Sucessful Request!",
				message: "Account succesfully created!",
				userId: user.id,
				// token: savedToken,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).send({ error });
	}
};

//
//* LOGIN -------------------------------------
//

/** //* Controls LOGIN GET request. */
module.exports.login_get = (req, res) => {
	res.send({
		location: "LOGIN_PAGE",
		LOGIN_method: "POST",
		POST_BODY: {
			email: "sample@example.com",
			password: "[pw here]",
		},
	});
};

/** Controls LOGIN POST request.
 *
 * POST body: { email: , password: }
 */
module.exports.login_post = async (req, res) => {
	try {
		//Validate login req.body data
		const { error } = loginValidation(req.body);
		if (error)
			throw {
				error: {
					message: error.details[0].message,
				},
			};

		//check email exists
		const userFound = (await User.findOne({ email: req.body.email })).toJSON();
		if (!userFound)
			throw {
				error: {
					type: "Non-existence",
					message: "Email not found!",
					location: "email",
				},
			};

		// check email verified
		if (!userFound.isEmailVerified)
			throw {
				error: {
					type: "Access denied",
					message: "Email is not verified!",
					location: "email",
				},
			};

		// Check password
		const validPass = await bcrypt.compare(req.body.password, userFound.password);
		if (!validPass)
			throw {
				error: {
					type: "Authentication failure",
					message: "Wrong Password.",
					location: "password",
				},
			};

		delete userFound.password;

		// assign web token
		const token = jwt.sign({ _id: userFound._id }, process.env.TOKEN_SECRET);
		res.header(`auth-token`, token)
			.status(202)
			.send({
				success: {
					status: 202,
					type: "Successful Request",
					message: "Login Successful",
					auth_token: token,
					user: userFound,
				},
			});
	} catch (error) {
		console.error(error);
		return res.status(400).send({ ...error, status: "error" });
	}
};

//
//* CONFIRMATION -------------------------------
//

/** //* Confirmation handler GET */
module.exports.email_confirmation_handler_get = async (req, res) => {
	try {
		const urlToken = req.params.token; //retrieve token from url
		const tokenFound = await Token.findOne({ token: urlToken });
		if (!tokenFound)
			throw {
				type: "Non-existence",
				message: "Unable to find a valid token or Token already expired",
			};

		// check if the user exists
		const userToVerifyEmail = await User.findOne({
			_id: tokenFound._userId,
		});
		if (!userToVerifyEmail)
			throw {
				type: "Non-existence",
				message: "The user associated to token does not exist.",
			};

		// check user associated with token for if it is already verified
		if (userToVerifyEmail.isEmailVerified)
			throw {
				type: "already verified",
				message: "The associated user has already been verified",
			};

		// Verify the user
		await User.updateOne({ _id: userToVerifyEmail._id }, { $set: { isEmailVerified: true } });

		const mailResponse = await emailVerifiedEmailSender(userToVerifyEmail);
		if (mailResponse) throw mailResponse;

		return res.status(200).send({
			success: {
				status: 200,
				type: "Successful Request!",
				message: `Email ${userToVerifyEmail.email} verified! Now, You can login.`,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ ...error, status: "error" });
	}
};

/** //* Sends the email confirmation email again
 *
 * POST body: { email: , password: }
 */
module.exports.resend_email_confirmation_post = async (req, res) => {
	// First validate req.body data
	try {
		const { error } = resendConfEmailValidation(req.body);
		if (error) throw error;

		// Check if user with that email exists
		const userFound = await User.findOne({ email: req.body.email });
		if (!userFound)
			throw {
				type: "Non-existence",
				message: `Email: '${req.body.email}' is not associated with any accounts.`,
			};

		// token generator
		const tokenKey =
			Math.random().toString(36).substring(2, 10) +
			Math.random().toString(36).substring(2, 10);

		// token save to database
		const token = new Token({
			_userId: userFound.id,
			token: tokenKey,
			usage: "Email confirmation",
		});

		const newToken = await new Token(token).save();

		// send email
		const mailResponse = await confirmEmailSender(req, userFound, newToken);
		if (mailResponse) throw mailResponse;

		return res.status(200).send({
			success: {
				status: 200,
				type: "Request successful",
				message: "Email confirmation resent",
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ ...error, status: "error" });
	}
};

//
// //* RESET PASSWORD --------------------------
//

/** //* Sends email for password reset
 *
 * POST body: { email: }
 */
module.exports.reset_password_email_post = async (req, res) => {
	// First validate req.body data
	try {
		const { error } = emailValidation(req.body);

		if (error) throw error;
		// Check if user with that email exists
		const userFound = await User.findOne({ email: req.body.email });

		if (!userFound)
			throw {
				type: "Non-existence",
				message: `Email: '${req.body.email}' is not associated with any accounts.`,
			};
		// token generator
		const tokenKey =
			Math.random().toString(36).substring(2, 10) +
			Math.random().toString(36).substring(2, 10);
		// token save to database
		const token = new Token({
			_userId: userFound.id,
			token: tokenKey,
			usage: "Password reset",
		});
		const newToken = await token.save();
		// send email
		const mailResponse = await resetPasswordEmailSender(req, userFound, newToken);
		if (mailResponse) throw mailResponse;

		// after everything done successfully
		return res.status(200).send({
			success: {
				status: 200,
				type: "Request successful",
				message: "Reset Email Password confirmation resent",
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).send({ ...error, status: "error" });
	}
};

/** //* GET request for token verification for password reset
 *
 * @returns Token, User
 */
module.exports.reset_password_get = async (req, res) => {
	try {
		const urlToken = req.params.token;

		const tokenFound = await Token.findOne({ token: urlToken });
		if (!tokenFound) {
			throw nonExistenceError("token");
		}

		// check user associated with found token
		const userFound = await User.findOne({ _id: tokenFound._userId });
		if (!userFound) {
			throw nonExistenceError("user");
		}

		return res.status(200).send({
			success: {
				token: tokenFound._id,
				user: userFound._id,
			},
		});

		// Note: in the front end you can determine whether to display form
		// for password reset or not depending on the response. if you get a
		// token display the form, if not display error
	} catch (error) {
		console.error(error);
		return res.status(400).send({ ...error, status: "error" });
	}
};

/** //* Reset password handler
 *
 * PATCH body: { _userId: , token: , new_password: }
 */
module.exports.reset_password_handler_patch = async (req, res) => {
	// return res.send("in progress");
	try {
		const userToResetPasswordOf = await User.findOne({ email: req.body.email });
		if (!userToResetPasswordOf) throw nonExistenceError("user");

		const tokenFound = await Token.findOne({ token: req.body.token });
		if (!tokenFound)
			throw errorMessage(
				404,
				"Bad Request!",
				"Unable to find a valid token or Token already expired"
			);

		// NOTE: implement check ifEmailVerified or not?

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		await User.updateOne(
			{
				_id: userToResetPasswordOf._id,
			},
			{
				$set: {
					password: hashedPassword,
				},
			}
		);

		res.status(200).json({
			success: {
				type: "Request successful",
				message: `Password successfully reset for ${userToResetPasswordOf.email}`,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ ...error, status: "error" });
	}
};

//
// //* ACCOUNT DELETEION ---------------------------
//

/** //* Sends email for account delete
 *
 * POST body: { email: , password: }
 */
module.exports.delete_account_email_post = async (req, res) => {
	try {
		const { error } = deleteAccountValidation(req.body);
		if (error) throw error;

		const userFound = await User.findOne({ email: req.body.email });

		if (!userFound)
			throw {
				type: "Non-existence",
				message: `Email: '${req.body.email}' is not associated with any accounts.`,
			};

		const validPass = await bcrypt.compare(req.body.password, userFound.password);

		if (!validPass)
			throw {
				error: { type: "Authentication failure", message: "Wrong Password." },
			};

		const tokenKey =
			Math.random().toString(36).substring(2, 10) +
			Math.random().toString(36).substring(2, 10);

		const newToken = await new Token({
			_userId: userFound.id,
			token: tokenKey,
			usage: "Account Deletion",
		}).save();

		const mailResponse = await deleteAccountEmailSender(req, userFound, newToken);
		if (mailResponse) throw mailResponse;

		return res.status(200).send({
			success: {
				status: 200,
				type: "Request successful!",
				message: "Delete Account email confirmation sent",
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).send({ ...error, status: "error" });
	}
};

/** //* GET request for token verification for account deletion
 *
 * @returns Token, User object
 */
module.exports.delete_account_get = async (req, res) => {
	try {
		const urlToken = req.params.token;
		const tokenFound = await Token.findOne({ token: urlToken });
		if (!tokenFound) {
			throw {
				error: {
					type: "Non-existence",
					message: "Unable to find a valid token or Token already expired",
				},
			};
		}

		const userFound = await User.findOne({ _id: tokenFound._userId });
		if (!userFound) {
			throw {
				error: {
					type: "Non-existence",
					message: "Unable to find a user associated with token",
				},
			};
		}

		return res.status(200).send({
			success: {
				token: tokenFound._id,
				user: userFound._id,
			},
		});

		// Note: in the front end you can determine whether to display form
		// for password reset or not depending on the response. if you get a
		// token display the form, if not display error
	} catch (error) {
		console.error(error);
		return res.status(400).send({ ...error, status: "error" });
	}
};

/** //* Controller for account deletion
 *
 * DELETE body: { email: , token: , password: }
 */
module.exports.delete_account_handler_delete = async (req, res) => {
	// return res.send("in progress");
	try {
		const tokenFound = await Token.findOne({ token: req.body.token });
		if (!tokenFound) {
			throw {
				error: {
					status_code: 404,
					type: "Non-existence",
					message: "Unable to find a valid token or Token already expired",
				},
			};
		}

		const userToDelete = await User.findOne({ email: req.body.email });
		if (!userToDelete) {
			throw {
				error: {
					type: "Non-existence",
					message: "Unable to find a user associated with token",
				},
			};
		}

		const validPass = await bcrypt.compare(req.body.password, userToDelete.password);
		if (!validPass)
			throw {
				error: { type: "Authentication failure", message: "Wrong Password." },
			};

		await User.deleteOne({ _id: userToDelete._id });

		//? implement check ifEmailVerified or not?

		res.status(200).json({
			success: {
				type: "Request successful",
				message: `Account successfully deleted`,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ ...error, status: "error" });
	}
};
