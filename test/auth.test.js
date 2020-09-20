const request = require("supertest");
// const app = require("../server");

const appurl = "127.0.0.1:4000";

describe("Test: GET /api/auth", () => {
	test("responds with json", async (done) => {
		const res = await request(appurl).get("/api/auth");
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({
			AuthMethods: {
				auth_get: "This page",
				register: {
					register_get: "GET method",
					register_post: "POST method",
				},
				login: {
					login_get: "GET method",
					login_post: "POST method",
				},
				email_confirmation: {
					email_confirmation_handler_get: "GET method",
					resend_email_confirmation_post: "POST method",
				},
				password_reset: {
					password_reset_email_post: "POST method",
					password_reset_get: "GET method",
					password_reset_handler_patch: "PATCH method",
				},
				delete_account: {
					delete_account_email_post: "POST method",
					delete_account_get: "GET method",
					delete_account_handler_post: "POST method",
				},
			},
		});
		done();
	});
});

describe("Test: GET /api/auth/register", () => {
	test("Res: register POST request info", async (done) => {
		const res = await request(appurl).get("/api/auth/register");

		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({
			location: "REGISTER page",
			REGISTER_method: "POST",
			POST_body: {
				username: "[your username]",
				email: "sample@example.com",
				password: "[pw here]",
			},
		});
		done();
	});
});

describe("Test: POST /api/auth/register", () => {
	test("responds with success json req.body", async (done) => {
		const res = await request(appurl)
			.post("/api/auth/register")
			.set("Accept", "application/json")
			.send({
				username: "sthasam",
				email: "shresthai7772@gmail.com",
				password: "[password]",
			});
		expect(res.status).toBe(201);
		expect(res.body).toMatchObject({
			success: {
				status: 201,
				type: "Sucessful Request!",
				message: "Account succesfully created!",
				userId: /^[a-f\d]{24}$/i,
			},
		});

		// console.log(res.body);

		done();
		// TODO check errors req.body errors, validation errors
	});

	// test("Error Res: Returns error", async (done) => {
	// 	const res = await request(appurl)
	// 		.post("/api/auth/register")
	// 		.set("Accept", "application/json")
	// 		.send({
	// 			username: "sthasam2",
	// 			email: "sthasuraj2@gmail.com",
	// 			password: "[password]",
	// 		});
	// 	expect(res.status).toBe(400);
	// 	expect(res.body).toMatchObject({
	// 		error: { status: /number/, type: /string/, message: /string/ },
	// 	});
	// 	done();
	// });
});

// describe("Test: GET /api/auth/login", () => {
// 	it("responds with json containing login POST req info", (done) => {
// 		const res = request(appurl)
// 			.get("/api/auth/login")
// 			.expect(200)
// 			.expect("Content-Type", /json/, done);

// 		// console.log(res.body);
// 		// done();
// 	});
// });

// const auth_token = null;

// describe("Test: POST /api/auth/login", () => {
// 	it("responds with success json req.body login with headers", (done) => {
// 		const res = request(appurl)
// 			.post("/api/auth/login")
// 			.set("Accept", "application/json")
// 			.send({ email: "sthasuraj2@gmail.com", password: "[password]" })
// 			.expect(
// 				201,
// 				{
// 					success: {
// 						status: 202,
// 						type: "Successful Request",
// 						message: "Login Successful",
// 						auth_token: /some token/,
// 					},
// 				},
// 				done
// 			);

// 		// console.log(res.body);
// 		// TODO check errors req.body errors, validation errors
// 	});
// });

// // email verification

// // resend email token
// describe("Test: POST /api/auth/resend_confirmation", () => {
// 	it("Resends a confirmation mail. Responds with res.body", (done) => {
// 		const res = request(appurl)
// 			.post("/api/auth/resend_confirmation")
// 			.set("Accept", "application/json")
// 			.send({ email: "sthasuraj2@gmail.com", password: "[password]" })
// 			.expect(200, {
// 				success: {
// 					status: 200,
// 					type: "Request successful",
// 					message: "Email confirmation resent",
// 				},
// 			})
// 			.end(done);

// 		// console.log(res.body);
// 		// done();
// 		// TODO check errors req.body errors, validation errors
// 	});
// });
