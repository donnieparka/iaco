import express from "express";
const reviewsRouter = express.Router({ mergeParams: true });
// models
import { Campground, Review } from "../mongooseModels.js";
// utils
import { asyncWrapper } from "../utils/middlewares.js";
import { checkReview } from "../utils/joiValidation.js";
import { isLogged, isReviewOwner } from "../utils/authMiddleware.js";
// aggiunta review al campeggio
reviewsRouter.post(
  "/",
  isLogged,
  checkReview,
  asyncWrapper(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body);
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
  isLogged,
  isReviewOwner,
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
