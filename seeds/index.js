import mongoose from 'mongoose';
import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import { Campground } from '../mongooseModels.js';

mongoose.connect('mongodb://localhost:27017/yelp-camp-fake');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			author: '65e85112bcf372d2643f013b',
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: 'https://res.cloudinary.com/dsntv0w1a/image/upload/v1710879569/b4vzw2dhewcoqe3b4fyu.png',
					filename: 'b4vzw2dhewcoqe3b4fyu',
					_id: '65f9f35308955ee4ca51e1e0',
				},
			],
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
			price,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
