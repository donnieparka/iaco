import joi from "joi";
import ExpressError from "./ExpressError.js";

const campValidationSchema = joi.object({
  title: joi.string().required(),
  location: joi.string().required(),
  image: joi.string().required(),
  price: joi.number().required().min(0),
  description: joi.string().required(),
});

const reviewValidationSchema = joi.object({
  body: joi.string().required(),
  rating: joi.number().required().min(1).max(5),
});

function checkCampground(req, res, next) {
  if (!req.body) throw new ExpressError("dati campeggio non validi", 400);
  const result = campValidationSchema.validate(req.body);
  const { error } = result;
  if (error) {
    const allErrors = error.details.map((err) => err.message).join(",");
    throw new ExpressError(allErrors, 400);
  } else {
    next();
  }
}

function checkReview(req, res, next) {
  if (!req.body) {
    throw new ExpressError("recensione vuota... cazzo fai mongolo", 400);
  }
  const result = reviewValidationSchema.validate(req.body);
  const { error } = result;
  if (error) {
    const allErrors = error.details.map((err) => err.message).join(",");
    throw new ExpressError(allErrors, 400);
  } else {
    next();
  }
}

export {
  checkCampground,
  checkReview,
  campValidationSchema,
  reviewValidationSchema,
};
