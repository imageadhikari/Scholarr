const nodemailer = require("nodemailer");

// const dotenv = require("dotenv");
// dotenv.config({ path: "./config/config.env" });

// transporter
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
});

// verify connection
const verifyConnection = async () => {
	transporter.verify((error, success) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Server is ready to send messages");
		}
	});
};

module.exports.transporter = transporter;
module.exports.verifyConnection = verifyConnection;
