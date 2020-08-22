const classroomRouter = require("express").Router();
// const classroomController = require("../controllers/classroomControllers");
const { privateVerify } = require("../middleware/privateVerify");
// const { imagesUpload, fileUpload } = require("../middleware/fileUpload");

// //
// //
// // classroomRouter request methods
// //*  TODO make a possible middleware to implement roles like teacher student so teacher gets more info

// classroomRouter.get(
// 	"/",
// 	privateVerify,
// 	classroomController.classes_get
// ); /** get all classes available  @method GET @endpoint `api/classroom/` */

// classroomRouter.get(
// 	"/:classId",
// 	privateVerify,
// 	classroomController.class_detail_get
// ); /** get certain classroom detail @method GET @endpoint `api/classroom/:classId`*/

// classroomRouter.get(
// 	"/:userId",
// 	privateVerify,
// 	classroomController.user_classes_get
// ); /** get all classes available for certain user @method GET @endpoint `api/classroom/:userId`*/

// classroomRouter.post(
// 	"/:classId/create",
// 	privateVerify,
// 	classroomController.create_class_post
// ); /** CREATE classroom @method PATCH @endpoint `api/classroom/:classId/update`*/

// classroomRouter.patch(
// 	"/:classId/update",
// 	privateVerify,
// 	classroomController.update_class_patch
// ); /** UPDATE classroom @method PATCH @endpoint `api/classroom/:classId/update`*/

// //
// //
// // CLASSWORK methods

// classroomRouter.get(
// 	"/:classId/classworks",
// 	privateVerify,
// 	classroomController.classworks_get
// ); /** get classroom classworks @method GET @endpoint `api/classroom/:classId/classworks`*/

// classroomRouter.get(
// 	"/:classId/classworks/:classworkId",
// 	privateVerify,
// 	classroomController.classwork_detail_get
// ); /** get certain classrooms classwork @method GET @endpoint `api/classroom/:classId/classworks/:classworkId`*/

// classroomRouter.post(
// 	"/:classId/classworks/create",
// 	privateVerify,
// 	classroomController.create_classwork_post
// ); /** create classwork @method GET @endpoint `api/classroom/:classId/classworks/create`*/

// classroomRouter.patch(
// 	"/:classId/classworks/create",
// 	privateVerify,
// 	classroomController.create_classwork_post
// ); /** create classwork @method GET @endpoint `api/classroom/:classId/classworks/create`*/

// //
// //
// // STUDENT SUBMITS

// classroomRouter.post(
// 	"/:classId/classworks/:classworkId/submit",
// 	privateVerify,
// 	classroomController.submit_classwork_post
// ); /** submit classwork @method GET @endpoint `api/classroom/:classId/classworks/:classId/submit`*/

// classroomRouter.post(
// 	"/:classId/classworks/:classworkId/submissionId/update",
// 	privateVerify,
// 	classroomController.update_classwork_submissioin_patch
// ); /** submit classwork @method GET @endpoint `api/classroom/:classId/classworks/:classId/:submissionId/update`*/

module.exports = classroomRouter;
