import axios from 'axios';
class GeoCoder {
	async localize(apiToken, query) {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${apiToken}`;
		const geoQuery = await axios.get(url);
		if (!geoQuery) {
			throw new Error(
				'errore coglionazzo qua al massimo c`è tua madre che batte sicuro non un campeggio'
			);
		}
		return geoQuery.data.features[0].geometry.coordinates.reverse();
	}
}

export { GeoCoder };
