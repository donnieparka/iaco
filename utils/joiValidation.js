import joi from 'joi';
import ExpressError from './ExpressError.js';
import sanitizeHtml from 'sanitize-html';

const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': `{{#label}} non deve avere html, chi cazzo credi di fottere`,
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value) return helpers.error('string.escapeHTML', { value });
				return clean;
			},
		},
	},
});
const Joi = joi.extend(extension);
const campValidationSchema = Joi.object({
	title: Joi.string().required().escapeHTML(),
	location: Joi.string().required().escapeHTML(),
	// image: Joi.string().required(),
	price: Joi.number().required().min(0),
	description: Joi.string().required().escapeHTML(),
	deleteImages: Joi.array(),
});

const reviewValidationSchema = Joi.object({
	body: Joi.string().required().escapeHTML(),
	rating: Joi.number().required().min(1).max(5),
});

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
	if (!req.body) {
		throw new ExpressError('recensione vuota... cazzo fai mongolo', 400);
	}
	const result = reviewValidationSchema.validate(req.body);
	const { error } = result;
	if (error) {
		const allErrors = error.details.map((err) => err.message).join(',');
		throw new ExpressError(allErrors, 400);
	} else {
		next();
	}
}

export { checkCampground, checkReview, campValidationSchema, reviewValidationSchema };
