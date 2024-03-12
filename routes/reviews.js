import express from "express";
const reviewsRouter = express.Router({ mergeParams: true });
// models
import { Campground, Review } from "../mongooseModels.js";
// utils
import { asyncWrapper } from "../utils/middlewares.js";
import { checkReview } from "../utils/joiValidation.js";
import { isLogged, isReviewOwner } from "../utils/authMiddleware.js";
import { deleteReview, postReview } from "../controllers/reviewsControllers.js";
// aggiunta review al campeggio
reviewsRouter.post("/", isLogged, checkReview, asyncWrapper(postReview));

// eliminazione review
reviewsRouter.delete(
  "/:revid",
  isLogged,
  isReviewOwner,
  asyncWrapper(deleteReview)
);

export default reviewsRouter;
