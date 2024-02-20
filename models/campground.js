import mongoose from 'mongoose';
import Review from './review.js';

const CampgroundSchema = new mongoose.Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});
CampgroundSchema.post('findOneAndDelete', async function (camp) {
	if (camp) {
		Review.deleteMany({ _id: { $in: camp.reviews } });
	}
});
const Campground = mongoose.model('Campground', CampgroundSchema);
export default Campground;
