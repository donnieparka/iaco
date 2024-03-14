import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const reviewSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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

const campgroundSchema = mongoose.Schema({
	title: String,
	images: [
		{
			url: String,
			filename: String,
		},
	],
	price: Number,
	description: String,
	location: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

// middlewares
userSchema.plugin(passportLocalMongoose);

campgroundSchema.post('findOneAndDelete', async function (camp) {
	if (camp) {
		Review.deleteMany({ _id: { $in: camp.reviews } });
	}
});

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);
const Campground = mongoose.model('Campground', campgroundSchema);
export { Campground, Review, User };
