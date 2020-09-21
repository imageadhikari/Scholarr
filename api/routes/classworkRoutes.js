/**
 * ### Classroom Router
 * Express Router for handling classroom routes.
 * @endpoint `api/classrooms/cw/`
 */
const classworkRouter = require("express").Router();

const classworkController = require("../controllers/classworkControllers");
const submissionController = require("../controllers/submissionControllers");
const { loggedInVerify } = require("../middleware/verification");
const {
	classroomOwnerVerify,
	classMemberVerify,
	classworkExistVerify,
} = require("../middleware/verification");
//
//
// ! CLASSWORK routes

/** get classroom classworks @method GET @endpoint `api/classrooms/:classroomId/classworks`*/
classworkRouter.get(
	"/:classroomId/classworks",
	loggedInVerify,
	classMemberVerify,
	classworkController.classworks_get
); //!

/** get classroom classworks @method GET @endpoint `api/classrooms/:classroomId/classworks/assignment`*/
classworkRouter.get(
	"/:classroomId/classworks/assignment",
	loggedInVerify,
	classMemberVerify,
	classworkController.assignment_classworks_get
); //!

/** get classroom classworks @method GET @endpoint `api/classrooms/:classroomId/classworks/test`*/
classworkRouter.get(
	"/:classroomId/classworks/test",
	loggedInVerify,
	classMemberVerify,
	classworkController.test_classworks_get
); //!

/** get classroom classworks @method GET @endpoint `api/classrooms/:classroomId/classworks/question`*/
classworkRouter.get(
	"/:classroomId/classworks/question",
	loggedInVerify,
	classMemberVerify,
	classworkController.question_classworks_get
); //!

/** get classroom classworks @method GET @endpoint `api/classrooms/:classroomId/classworks/material`*/
classworkRouter.get(
	"/:classroomId/classworks/material",
	loggedInVerify,
	classMemberVerify,
	classworkController.material_classworks_get
); //!

/** get classroom classworks @method GET @endpoint `api/classrooms/:classroomId/classworks/general`*/
classworkRouter.get(
	"/:classroomId/classworks/general",
	loggedInVerify,
	classMemberVerify,
	classworkController.general_classworks_get
); //!

// classwork CRUD
/** create classwork @method POST @endpoint `api/classrooms/:classroomId/classworks/create_assignment`*/
classworkRouter.post(
	"/:classroomId/classworks/create_assignment",
	loggedInVerify,
	classroomOwnerVerify,
	classworkController.create_assignment_post
); //!

/** create classwork @method POST @endpoint `api/classrooms/:classroomId/classworks/create_test`*/
classworkRouter.post(
	"/:classroomId/classworks/create_test",
	loggedInVerify,
	classroomOwnerVerify,
	classworkController.create_test_post
); //!

/** create classwork @method POST @endpoint `api/classrooms/:classroomId/classworks/create_question`*/
classworkRouter.post(
	"/:classroomId/classworks/create_question",
	loggedInVerify,
	classroomOwnerVerify,
	classworkController.create_question_post
); //!

/** create classwork @method POST @endpoint `api/classrooms/:classroomId/classworks/create_material`*/
classworkRouter.post(
	"/:classroomId/classworks/create_material",
	loggedInVerify,
	classroomOwnerVerify,
	classworkController.create_material_post
); //!

/** create classwork @method POST @endpoint `api/classrooms/:classroomId/classworks/create`*/
classworkRouter.post(
	"/:classroomId/classworks/create_general",
	loggedInVerify,
	classroomOwnerVerify,
	classworkController.create_general_post
); //!

/** get certain classrooms classwork @method GET @endpoint `api/classrooms/:classroomId/classworks/detail/:classworkId`*/
classworkRouter.get(
	"/:classroomId/classworks/detail/:classworkId",
	loggedInVerify,
	classMemberVerify,
	classworkExistVerify,
	classworkController.classwork_detail_get
); //!

/** update classwork @method PATCH @endpoint `api/classrooms/:classroomId/classworks/update/:classworkId`*/
classworkRouter.patch(
	"/:classroomId/classworks/update/:classworkId",
	loggedInVerify,
	classroomOwnerVerify,
	classworkExistVerify,
	classworkController.update_classwork_patch
); //!

/** delete classwork @method DELETE @endpoint `api/classrooms/:classroomId/classworks/delete/:classworkId/`*/
classworkRouter.delete(
	"/:classroomId/classworks/delete/:classworkId",
	loggedInVerify,
	classroomOwnerVerify,
	classworkExistVerify,
	classworkController.delete_classwork_delete
); //!

//
//
// ! Submission routes

/** get submissions @method GET @endpoint `api/classrooms/:classroomId/classworks/:classworkId/submissions`*/
classworkRouter.get(
	"/:classroomId/classworks/:classworkId/submissions",
	loggedInVerify,
	classroomOwnerVerify,
	classworkExistVerify,
	submissionController.submissions_get
); //!

/** get submission detail @method GET @endpoint `api/classrooms/:classroomId/classworks/:classworkId/submissions/detail/:submissionId`*/
classworkRouter.get(
	"/:classroomId/classworks/:classworkId/submissions/detail/:submissionId",
	loggedInVerify,
	classroomOwnerVerify,
	classworkExistVerify,
	submissionController.submission_detail_get
); //!

/** submit classwork @method GET @endpoint `api/classrooms/:classroomId/classworks/:classworkId/submit`*/
classworkRouter.post(
	"/:classroomId/classworks/:classworkId/submit",
	loggedInVerify,
	classMemberVerify,
	classworkExistVerify,
	submissionController.submit_classwork_post
); //!

/** update classwork @method PATCH @endpoint `api/classrooms//:classroomId/classworks/:classworkId/update_submission/:submissionId`*/
classworkRouter.patch(
	"/:classroomId/classworks/:classworkId/update_submission/:submissionId",
	loggedInVerify,
	classMemberVerify,
	classworkExistVerify,
	submissionController.update_classwork_submission_patch
); //!

/** delete classwork @method DELETE @endpoint `api/classrooms/:classroomId/classworks/:classworkId/delete_submission/:submissionId`*/
classworkRouter.delete(
	"/:classroomId/classworks/:classworkId/delete_submission/:submissionId",
	loggedInVerify,
	classMemberVerify,
	classworkExistVerify,
	submissionController.delete_classwork_submission_delete
); //!

module.exports = classworkRouter;
