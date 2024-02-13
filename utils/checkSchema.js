const joi = require('joi');
const ExpressError = require('./ExpressError');
function checkSchema(req, res, next) {
	if (!req.body) throw new ExpressError('dati campeggio non validi', 400);
	const result = schemaValidation.validate(req.body);
	const { error } = result;
	if (error) {
		const allErrors = error.details.map((err) => err.message).join(',');
		throw new ExpressError(allErrors, 400);
	} else {
		next();
	}
}

module.exports = checkSchema;
