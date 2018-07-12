/**
 * Module dependencies
 */

// ...


/**
 * rds/create.js
 *
 * Create rds.
 */
module.exports = async function create(req, res) {
	// get data from request
	let rdsInfo = req.body;
	
	if (rdsInfo) {
		let administrator = await Administrator.create({
			nom: rdsInfo.administrateur.nom,
			prenom: rdsInfo.administrateur.prenom,
			email: rdsInfo.administrateur.email,
		}).fetch();

		let rds = await Rds.create({
			pdf: rdsInfo.pdf,
			nom:  rdsInfo.nom,
			description:  rdsInfo.description,
			date:  rdsInfo.date,
			lieu:  rdsInfo.lieu,
			urlComplementaire:  rdsInfo.urlComplementaire,
			sujet:  rdsInfo.sujet,
			corps:  rdsInfo.corps,
			nombreRelance:  rdsInfo.nombreRelance,
			periodicite:  rdsInfo.periodicite,
			delaisMinimum:  rdsInfo.delaisMinimum,
			urlAvancement:  "todo",
			urlTelechargement:  "todo",
			administrateur: administrator.id
		}).fetch();

		await Promise.all(rdsInfo.signataires.map(async (infoSignataire) => {
		    let signataire = await Signataire.create({
				identifiant: infoSignataire.identifiant,
				prenom:  infoSignataire.prenom,
				nom:  infoSignataire.nom,
				email:  infoSignataire.email,
				entreprise:  infoSignataire.entreprise,
				rds: rds.id
			});
		}));

		return res.json(rds);
	}

    return res.ok();

};
