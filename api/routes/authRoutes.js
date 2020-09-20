/**
 * User Authentication routes
 *
 * contailns all routes extended by the authRouter
 * root url: `{host_url}/api/auth`
 */

/** @desc auth router
 * @use routes to api/auth */
const authRouter = require("express").Router();

// middlewares
// const privateVerify = require("../middleware/privateVerify");

// controllers
const authController = require("../controllers/authControllers");

//
//
// USER
authRouter.get("/", authController.auth_get); // !

//
//
// REGISTER
// authRouter.get("/register", authController.register_get);
// authRouter.post("/register", authController.register_post);
authRouter.route("/register").get(authController.register_get).post(authController.register_post); //!
//
//
// EMAIL CONFIRMATION
authRouter.get("/confirmation/:token", authController.email_confirmation_handler_get); //!
authRouter.post("/resend_confirmation", authController.resend_email_confirmation_post); //!!

//
//
// LOGIN
// authRouter.get("/login", authController.login_get);
// authRouter.post("/login", authController.login_post);
authRouter.route("/login").get(authController.login_get).post(authController.login_post); //!!

//
//
// RESET PASSWORD

// NOTE: Logic: send email, get token from email, following link takes to reset form, then submit reset form
authRouter.post("/reset_password", authController.reset_password_email_post); //!
authRouter.get("/reset_password/:token", authController.reset_password_get); //!
authRouter.patch("/reset_password/confirm/", authController.reset_password_handler_patch); //!

//
//
// DELETE ACCOUNT
authRouter.post("/delete_account", authController.delete_account_email_post); //!!!
authRouter.get("/delete_account/:token", authController.delete_account_get); //!
authRouter.delete("/delete_account/confirm/", authController.delete_account_handler_delete); //!!

//
//
// exports
module.exports = authRouter;
