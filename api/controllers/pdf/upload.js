/**
 * Module dependencies
 */

// ...


/**
 * pdf/upload.js
 *
 * Upload pdf.
 */
module.exports = async function upload(req, res) {

  req.file('pdf_rds').upload({
	  dirname: require('path').resolve(sails.config.appPath, 'assets/pdf')
	}, async function (err, uploadedFiles) {
	  if (err) return res.serverError(err);

	  let pdfFile = uploadedFiles[0].fd;

	  let results = await sails.helpers.pdfTagExtracteur(pdfFile);

	  return res.json(results);
	});
};
