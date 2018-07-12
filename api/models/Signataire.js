module.exports = {
	attributes: {
		identifiant: { type : 'string' },
		prenom:  { type : 'string', allowNull: true },
		nom:  { type : 'string', allowNull: true },
		email:  { type : 'string' },
		urlSignature:  { type : 'string', allowNull: true },
		entreprise:  { type : 'string', allowNull: true },
		rds: { model: 'rds' }
	}
}