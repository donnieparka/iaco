import Joi from 'joi';
import ExpressError from './ExpressError.js';
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

export default checkSchema;
