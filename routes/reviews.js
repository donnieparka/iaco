import express from "express";
import flash from "connect-flash";
const reviewsRouter = express.Router({ mergeParams: true });
// models
import Campground from "../models/campground.js";
import Review from "../models/review.js";
// utils
import asyncWrapper from "../utils/asyncWrapper.js";
import { checkReview } from "../utils/checkSchema.js";

// aggiunta review al campeggio
reviewsRouter.post(
  "/",
  checkReview,
  asyncWrapper(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "review Added!!");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

// eliminazione review
reviewsRouter.delete(
  "/:revid",
  asyncWrapper(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.revid },
    });
    await Review.findByIdAndDelete(req.params.revid);
    req.flash("success", "review removed!!");
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

export default reviewsRouter;
