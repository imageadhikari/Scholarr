/**
 * classes_get
 * class_detail_get
 * user_classes_get
 * create_class_post
 * update_class_patch
 */

// models
const Classroom = require("../models/Classroom");
const User = require("../models/User");

// middleware
const {
	createClassroomValidation,
	updateClassroomValidation,
	inviteUserValidation,
	classroomRequestValidation,
} = require("../middleware/validation");

// utility functions
const { uniqueClassCode } = require("../utils/codeTokensGenerator");
const {
	errorMessage,
	nonExistenceError,
	validationError,
	alreadyMemberError,
	noMemberFoundError,
	notInvitedError,
	notRequestedError,
	ownerAccessDenailError,
} = require("../utils/errorMessages");
const { inviteClassroomEmail } = require("../middleware/classroomEmails");

//CUSTOM ENUM
const memberType = {
	INVITED: "Invited User",
	REQUESTING: "Requesting User",
	ENROLLED: "Enrolled User",
};

const membershipActionType = {
	INVITE: "Invitation",
	REQUEST: "Request",
	ENROLL: "Enrollment",
};

//
//
// Classroom methods

module.exports.classes_get = async (req, res) => {
	try {
		const classrooms = [];
		// looping through each classroom doc
		for await (const doc of Classroom.find()) {
			classrooms.push({
				_creatorId: doc._creatorId,
				_classId: doc._id,
				classCode: doc.classCode,
				className: doc.className,
				classDescription: doc.classDescription,
			});
		}

		return res.status(200).send(classrooms);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 * ### class_detail_get
 * **prerequisites: loggedInVerify, classMemberVerify**
 * @param {object} req
 * @param {object} res
 * @returns {object} Either: response Classroom, OR: error
 */
module.exports.class_detail_get = async (req, res) => {
	try {
		const classroomFound = req.customField.classroom;
		let classroom = null;

		if (req.customField.reqUser.isCreator) classroom = classroomFound;
		else if (req.customField.reqUser.isMember)
			classroom = {
				_id: classroomFound._id,
				createdAt: classroomFound.createdAt,
				updatedAt: classroomFound.updatedAt,
				className: classroomFound.className,
				classDescription: classroomFound.classDescription,
				classCode: classroomFound.classCode,
				classMembers: classroomFound.classMembers.enrolledMembers,
				classWorks: classroomFound.classWorks,
			};
		else
			classroom = {
				_id: classroomFound._id,
				createdAt: classroomFound.createdAt,
				className: classroomFound.className,
				classDescription: classroomFound.classDescription,
				classCode: classroomFound.classCode,
			};

		return res.status(200).send(classroom);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

module.exports.user_classes_get = async (req, res) => {
	try {
		// check Endpoint
		const userFound = req.user;

		const classesAttendingFound = await Classroom.find({
			_id: { $in: userFound.classroom.classesAtending },
		});
		const classesTeachingFound = await Classroom.find({
			_id: { $in: userFound.classroom.classesTeaching },
		});

		const attending = [];
		const teaching = [];

		for (let doc of classesAttendingFound) {
			attending.push({
				_creatorId: doc._creatorId,
				_classId: doc._id,
				classCode: doc.classCode,
				className: doc.className,
				classDescription: doc.classDescription,
				classMembers: doc.classMembers,
				classWorks: doc.classWorks,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			});
		}

		// more info for teaching classes
		for (let doc of classesTeachingFound) {
			teaching.push(doc);
		}

		return res.status(200).send({
			classesAttending: attending,
			classesTeaching: teaching,
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 * CREATE classroom
 * **prerequisites: loggedInVerify**
 * POST body = {className*: , classDescription: , classSubject: , affiliatedInstitution: ,}
 */
module.exports.create_class_post = async (req, res) => {
	try {
		// validate post body
		const { error } = createClassroomValidation(req.body);
		if (error) throw validationError(error);

		// check uniqueness of class code
		let code = null;
		let unique = false;
		while (unique === false) {
			code = uniqueClassCode();
			let classFound = await Classroom.findOne({ classCode: code });
			if (classFound) unique = false;
			else unique = true;
		}

		let classAttributes = {};
		// required fields created in backend
		classAttributes["_creatorId"] = req.user._id;
		classAttributes["classCode"] = code;

		// since all fields are not required, only those requested are added
		for (let key in req.body) classAttributes[key] = req.body[key];

		const savedClassroom = await new Classroom(classAttributes).save();

		await User.updateOne(
			{ _id: req.user._id },
			{
				$push: { "classroom.classesTeaching": savedClassroom._id },
			}
		);

		return res.status(200).send({
			success: {
				status: 200,
				message: "Classroom created",
				classroomInfo: {
					_id: savedClassroom._id,
					_creatorId: savedClassroom._creatorId,
					className: savedClassroom.className,
					classCode: savedClassroom.classCode,
				},
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 * ### Update class details
 * **prerequisites: loggedInVerify, classOwnerVerify**
 * PATCH body: { className*: ,classDescription: ,classSubject: ,affiliatedInstitution: ,}
 */
module.exports.update_class_patch = async (req, res) => {
	try {
		const { error } = updateClassroomValidation(req.body);
		if (error) throw validationError(error);

		const classroomFound = req.customField.classroom;

		const updateQuery = { $set: {} };
		for (let key in req.body) {
			if (classroomFound[key] && classroomFound[key] != req.body[key])
				updateQuery.$set[key] = req.body[key];
		}

		await Classroom.updateOne({ _id: classroomFound._id }, updateQuery);

		return res.status(200).send({
			Success: {
				status: 200,
				message: "Classroom successfully updated",
				classroomInfo: {
					classId: classroomFound._id,
					creator: classroomFound._creatorId,
				},
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 * ### Delete classroom
 * **pre-requisites: loggedInVerify, classroomOwnerVerify
 * @param {object} req
 * @param {object} res
 */
module.exports.delete_class_delete = async (req, res) => {
	try {
		// GET CLASSROOM
		const classroomFound = req.customField.classroom;

		// GET MEMBERS
		let classroomMembers = [];
		for (let doc of classroomFound.classMembers.enrolledMembers)
			classroomMembers.push(doc.toString());

		// DELETE
		await Classroom.deleteOne({ _id: classroomFound._id });

		// UPDATE USER
		await User.updateOne(
			{ _id: classroomFound._creatorId },
			{
				$pull: {
					"classroom.classesTeaching": classroomFound._id,
				},
			}
		);
		await User.updateMany(
			{ _id: { $in: classroomMembers } },
			{
				$pull: {
					"classroom.classesAttending": classroomFound._id,
					"classroom.classesInvited": classroomFound._id,
					"classroom.classesRequested": classroomFound._id,
				},
			}
		);

		return res.status(202).send({
			success: {
				status: 202,
				type: "Request Accepted!",
				message: "Classroom sucessfully deleted",
				_classroomId: classroomFound._id,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//
//
// ? classroom members methods

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {string} memberType
 */
const getMemberList = async (req, res, reqMemberType) => {
	try {
		const classroomFound = await Classroom.findOne({ _id: req.params.classroomId });
		if (!classroomFound) throw nonExistenceError("classroom");

		let users = [];
		let errorUsers = [];
		let memberArray = [];

		if (reqMemberType === memberType.INVITED)
			for (let doc of classroomFound.classMembers.invitedMembers)
				memberArray.push(doc.toString());
		else if (reqMemberType === memberType.REQUESTING)
			for (let doc of classroomFound.classMembers.memberRequest)
				memberArray.push(doc.toString());
		else if (reqMemberType === memberType.ENROLLED)
			for (let doc of classroomFound.classMembers.enrolledMembers)
				memberArray.push(doc.toString());

		for (let doc of memberArray) {
			const userFound = await User.findById(doc);

			if (!userFound) errorUsers.push(doc);
			else
				users.push({
					_id: userFound._id,
					username: userFound.username,
					email: userFound.email,
					displayName: `${userFound.firstName} ${userFound.lastName}`,
					bio: userFound.bio,
					avatarImage: userFound.avatarImage,
					coverImage: userFound.coverImage,
				});
		}

		return res.status(200).send({
			success: {
				status: 200,
				type: "Request Successful",
				message: `${reqMemberType} from ${classroomFound.className}(_id:${classroomFound._id}) obtained`,
				memberType: reqMemberType,
				users: users,
				errorUsers: errorUsers,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//invite
/**
 * Invite bulk users to class
 * @method POST body [ {userId: , username: , email: } ]
 * NOTE: You can use any of the attributes just make sure to use one
 */
module.exports.classroom_bulk_invite_post = async (req, res) => {
	try {
		//check req.body
		if (!req.body.userId && !req.body.username && !req.body.email)
			throw {
				errro: {
					status: 400,
					type: "Request Error",
					message: "Request body does not have any of the required fields",
				},
			};

		// validate if fields are string
		const { error } = inviteUserValidation(req.body);
		if (error) throw validationError(error);

		// check if classroom exists
		const classroomFound = await Classroom.findById(req.params.classroomId);
		if (!classroomFound) throw nonExistenceError("classroom");

		//classroom creator details
		const classroomCreator = req.user;
		// const classroomCreator = await User.findById(classroomFound._creatorId);

		// get the list of users
		let users = [];
		let errorUsers = [];

		// handle each user from req.body ie add them to invited members etc
		for (doc of req.body) {
			const userFound = await User.findOne({
				$or: [{ _id: doc.userId }, { username: doc.username }, { email: doc.email }],
			});
			if (!userFound) errorUser.push(doc);
			else {
				// update user details
				await User.updateOne(
					{ _id: userFound.id },
					{ $push: { "classroom.classesInvited": classroomFound._id } }
				);

				// update classroom details
				await Classroom.updateOne(
					{ _id: classroomFound._id },
					{ $push: { "classMembers.invitedmembers": userFound._id } }
				);

				users.push({
					_id: userFound.id,
					username: userFound.username,
					email: userFound.email,
				});
			}
		}

		const classroomDetails = {
			_id: classroomFound._id,
			_creatorId: classroomFound._creatorId,
			creatorUsername: classroomCreator.username,
			className: classroomFound.className,
			classCode: classroomFound.classCode,
		};

		let userEmails = [];
		for (let doc of users) userEmails.push(doc.email);

		//send emails
		const mailResponse = await inviteClassroomEmail(req, classroomDetails, userEmails);
		if (mailResponse) throw mailResponse;

		return res.status(200).send({
			Success: {
				status: 200,
				type: "Request Successful",
				message: "Invitation successfully sent!",
				invitedUsers: users,
				unsuccessfulInvites: errorUsers,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/**
 * Invite single user to class
 * @method POST body [ {userId: , username: , email: } ]
 * NOTE: You can use any of the attributes just make sure to use one
 */
module.exports.classroom_invite_post = async (req, res) => {
	try {
		//check req.body
		if (!req.body.userId && !req.body.username && !req.body.email)
			throw {
				errro: {
					status: 400,
					type: "Request Error",
					message: "Request body does not have any of the required fields",
				},
			};

		// validate if fields are string
		const { error } = inviteUserValidation(req.body);
		if (error) throw validationError(error);

		// check if classroom exists
		const classroomFound = req.customField.classroom;
		// const classroomFound = await Classroom.findById(req.params.classroomId);
		// if (!classroomFound) throw nonExistenceError("classroom");

		//classroom creator details
		const classroomCreator = req.user;
		// const classroomCreator = await User.findById(classroomFound._creatorId);

		const userToInvite = await User.findOne({
			$or: [
				{ _id: req.body.userId },
				{ username: req.body.username },
				{ email: req.body.email },
			],
		});
		if (!userToInvite) throw nonExistenceError("invited user");
		// const userToInvite = userFound.toJSON();

		//check already member or already invited or reuested
		let isEnrolled = classroomFound.classMembers.enrolledMembers.some(
			(doc) => doc.toString() === userToInvite._id.toString()
		);
		let isInvited = classroomFound.classMembers.invitedMembers.some(
			(doc) => doc.toString() === userToInvite._id.toString()
		);
		let isRequested = classroomFound.classMembers.memberRequest.some(
			(doc) => doc.toString() === userToInvite._id.toString()
		);

		if (isEnrolled)
			throw errorMessage(400, "Bad Requested", "User is already enrolled in classroom");
		else if (isInvited)
			throw errorMessage(400, "Bad Requested", "User has already been invited");
		else if (isRequested)
			throw errorMessage(
				400,
				"Bad Requested",
				"User has requested to enroll. Please accept request instead."
			);

		// update user details
		await User.updateOne(
			{ _id: userToInvite.id },
			{ $push: { "classroom.classesInvited": classroomFound._id } }
		);

		// update classroom details
		await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $push: { "classMembers.invitedMembers": userToInvite._id } }
		);

		const classroomDetails = {
			_id: classroomFound._id,
			_creatorId: classroomFound._creatorId,
			creatorUsername: classroomCreator.username,
			className: classroomFound.className,
			classCode: classroomFound.classCode,
		};

		const userDetails = {
			_id: userToInvite._id,
			username: userToInvite.username,
			email: userToInvite.email,
		};

		//send emails
		const mailResponse = await inviteClassroomEmail(req, classroomDetails, userDetails);
		if (mailResponse) throw mailResponse;

		return res.status(200).send({
			Success: {
				status: 200,
				type: "Request Successful",
				message: "Invitation successfully sent!",
				invitedUser: userDetails,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//invited members
module.exports.invited_members_get = async (req, res) => {
	await getMemberList(req, res, memberType.INVITED);
};

//accept invite
module.exports.accept_invite_get = async (req, res) => {
	try {
		//check user exists
		const userFound = await User.findById(req.params.userId);
		if (!userFound) throw nonExistenceError("User");

		//find classroom
		const classroomFound = await Classroom.findById(req.params.classroomId);
		if (!classroomFound) throw nonExistenceError("classroom");

		//check invited and not member
		const member = classroomFound.classMembers.enrolledMembers.some(
			(doc) => userFound._id.toString() === doc.toString()
		);
		if (member) throw alreadyMemberError;

		const invited = classroomFound.classMembers.invitedMembers.some(
			(doc) => userFound._id.toString() === doc.toString()
		);
		if (!invited) throw notInvitedError;

		// update classroom details
		await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $push: { "classMembers.enrolledMembers": userFound._id } }
		);
		await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $pull: { "classMembers.invitedMembers": userFound._id } }
		);

		// update user details
		await User.updateOne(
			{ _id: userFound._id },
			{ $push: { "classroom.classesAttending": classroomFound._id } }
		);
		await User.updateOne(
			{ _id: userFound._id },
			{ $pull: { "classroom.classesInvited": classroomFound._id } }
		);

		return res.status(200).send({
			Success: {
				status: 200,
				type: "Request Successful",
				message: "Invitation Accepted!",
				classroom: { _id: classroomFound._id, className: classroomFound.className },
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//request via class code
/**
 * body { classCode: ,}
 */
module.exports.classroom_request_post = async (req, res) => {
	try {
		// validate if fields are string
		const { error } = classroomRequestValidation(req.body);
		if (error) throw validationError(error);

		// check if classroom exists
		const classroomFound = (
			await Classroom.findOne({ classCode: req.body.classCode })
		).toJSON();
		if (!classroomFound) throw nonExistenceError("classroom");

		// if loggedIn
		const requestingUser = req.user; //strictly use this after loggedUserExistsVerify

		// check already enrolled, invited or requested
		let isEnrolled = classroomFound.classMembers.enrolledMembers.some(
			(doc) => doc.toString() === requestingUser._id.toString()
		);
		let isInvited = classroomFound.classMembers.invitedMembers.some(
			(doc) => doc.toString() === requestingUser._id.toString()
		);
		let isRequested = classroomFound.classMembers.memberRequest.some(
			(doc) => doc.toString() === requestingUser._id.toString()
		);

		if (isEnrolled)
			throw errorMessage(400, "Bad Requested", "User is already enrolled in classroom");
		else if (isInvited)
			throw errorMessage(400, "Bad Requested", "User has already been invited");
		else if (isRequested)
			throw errorMessage(400, "Bad Requested", "User has already requested to join.");

		// update classroom details
		const updatedClassroom = await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $push: { "classMembers.memberRequest": requestingUser._id } }
		);

		// update user details
		const updatedUser = await User.updateOne(
			{ _id: requestingUser._id },
			{ $push: { "classroom.classesRequested": classroomFound._id } }
		);

		const classroomDetails = {
			_id: classroomFound._id,
			_creatorId: classroomFound._creatorId,
			className: classroomFound.className,
			classCode: classroomFound.classCode,
		};

		return res.status(200).send({
			Success: {
				status: 200,
				type: "Request Successful",
				message: "Request for classroom successfully sent!",
				requestedClassroom: classroomDetails,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

// accept Request
module.exports.accept_request_get = async (req, res) => {
	try {
		//check user exists
		const userToAccept = await User.findById(req.params.userId);
		if (!userToAccept) throw nonExistenceError("User");

		//find classroom
		const classroomFound = req.customField.classroom;

		//check requested and not member
		const member = classroomFound.classMembers.enrolledMembers.some(
			(doc) => userToAccept._id.toString() === doc.toString()
		);
		if (member) throw alreadyMemberError;

		const requested = classroomFound.classMembers.memberRequest.some(
			(doc) => userToAccept._id.toString() === doc.toString()
		);
		if (!requested) throw notRequestedError;

		// update classroom details
		await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $push: { "classMembers.enrolledMembers": userToAccept._id } }
		);
		await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $pull: { "classMembers.memberRequest": userToAccept._id } }
		);

		// update user details
		await User.updateOne(
			{ _id: userToAccept._id },
			{ $push: { "classroom.classesAttending": classroomFound._id } }
		);
		await User.updateOne(
			{ _id: userToAccept._id },
			{ $pull: { "classroom.classesRequested": classroomFound._id } }
		);

		return res.status(200).send({
			Success: {
				status: 200,
				type: "Request Successful",
				message: "Member Request Accepted!",
				classroom: { _id: classroomFound._id, className: classroomFound.className },
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//requesting members
module.exports.member_request_get = async (req, res) => {
	await getMemberList(req, res, memberType.REQUESTING);
};

//enrolled members
module.exports.enrolled_members_get = async (req, res) => {
	getMemberList(req, res, memberType.ENROLLED);
};

//delete
// general fxn
const removeMembers = async (req, res, membershipAction) => {
	try {
		// checke Logged in
		// let a = req.user;

		const classroomToRemoveFrom = (await Classroom.findById(req.params.classroomId)).toJSON();
		if (!classroomToRemoveFrom) throw nonExistenceError("classroom");

		const memberToRemove = (await User.findById(req.params.userId)).toJSON();
		if (!memberToRemove) throw nonExistenceError("user");

		let a = memberToRemove._id.toString();
		let b = req.user._id.toString();
		// IDs
		// check req.user is owner of account or is creator
		let isReqUserAccountOwner = req.user._id.toString() === memberToRemove._id.toString();
		let isReqUserClassCreator =
			req.user._id.toString() === classroomToRemoveFrom._creatorId.toString();

		if (!isReqUserAccountOwner && !isReqUserClassCreator) throw ownerAccessDenailError;

		// for invitations
		if (membershipAction === membershipActionType.INVITE) {
			if (
				classroomToRemoveFrom.classMembers.invitedMembers.some(
					(doc) => memberToRemove._id.toString() === doc.toString()
				)
			) {
				await Classroom.updateOne(
					{ _id: classroomToRemoveFrom._id },
					{ $pull: { "classMembers.invitedMembers": memberToRemove._id } }
				);
				await User.updateOne(
					{ _id: memberToRemove._id },
					{
						$pull: {
							"classroom.classesInvited": classroomToRemoveFrom._id,
						},
					}
				);
			} else {
				throw noMemberFoundError;
			}
		}
		// for membership request
		else if (membershipAction === membershipActionType.REQUEST) {
			let tool = classroomToRemoveFrom.classMembers.memberRequest;
			for (let doc of tool) console.log(doc.toString());
			let bool = classroomToRemoveFrom.classMembers.memberRequest.some(
				(doc) => memberToRemove._id.toString() === doc.toString()
			);
			if (
				classroomToRemoveFrom.classMembers.memberRequest.some(
					(doc) => memberToRemove._id.toString() === doc.toString()
				)
			) {
				await Classroom.updateOne(
					{ _id: classroomToRemoveFrom._id },
					{ $pull: { "classMembers.memberRequest": memberToRemove._id } }
				);
				await User.updateOne(
					{ _id: memberToRemove._id },
					{ $pull: { "classroom.classesRequested": classroomToRemoveFrom._id } }
				);
			} else {
				throw noMemberFoundError;
			}
		}
		// for enrollments
		else if (membershipAction === membershipActionType.ENROLL) {
			if (
				classroomToRemoveFrom.classMembers.enrolledMembers.some(
					(doc) => memberToRemove._id.toString() === doc.toString()
				)
			) {
				const updatedClassroom = await Classroom.updateOne(
					{ _id: classroomToRemoveFrom._id },
					{ $pull: { "classMembers.enrolledMembers": memberToRemove._id } }
				);
				const updatedUser = await User.updateOne(
					{ _id: memberToRemove._id },
					{ $pull: { "classroom.classesAttending": classroomToRemoveFrom._id } }
				);
			} else {
				throw noMemberFoundError;
			}
		}

		return res.status(200).send({
			success: {
				status: 200,
				type: "Request Success!",
				message: "Member removed sucessfully",
				targetAction: membershipAction,
				user: {
					_id: memberToRemove._id,
					username: memberToRemove.username,
					email: memberToRemove.email,
				},
				classroom: {
					_id: classroomToRemoveFrom._id,
					classCode: classroomToRemoveFrom.classCode,
					className: classroomToRemoveFrom.className,
				},
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

//invite
module.exports.remove_invitation_get = async (req, res) => {
	await removeMembers(req, res, membershipActionType.INVITE);
};

//request
module.exports.remove_request_get = async (req, res) => {
	await removeMembers(req, res, membershipActionType.REQUEST);
};

//class membership
module.exports.remove_enrollment_get = async (req, res) => {
	await removeMembers(req, res, membershipActionType.ENROLL);
};
