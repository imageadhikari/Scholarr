const { verifyConnection, transporter } = require("../../config/nodemailer");

/**
 *
 * @param {object} req Request body
 * @param {object} classroomDetails Classroom document
 * @param {array} userEmails
 */
module.exports.inviteBulkClassroomEmail = async (req, classroomDetails, userEmails) => {
	await verifyConnection();

	const message = {
		from: process.env.GMAIL_USER,
		to: user.email,
		subject: "[Scholarr] Classroom Invite",
		html: `<html>
		<head>
			<style>
				body {
					font-family: "Muli", sans-serif;
					font-size: 20px;
				}
	
				p.custom {
					line-height: 1.5;
					text-align: left;
					margin: 0 2rem;
				}
	
				h1.custom {
					font-family: "Libre Baskerville", serif;
					font-size: 3em;
					font-weight: bold;
					text-align: center;
				}
	
				div.container {
					margin: 10vh 5vw;
					padding: 1rem;
					display: flex;
					justify-content: center;
				}
	
				div.custom {
					padding: 2em;
					display: grid;
					border-style: solid;
					border-color: #000000;
					border-radius: 1em;
					min-width: 80%;
				}
	
				a.button_outline {
					position: relative;
					background: transparent;
					color: black;
					font-size: 14px;
					border-color: black;
					border-style: solid;
					border-width: 3px;
					border-radius: 10px;
					padding: 10px 40px;
					margin: 10px 0px;
					text-transform: uppercase;
					text-decoration: none;
					transition: all 0.2s linear;
				}
				a.button_outline:hover {
					color: white;
					background: black;
					border-color: white;
					transition: all 0.2s linear;
				}
	
				a.button_outline:active {
					border-radius: 22px;
				}
			</style>
		</head>
		<body>
			<link
				href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Muli:wght@400;700&display=swap"
				rel="stylesheet"
			/>
			<div class="container">
				<div class="custom">
					<h1 class="custom">Classroom Invitation</h1>
					<p class="custom">
						Dear <strong>User</strong>,<br />
						You have been invited to become a member of a classroom by
						<strong>${classroomDetails.creatorUsername}</strong> . Please check the details
						regarding the classroom below.<br /><br />
	
						<strong style="font-size: 1.7rem">Classroom Details</strong><br />
						<strong>Name</strong> : ${classroomDetails.className}<br />
						<strong>Description</strong> : ${classroomDetails.classDescription}<br />
						<strong>Code</strong> : ${classroomDetails.classCode}<br />
						<strong>Creator</strong> : ${classroomDetails.creatorUsername}<br /><br />
	
						To <strong>accept</strong> invite, check your invite dashboard.<br />

						Thank you for using our services. Have a blast!
						<br /><br />
						Sincerely,
						<br />
						<strong> The Scholarr Team </strong>
					</p>
				</div>
			</div>
		</body>
	</html>`,
	};

	// Send Message
	try {
		const success = await transporter.sendMail(message);
		console.log("The verification email has been sent\nSuccess : " + success);
	} catch (err) {
		console.log("An error occured");
		return err;
	}
};

/**
 *
 * @param {object} req Request body
 * @param {object} classroomDetails Classroom document
 * @param {array} userEmails
 */
module.exports.inviteClassroomEmail = async (req, classroomDetails, userDetails) => {
	await verifyConnection();
	const endpoint = `${req.headers.host}/api/classrooms/${classroomDetails._id}/accept_invite/${userDetails._id}`;

	const message = {
		from: process.env.GMAIL_USER,
		to: userDetails.email,
		subject: "[Scholarr] Classroom Invite",
		html: `<html>
		<head>
			<style>
				body {
					font-family: "Muli", sans-serif;
					font-size: 20px;
				}
	
				p.custom {
					line-height: 1.5;
					text-align: left;
					margin: 0 2rem;
				}
	
				h1.custom {
					font-family: "Libre Baskerville", serif;
					font-size: 3em;
					font-weight: bold;
					text-align: center;
				}
	
				div.container {
					margin: 10vh 5vw;
					padding: 1rem;
					display: flex;
					justify-content: center;
				}
	
				div.custom {
					padding: 2em;
					display: grid;
					border-style: solid;
					border-color: #000000;
					border-radius: 1em;
					min-width: 80%;
				}
	
				a.button_outline {
					position: relative;
					background: transparent;
					color: black;
					font-size: 14px;
					border-color: black;
					border-style: solid;
					border-width: 3px;
					border-radius: 10px;
					padding: 10px 40px;
					margin: 10px 0px;
					text-transform: uppercase;
					text-decoration: none;
					transition: all 0.2s linear;
				}
				a.button_outline:hover {
					color: white;
					background: black;
					border-color: white;
					transition: all 0.2s linear;
				}
	
				a.button_outline:active {
					border-radius: 22px;
				}
			</style>
		</head>
		<body>
			<link
				href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Muli:wght@400;700&display=swap"
				rel="stylesheet"
			/>
			<div class="container">
				<div class="custom">
					<h1 class="custom">Classroom Invitation</h1>
					<p class="custom">
						Dear <strong>${userDetails.username}</strong>,<br />
						You have been invited to become a member of a classroom by
						<strong>${classroomDetails.creatorUsername}</strong> . Please check the details
						regarding the classroom below.<br /><br />
	
						<strong style="font-size: 1.7rem">Classroom Details</strong><br />
						<strong>Name</strong> : ${classroomDetails.className}<br />
						<strong>Description</strong> : ${classroomDetails.classDescription}<br />
						<strong>Code</strong> : ${classroomDetails.classCode}<br />
						<strong>Creator</strong> : ${classroomDetails.creatorUsername}<br /><br />
	
						To <strong>accept</strong> invite, check your invite dashboard.<br />
						Or, Click button to accept invite:<br /><br />
						<a href="${endpoint}" class="button_outline">${endpoint}</a><br /><br />
						Or, you can copy the link below into your web browser:<br />
						<a href="${endpoint}" style="font-style: italic">${endpoint}</a>
						<br /><br />
						Thank you for using our services. Have a blast!
						<br /><br />
						Sincerely,
						<br />
						<strong> The Scholarr Team </strong>
					</p>
				</div>
			</div>
		</body>
	</html>`,
	};

	// Send Message
	try {
		const success = await transporter.sendMail(message);
		console.log("The verification email has been sent\nSuccess : " + success);
	} catch (err) {
		console.log("An error occured");
		return err;
	}
};
