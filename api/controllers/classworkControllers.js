/**
 * classworks_get
 * classwork_detail_get
 * create_classwork_post
 * update_classwork_patch
 * submit_classwork_post
 * update_classwork_submissioin_patch
 */

// models
const Classroom = require("../models/Classroom");
const User = require("../models/User");
const { Classwork, ClassworkComment } = require("../models/Classwork");

// utility functions
const {
	errorMessage,
	nonExistenceError,
	validationError,
	reqBodyError,
} = require("../utils/errorMessages");

// middleware
const {
	assignmentCWValidation,
	testCWValidation,
	questionCWValidation,
	generalCWValidation,
	materialCWValidation,
	updateQuestionCWValidation,
} = require("../middleware/validation");

//CUSTOM ENUM
const classworkType = {
	ALL: "All Classwork",
	ASSIGNMENT: "Asssigment",
	TEST: "Test",
	QUESTION: "Question",
	MATERIAL: "Material",
	GENERAL: "Generic",
};

//
//
// Classwork methods

//
//
// ! GET METHODS

/**
 * Get a list of all the classworks of given type
 * @param {object} req
 * @param {object} res
 * @param {string} reqClassworkType
 */
const getClassworkList = async (req, res, reqClassworkType) => {
	try {
		const paramsClassroomFound = (
			await Classroom.findOne({ _id: req.params.classroomId })
		).toJSON();
		if (!paramsClassroomFound) throw nonExistenceError("classroom");

		let reqClassworks = [];
		if (reqClassworkType != classworkType.ALL)
			reqClassworks = paramsClassroomFound.classworks.filter(
				(doc) => doc.classworkType === reqClassworkType
			);
		else reqClassworks = paramsClassroomFound.classworks;

		let errorClassworkArray = [];
		let classworkDocArray = [];

		for (let doc of reqClassworks) {
			let classworkFound = await Classwork.findById(doc._classworkId);
			if (!classworkFound) errorClassworkArray.push(doc._classworkId);
			else classworkDocArray.push(classworkFound);
		}

		return res.status(200).send({
			success: {
				status: 200,
				type: "Request Successful",
				message: `${reqClassworkType} from ${paramsClassroomFound.className}(_id:${paramsClassroomFound._id}) obtained`,
				classworkType: reqClassworkType,
				classworks: classworkDocArray,
				errorClassworks: errorClassworkArray,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** list view of classworks
 * @method GET
 */
module.exports.classworks_get = async (req, res) => {
	await getClassworkList(req, res, classworkType.ALL);
};

/** list of assignments
 * @method GET
 */
module.exports.assignment_classworks_get = async (req, res) => {
	await getClassworkList(req, res, classworkType.ASSIGNMENT);
};

/** list of TEST
 * @method GET
 */
module.exports.test_classworks_get = async (req, res) => {
	await getClassworkList(req, res, classworkType.TEST);
};

/** list of questions
 * @method GET
 */
module.exports.question_classworks_get = async (req, res) => {
	await getClassworkList(req, res, classworkType.QUESTION);
};

/** list of materials
 * @method GET
 */
module.exports.material_classworks_get = async (req, res) => {
	await getClassworkList(req, res, classworkType.MATERIAL);
};

/** list of general
 * @method GET
 */
module.exports.general_classworks_get = async (req, res) => {
	await getClassworkList(req, res, classworkType.GENERAL);
};

/** Read Detail view of a classwork
 *
 * **NOTE: must use classworkExistVerify, classMemberVerify middlewares before this**
 * @method GET
 */
module.exports.classwork_detail_get = async (req, res) => {
	try {
		//classwork first check classwork belongs to classroom, then check classmember
		// NOTE: must use classworkExistVerify, classMemberVerify middlewares before this
		let paramClasswork = req.customField.classwork;

		res.status(200).send({
			success: { status: 200, type: "Request Successful", classwork: paramClasswork },
		});
	} catch (err) {}
};

//
//
// ! CREATE methods
const createClasswork = async (req, res, reqClassworkType) => {
	try {
		const classroomFound = req.customField.classroom;

		let classworkAttributes = {};
		classworkAttributes["_classroomId"] = classroomFound._id;
		classworkAttributes["classworkType"] = reqClassworkType;

		for (key in req.body) classworkAttributes[key] = req.body[key];
		const savedClasswork = await new Classwork(classworkAttributes).save();

		//update classroom
		let classworkInfo = {
			classworkType: savedClasswork.classworkType,
			_classworkId: savedClasswork._id,
		};
		await Classroom.updateOne(
			{ _id: classroomFound._id },
			{ $push: { classworks: classworkInfo } }
		);

		//update user
		let userClassworkInfo = {
			classroom: classroomFound._id,
			classwork: savedClasswork._id,
		};
		// let memberIds = [];
		// for (doc of classroomFound.classMembers.enrolledMembers) memberIds.push(doc._memberId);
		let memberIds = classroomFound.classMembers.enrolledMembers;
		await User.updateMany(
			{ _id: { $in: memberIds } },
			{ $push: { classworks: userClassworkInfo } }
		);

		return res.status(200).send({
			success: {
				status: 201,
				type: "Request Successful!",
				message: "Classwork Successfully Created.",
				classworkType: reqClassworkType,
				classworkDetails: savedClasswork,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** CREATE assignment
 * @method POST @type form/multipart
 * body: {*title: ,description: ,*totalGrade: ,*deadlineDate: , attachments: `files`}
 */
module.exports.create_assignment_post = async (req, res) => {
	try {
		const { error } = await assignmentCWValidation(req.body);
		if (error) throw validationError(error);

		await createClasswork(req, res, classworkType.ASSIGNMENT);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** CREATE TEST
 * @method POST @type form/multipart
 * body: {*title: ,description: ,*totalGrade: ,*deadlineDate: ,attachments: `files`}
 */
module.exports.create_test_post = async (req, res) => {
	try {
		const { error } = await testCWValidation(req.body);
		if (error) throw validationError(error);

		await createClasswork(req, res, classworkType.TEST);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** CREATE material
 * @method POST @type form/multipart
 * body: {*title: ,description: , attachments: `files`}
 */
module.exports.create_material_post = async (req, res) => {
	try {
		const { error } = await materialCWValidation(req.body);
		if (error) throw validationError(error);

		await createClasswork(req, res, classworkType.MATERIAL);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** CREATE question
 * @method POST
 * body: {*title: ,description: ,*deadlineDate: ,}
 */
module.exports.create_question_post = async (req, res) => {
	try {
		const { error } = await questionCWValidation(req.body);
		if (error) throw validationError(error);

		await createClasswork(req, res, classworkType.QUESTION);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

/** CREATE general
 * @method POST
 * body: {*title: ,description: ,}
 */
module.exports.create_general_post = async (req, res) => {
	try {
		const { error } = await generalCWValidation(req.body);
		if (error) throw validationError(error);

		await createClasswork(req, res, classworkType.GENERAL);
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

// ! UPDATE methods

/** UPDATE classwork
 * @method PATCH @type form/multipart
 * body: `REFER TO CORRESPONDING CLASSWORK CREATE BODY WHERE NO FIELD IS REQUIRED`
 */
module.exports.update_classwork_patch = async (req, res) => {
	try {
		//first check classroom owner, clssworkExists, then update
		const classworkFound = req.customField.classwork;
		const reqClassworkType = classworkFound.classworkType;

		// verify req body
		if (reqClassworkType === classworkType.ASSIGNMENT) {
			const { error } = await updateAssignmentCWValidation(req.body);
			if (error) throw validationError(error);
		} else if (reqClassworkType === classworkType.GENERAL) {
			const { error } = await updateGeneralCWValidation(req.body);
			if (error) throw validationError(error);
		} else if (reqClassworkType === classworkType.MATERIAL) {
			const { error } = await updateMaterialCWValidation(req.body);
			if (error) throw validationError(error);
		} else if (reqClassworkType === classworkType.QUESTION) {
			const { error } = await updateQuestionCWValidation(req.body);
			if (error) throw validationError(error);
		} else if (reqClassworkType === classworkType.TEST) {
			const { error } = await updateTestCWValidation(req.body);
			if (error) throw validationError(error);
		} else {
			throw reqBodyError;
		}

		//classwork update
		const updateQuery = { $set: {} };

		for (let key in req.body) {
			if (classworkFound[key] && classworkFound[key] != req.body[key])
				updateQuery.$set[key] = req.body[key];
		}

		await Classwork.updateOne({ _id: classworkFound._id }, updateQuery);

		return res.status(200).send({
			success: {
				status: 201,
				type: "Request Successful!",
				message: "Classwork Successfully Updated.",
				classworkType: reqClassworkType,
				classworkId: classworkFound._id,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};

// ! DELETE methods

/** DELETE Classwork
 * @method DELETE
 */
module.exports.delete_classwork_delete = async (req, res) => {
	try {
		//check loggedIn,classroomOwner, classworkExist
		const reqClassroom = req.customField.classroom;
		const reqClasswork = req.customField.classwork;

		//delete
		await Classwork.deleteOne({ _id: reqClasswork._id });

		//update classroom
		await Classroom.updateOne(
			{ _id: reqClassroom._id },
			{ $pull: { classworks: { _classworkId: reqClasswork._id } } }
		);

		//update user
		let memberIds = [];
		for (doc of reqClassroom.classMembers.enrolledMembers) memberIds.push(doc._memberId);
		await User.updateMany(
			{ _id: { $in: memberIds } },
			{ $pull: { "classworks.classwork": reqClasswork._id } }
		);
		return res.status(200).send({
			success: {
				status: 200,
				type: "Request Accepted!",
				message: "Classwork Successfully Deleted",
				classwork: reqClasswork,
			},
		});
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.error(err);
		return res.status(400).send(err);
	}
};
