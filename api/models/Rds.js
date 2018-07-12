module.exports = {
	attributes: {
		pdf: { type : 'string' },
		nom:  { type : 'string', allowNull: true },
		description:  { type : 'string', allowNull: true },
		date:  { type: 'string', columnType: 'date', allowNull: true },
		lieu:  { type : 'string', allowNull: true },
		urlComplementaire:  { type : 'string', allowNull: true },
		sujet:  { type : 'string', allowNull: true },
		corps:  { type : 'string', allowNull: true },
		nombreRelance:  { type : 'number', allowNull: true },
		periodicite:  { type : 'number', allowNull: true },
		delaisMinimum:  { type : 'number', allowNull: true },
		urlAvancement:  { type : 'string', allowNull: true },
		urlTelechargement:  { type : 'string', allowNull: true },
		pdfFinale:  { type : 'string', allowNull: true },
		administrateur: { model: 'administrator' },
		signatiares: {
			collection: 'signataire',
			via: 'rds',
		},
	}
}