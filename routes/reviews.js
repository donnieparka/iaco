import express from 'express';
const reviewsRouter = express.Router();
// models
import Campground from '../models/campground.js';
import Review from '../models/review.js';
// utils
import asyncWrapper from '../utils/asyncWrapper.js';
import { checkReview } from '../utils/checkSchema.js';

// aggiunta review al campeggio
reviewsRouter.post(
	'/',
	checkReview,
	asyncWrapper(async (req, res) => {
		const camp = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		camp.reviews.push(review);
		await camp.save();
		await review.save();
		res.redirect(`/campgrounds/${req.params.id}`);
	}),
);

// eliminazione review
reviewsRouter.delete(
	':revid',
	asyncWrapper(async (req, res) => {
		await Campground.findByIdAndUpdate(req.params.id, {
			$pull: { reviews: req.params.revid },
		});
		await Review.findByIdAndDelete(req.params.revid);
		res.redirect(`/campgrounds/${req.params.id}`);
	}),
);

export default reviewsRouter;
