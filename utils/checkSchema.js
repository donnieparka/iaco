import { campValidationSchema, reviewValidationSchema } from './joiModels.js';
import ExpressError from './ExpressError.js';
function checkCampground(req, res, next) {
	if (!req.body) throw new ExpressError('dati campeggio non validi', 400);
	const result = campValidationSchema.validate(req.body);
	const { error } = result;
	if (error) {
		const allErrors = error.details.map((err) => err.message).join(',');
		throw new ExpressError(allErrors, 400);
	} else {
		next();
	}
}

function checkReview(req, res, next) {
	if (!req.body)
		throw new ExpressError('recensione vuota... cazzo fai mongolo', 400);
	const result = reviewValidationSchema.validate(req.body);
	const { error } = result;
	if (error) {
		const allErrors = error.details.map((err) => err.message).join(',');
		throw new ExpressError(allErrors, 400);
	} else {
		next();
	}
}

export { checkCampground, checkReview };
