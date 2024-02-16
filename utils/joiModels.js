import joi from 'joi';

const campValidationSchema = joi.object({
	campground: joi
		.object({
			title: joi.string().required(),
			location: joi.string().required(),
			image: joi.string().required(),
			price: joi.number().required().min(0),
			description: joi.string().required(),
		})
		.required(),
});

const reviewValidationSchema = joi.object({
	review: joi
		.object({
			body: joi.string().required(),
			rating: joi.number().required().min(1).max(5),
		})
		.required(),
});

export { campValidationSchema, reviewValidationSchema };
