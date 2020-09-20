// api get
/**
 * ### api_get
 * @param {object} req Request object
 * @param {object} res Response Object
 *
 * @return {object} res
 */
module.exports.api_get = (req, res) => {
	res.json({
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
};
