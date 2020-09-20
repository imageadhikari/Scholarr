/**
 * ### Classroom Router
 * Express Router for handling classroom routes.
 * @endpoint `api/classrooms`
 */
const classroomRouter = require("express").Router();

/**
 * ### Classroom Controller
 *  Middleware for handling different methods of Classroom
 *
 * #### Available Methods
 * - **Classroom CRUD**
 * 1. classes_get
 * 2. user_classes_get
 * 3. create_class_post
 * 4. class_detail_get
 * 5. update_class_patch
 * 6. class_delete
 *
 * - **Classroom member handling**
 */
const classroomController = require("../controllers/classroomControllers");

const { loggedInVerify, accountOwnerVerify } = require("../middleware/verification");
const { classroomOwnerVerify, classMemberVerify } = require("../middleware/verification");
// const { imagesUpload, fileUpload } = require("../middleware/fileUpload");

//
//
// classroomRouter request methods
// TODO make a possible middleware to implement roles like teacher student so teacher gets more info

/** get all classes available  @method GET @endpoint `api/classrooms` */
classroomRouter.get("/", loggedInVerify, classroomController.classes_get); //!

/** get all classes available for certain user @method GET @endpoint `api/classrooms/:userId`*/
classroomRouter.get(
	"/user/:userId",
	loggedInVerify,
	accountOwnerVerify,
	classroomController.user_classes_get
); //!!

//? CRUD classroom

/** get certain classroom detail @method GET @endpoint `api/classrooms/detail/:classroomId`*/
classroomRouter
	.route("/detail/:classroomId")
	.get(loggedInVerify, classMemberVerify, classroomController.class_detail_get); //!

/** CREATE classroom @method POST @endpoint `api/classrooms/create`*/
classroomRouter.route("/create").post(loggedInVerify, classroomController.create_class_post); //!

/** UPDATE classroom @method PATCH @endpoint `api/classrooms/update/:classroomId`*/
classroomRouter.patch(
	"/update/:classroomId",
	loggedInVerify,
	classroomOwnerVerify,
	classroomController.update_class_patch
); //!

/** delete classroom @method DELETE @endpoint `api/classrooms/delete/:classroomId`*/
classroomRouter.delete(
	"/delete/:classroomId",
	loggedInVerify,
	classroomOwnerVerify,
	classroomController.delete_class_delete
); //!! //!!

//
//
// CLASSROOM MEMBER METHODS
// todo classroom invite, accept, request{via code}

//
//
//INVITE

/** invite users to classroom @method POST @endpoint `api/classrooms/invite/:classroomId/`*/
classroomRouter
	.route("/:classroomId/invite/user")
	.post(loggedInVerify, classroomOwnerVerify, classroomController.classroom_invite_post); //!!

//
//
//REQUEST
/** request to become users for classroom @method POST @endpoint `api/classrooms/request`*/
classroomRouter.route("/request").post(loggedInVerify, classroomController.classroom_request_post); //!!

//
//
//ACCEPT
/** accept requesting members for classroom @method POST @endpoint `api/classrooms/:classroomId/accept_request/:userId`*/
classroomRouter
	.route("/:classroomId/accept_request/:userId")
	.get(loggedInVerify, classroomOwnerVerify, classroomController.accept_request_get); //!

/** accept invited users to classroom @method POST @endpoint `api/classrooms/:classroomId/accept_invite/:userId`*/
classroomRouter
	.route("/:classroomId/accept_invite/:userId")
	.get(classroomController.accept_invite_get); //!
//
//
// LEAVE/DELETE
/** remove invitation classroom @method POST @endpoint `api/classrooms/:classroomId/remove_invite/:userId`*/
classroomRouter
	.route("/:classroomId/remove_invite/:userId")
	.get(loggedInVerify, classroomController.remove_invitation_get); //!!

/** remove request for classroom @method POST @endpoint `api/classrooms/:classroomId/remove_request/:userId`*/
classroomRouter
	.route("/:classroomId/remove_request/:userId")
	.get(loggedInVerify, classroomController.remove_request_get); //!

/** remove enrollment from classroom @method POST @endpoint `api/classrooms/:classroomId/remove_enrollment/:userId`*/
classroomRouter
	.route("/:classroomId/remove_enrolled/:userId")
	.get(loggedInVerify, classroomOwnerVerify, classroomController.remove_enrollment_get); //!!

//
//
// GET LIST OF MEMBERS
/** get list of invited users for classroom @method GET @endpoint `api/classrooms/:classroomId/invited_members`*/
classroomRouter
	.route("/:classroomId/invited_members")
	.get(loggedInVerify, classroomOwnerVerify, classroomController.invited_members_get); //!

/**get list of all requesting users for classroom @method GET @endpoint `api/classrooms/:classroomId/requesting_members`*/
classroomRouter
	.route("/:classroomId/requesting_members")
	.get(loggedInVerify, classroomOwnerVerify, classroomController.member_request_get); //!

/** list of all enrolled users for classroom @method GET @endpoint `api/classrooms/:classroomId/enrolled_members`*/
classroomRouter
	.route("/:classroomId/enrolled_members")
	.get(loggedInVerify, classroomController.enrolled_members_get); //!

module.exports = classroomRouter;
