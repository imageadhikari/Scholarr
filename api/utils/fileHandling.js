const fs = require("fs");

/** ### DELETE files
 *
 * @param {string} directory
 * @param {array} files
 */
const deleteFiles = async function (filesToDelete) {
	try {
		for (file of filesToDelete) {
			if (fs.existsSync(file)) {
				fs.unlinkSync(file);
			}
		}

		return `Successfully Deleted:\n\t${filesToDelete}\n`;
	} catch (err) {
		if (process.env.NODE_ENV === "dev") console.log(err);
		return { error: err };
	}
};

/** ### DELETE avatar and cover of a user
 *
 * @param {object} avatar The avatarImage object from User Document
 * @param {object} cover The coverImage object from User Document
 */
const profileAvatarCoverDelete = async function (avatar, cover) {
	let avatarFile = `${process.cwd()}/${avatar.location}`;
	let coverFile = `${process.cwd()}/${cover.location}`;
	let deleteFile = [avatarFile, coverFile];

	const message = await deleteFiles(deleteFile);
	console.log("\n", message);
};

/** ### DELETE attachments
 *
 * @param {array} attachments array of attachment files
 */
const attachmentsDelete = async function (attachments) {
	let filesToDelete = [];

	for (let file of attachments) {
		filesToDelete.push(`${process.cwd()}/${file.location}`);
	}

	const message = await deleteFiles(filesToDelete);
	console.log("\n", message);
};

module.exports.profileAvatarCoverDelete = profileAvatarCoverDelete;
module.exports.attachmentsDelete = attachmentsDelete;
