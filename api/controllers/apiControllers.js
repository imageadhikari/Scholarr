// api get
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
