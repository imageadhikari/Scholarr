const userRouter = require("express").Router();
const userController = require("../controllers/userControllers");
const { privateVerify } = require("../middleware/privateVerify");
const { imagesUpload } = require("../middleware/fileUpload");
//
//
// userRouter request methods
userRouter.get("/", userController.users_get);
userRouter.get("/:userId", userController.user_detail_get);
userRouter.patch("/:userId/profile/edit", privateVerify, userController.update_user_patch);
userRouter.patch(
	"/:userId/image/upload",
	privateVerify,
	imagesUpload,
	userController.upload_user_images_patch
);

module.exports = userRouter;
