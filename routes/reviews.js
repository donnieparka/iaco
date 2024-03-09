import express from "express";
const reviewsRouter = express.Router({ mergeParams: true });
import flash from "connect-flash";
// models
import Campground from "../models/campground.js";
import Review from "../models/review.js";
// utils
import asyncWrapper from "../utils/asyncWrapper.js";
import { checkReview } from "../utils/checkSchema.js";
import authentication from "../utils/isLoggedMiddleware.js";
import authorization from "../utils/isOwner.js";
// aggiunta review al campeggio
reviewsRouter.post(
  "/",
  authentication,
  checkReview,
  asyncWrapper(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "recensione aggiunta!!");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

// eliminazione review
reviewsRouter.delete(
  "/:revid",
  authentication,
  asyncWrapper(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.revid },
    });
    await Review.findByIdAndDelete(req.params.revid);
    req.flash("success", "recensione eliminata!!");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

export default reviewsRouter;
