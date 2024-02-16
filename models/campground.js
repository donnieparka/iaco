import mongoose from 'mongoose';
import Review from './review.js';
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
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
