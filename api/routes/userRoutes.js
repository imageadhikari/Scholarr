const userRouter = require("express").Router();
const userController = require("../controllers/userControllers");
const { loggedInVerify } = require("../middleware/verification");
const { imagesUpload } = require("../middleware/fileUpload");
const { accountOwnerVerify } = require("../middleware/verification");

//
//
//* userRouter request methods

// ? READ

userRouter.get("/", loggedInVerify, userController.users_get); //!

userRouter.get("/:userId", loggedInVerify, userController.user_detail_get); //!

userRouter.get(
	"/:userId/private",
	loggedInVerify,
	accountOwnerVerify,
	userController.user_detail_private_get
); //!

// ? CREATE

userRouter.post("/group_users", userController.group_users_post); //!

// ? UPDATE

userRouter.patch(
	"/:userId/profile/edit",
	loggedInVerify,
	accountOwnerVerify,
	userController.update_user_patch
); //!

userRouter.patch(
	"/:userId/image/upload",
	loggedInVerify,
	imagesUpload,
	userController.upload_user_images_patch
);

// TODO FILE UPLOAD HANDLING

// ? EXPORTS

module.exports = userRouter;
