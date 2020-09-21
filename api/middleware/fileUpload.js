const multer = require("multer");
const path = require("path");

//
//
// storage object
const storage = multer.diskStorage({
	destination: `${__dirname}/../../public/upload`,
	filename: function (req, file, cb) {
		cb(
			null,
			req.user._id + "-" + file.fieldname + "-" + Date.now() + path.extname(file.originalname)
			//this will result in the filename of uploaded file as `[id of user]-[fieldname ie avatar or cover]-timestamp.extension`
		);
	},
});

//
//
// file filtering
const fileFilter = function (req, file, cb) {
	const ext = path.extname(file.originalname);
	console.log(ext);
	if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif") {
		// retuen error if not image
		return cb(
			new Error({
				error: {
					status: 400,
					type: "mimetype error",
					message: "Only images are allowed",
				},
			})
		);
	}
	// return no error if image
	return cb;
};

//
//
// exports
/**
 * For our particular usecase we set certain limits
 *
 * @storage is the storage location
 * @fileFilter limits to images
 * @filesize limits the file size to 5mb
 * @fields limits form to two formfields namely for avatar and cover
 */

module.exports.upload = multer({ storage: storage }).fields([
	{ name: "avatar", maxCount: 1 },
	{ name: "cover", maxCount: 1 },
]);

/**
 * User images implementation
 *
 */
module.exports.imagesUpload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	//5MB max size limit
}).fields([
	{ name: "avatar", maxCount: 1 },
	{ name: "cover", maxCount: 1 },
]);

/**
 *
 * Array of files
 */
