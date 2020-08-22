//models
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { updateUserValidation } = require("../middleware/validation");
// const { findOneUser } = require("../middleware/utilityFunctions");
const { upload, imagesUpload } = require("../middleware/fileUpload");

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

		// for millions of users use cursor method
		const users = [];
		const cursor = User.find().cursor();
		// console.log(cursor);

		for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
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
		console.error(err);
		return res.status(400).send(err);
	}
};

//
//
// GET User Details
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
		console.error(err);
		return res.status(400).send(err);
	}
};

/** //* Controls PROFILE UPDATE PATCH requests.
 *
 * PATCH body: { _id: , firstName: , middleName: , lastName: , bio: , dateOfBirth: , password: ,}
 */
module.exports.update_user_patch = async (req, res) => {
	try {
		const { error } = updateUserValidation(req.body);
		if (error)
			throw {
				error: {
					message: error.details[0].message,
				},
			};

		// console.log(req.user);

		const userFound = await User.findOne({ _id: req.params.userId });
		if (!userFound)
			throw {
				error: {
					status: 404,
					message: "associated user not found",
				},
			};

		// Check if req user is owner of the user account to be updated
		if (req.user._id != userFound._id)
			throw {
				error: {
					status: 401,
					type: "Access Denied!",
					message: "You do not have permission to edit this!",
				},
			};

		//check password
		const validPass = await bcrypt.compare(req.body.password, userFound.password);
		if (!validPass)
			throw {
				error: { status: 401, type: "Authentication failure", message: "Wrong Password." },
			};

		// check which key needs upgrading
		let query = { $set: {} };
		for (let key in req.body) {
			if (userFound[key] && userFound[key] !== req.body[key])
				//first check if userFound[key] exists && check value different
				query.$set[key] = req.body[key]; // creates a $set object with keys that have different values
		}

		// update the profile
		const updatedProfile = await User.updateOne(
			{
				_userId: req.user._id,
			},
			query //using $set method here to update values
		);

		// console.log(updatedProfile);

		return res.status(200).send({
			Success: {
				status: 200,
				message: "Profile successfully updated",
			},
		});
	} catch (err) {
		console.error(err);
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
		console.error(err);
		return res.status(400).send(err);
	}
};
