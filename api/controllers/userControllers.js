//models
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { updateUserValidation } = require("../middleware/validation");
// const { findOneUser } = require("../middleware/utilityFunctions");
const { upload, imagesUpload } = require("../middleware/fileUpload");
const { wrongPwError, validationError, nonExistenceError } = require("../utils/errorMessages");

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
// 	destination: `${__dirname}/public/upload`,
// 	filename: function (req, file, cb) {
// 		cb(
// 			null,
// 			req.user._id + "-" + file.fieldname + "-" + Date.now() + path.extname(file.originalname)
// 			//this will result in the filename of uploaded file as `[id of user]-[fieldname ie avatar or cover]-timestamp.extension`
// 		);
// 	},
// });

// const upload = multer({ storage: storage }).fields([
// 	{ name: "avatar", maxCount: 1 },
// 	{ name: "cover", maxCount: 1 },
// ]);

//
//
// GET all users
module.exports.users_get = async (req, res) => {
	// const users=
	try {
		// const users = await User.find(); // Good only for small userbase

		// for millions of users and customized use async iterator method method
		const users = [];
		for await (const doc of User.find()) {
			users.push({
				_id: doc._id,
				username: doc.username,
				email: doc.email,
				displayName: `${doc.firstName} ${doc.lastName}`,
				dateOfBirth: doc.dateOfBirth,
				bio: doc.bio,
				avatarImage: doc.avatarImage,
				coverImage: doc.coverImage,
			});
		}

		return res.send(users);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//
//
// POST group of users
/**
 *
 * POST body: { userGroup: [_id1, _id2, _id3, ...],}
 */
module.exports.group_users_post = async (req, res) => {
	try {
		const users = await User.find({ _id: { $in: req.body.userGroup } });
		if (!users)
			throw {
				error: {
					status: 404,
					type: "Non-existence",
					message: "No Users found for given array of ids",
				},
			};

		const group = [];
		for (let doc of users)
			group.push({
				_id: doc._id,
				username: doc.username,
				email: doc.email,
				displayName: `${doc.firstName} ${doc.lastName}`,
				dateOfBirth: doc.dateOfBirth,
				bio: doc.bio,
				avatarImage: doc.avatarImage,
				coverImage: doc.coverImage,
			});

		return res.status(200).send(group);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//
//
// GET User Details
module.exports.user_detail_private_get = async (req, res) => {
	try {
		// const userExists = await findOneUser(req.params.userId);
		const userExists = await User.findOne({ _id: req.params.userId });
		if (!userExists)
			throw {
				error: {
					status: 404,
					type: "Non-existence",
					message: "The user does not exist",
				},
			};

		return res.status(200).send(userExists);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

module.exports.user_detail_get = async (req, res) => {
	try {
		// const userExists = await findOneUser(req.params.userId);
		const userExists = await User.findOne({ _id: req.params.userId });
		if (!userExists)
			throw {
				error: {
					status: 404,
					type: "Non-existence",
					message: "The user does not exist",
				},
			};

		const user = {
			id: userExists._id,
			username: userExists.username,
			email: userExists.email,
			displayName: `${userExists.firstName} ${userExists.lastName}`,
			dateOfBirth: userExists.dateOfBirth,
			bio: userExists.bio,
			avatarImage: userExists.avatarImage,
			coverImage: userExists.coverImage,
		};

		return res.status(200).send(user);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** //* Controls PROFILE UPDATE PATCH requests.
 *
 * PATCH body: { firstName: , middleName: , lastName: , bio: , dateOfBirth: , password: ,}
 */
module.exports.update_user_patch = async (req, res) => {
	try {
		const { error } = await updateUserValidation(req.body);
		if (error) throw validationError(error);

		const userToUpdate = await await (await User.findOne({ _id: req.params.userId })).toJSON();
		if (!userToUpdate) throw nonExistenceError("user");

		const validPass = await bcrypt.compare(req.body.password, userToUpdate.password);
		if (!validPass) throw wrongPwError;

		// update only supplied fields
		let updateQuery = { $set: {} };

		for (let key in req.body) {
			if (key != "password") {
				if (userToUpdate[key] === null) updateQuery.$set[key] = req.body[key];
				else if (userToUpdate[key] && userToUpdate[key] !== req.body[key])
					updateQuery.$set[key] = req.body[key]; //first check if userToUpdate[key] exists && check value different then creates a $set object with keys that have different values
			}
		}

		// ? UPDATE USER
		await User.updateOne(
			{ _id: userToUpdate._id },
			updateQuery //using $set method here to update values
		);

		return res.status(200).send({
			Success: {
				status: 200,
				message: "Profile successfully updated",
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 * //* controls the USER IMAGE UPLOAD PATCH request
 *
 * PATCH method : multipart/form-data  [Since we're dealing with files, JSON is not usable]
 *
 * PATCH form body [key->file i.e. a key which coreesponds to "name" field in html input]
 * @key_1 avatar - for the profile picture or avatar
 * @key_2 cover - for the coverimage
 *
 */
module.exports.upload_user_images_patch = async (req, res) => {
	try {
		const userFound = await User.findOne({ _id: req.params.userId });
		if (!userFound)
			throw {
				error: {
					status: 404,
					message: "associated user not found",
				},
			};

		if (req.user._id != userFound._id)
			throw {
				error: {
					status: 401,
					type: "Access Denied!",
					message: "You do not have permission to edit this!",
				},
			};

		// console.log(req.files);
		imagesUpload(req, res, (err) => {
			console.log(req);
			if (err) {
				return res.status(400).send(err);
			} else {
				console.log(req.files);
				res.send("yahoo");
			}
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};
