import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import { Campground } from '../mongooseModels.js';
import { GeoCoder } from '../utils/mapBox.js';
const geoCoder = new GeoCoder();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	const apiToken = process.env.MAPBOX_TOKEN;
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const coordinates = await geoCoder.localize(
			apiToken,
			`${cities[random1000].city} ${cities[random1000].state}`
		);
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			author: '65e85112bcf372d2643f013b',
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
				type: 'Point',
				coordinates: coordinates,
			},
			images: [
				{
					url: 'https://res.cloudinary.com/dsntv0w1a/image/upload/v1710413918/samples/people/kitchen-bar.jpg',
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

export default seedDB;
