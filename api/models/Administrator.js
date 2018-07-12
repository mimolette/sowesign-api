module.exports = {
	attributes: {
		nom: { type : 'string', allowNull: true, },
		prenom:  { type : 'string', allowNull: true },
		email:  { type : 'string', required: true },
		rds: { model: 'rds' }
	}
}