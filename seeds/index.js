import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import { Campground } from '../mongooseModels.js';
import { GeoCoder } from '../utils/mapBox.js';
// const geoCoder = new GeoCoder();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	// const apiToken = process.env.MAPBOX_TOKEN;
	await Campground.deleteMany({});
	 for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
			//YOUR USER ID
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
			// author: '65e85112bcf372d2643f013b', 
			author: '6614f6cd6221f6d6ddc9f4b3', //desktop
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
					url: 'https://res.cloudinary.com/dsntv0w1a/image/upload/v1710413918/samples/people/kitchen-bar.jpg',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
					url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })
        await camp.save();
	}
};

export default seedDB;
