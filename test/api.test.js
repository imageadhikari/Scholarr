const request = require("supertest");
// const appurl = require("../server");

const appurl = "127.0.0.1:4000";

describe("Test: GET /api", () => {
	test("responds with json", async (done) => {
		const response = await request(appurl).get("/api");

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			message: "Hope you have a good time using our api",
			post: {
				name: "post one",
				desc: "about the post random words ajsdnfobfsdg",
				ok: true,
			},
			user: {
				name: "Sajag",
				id: 123321,
			},
		});

		done();
	});
});
