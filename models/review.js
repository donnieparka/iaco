import mongoose from "mongoose";
const reviewSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});
const Review = mongoose.model("Review", reviewSchema);
export default Review;
