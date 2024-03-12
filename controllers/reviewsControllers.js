import { Campground, Review } from "../mongooseModels.js";

const postReview = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body);
  review.author = req.user._id;
  camp.reviews.push(review);
  await camp.save();
  await review.save();
  req.flash("success", "recensione aggiunta!!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

const deleteReview = async (req, res) => {
  await Campground.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.revid },
  });
  await Review.findByIdAndDelete(req.params.revid);
  req.flash("success", "recensione eliminata!!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

export { postReview, deleteReview };
