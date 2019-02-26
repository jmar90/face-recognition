// Set up Clarifai API (enter API key, assign to var 'app') - code came from Clarifai's website
// Moved API setup from front to backend so that API key is not viewable by user
const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: ''
});

const handleApiCall = (req, res) => {
	app.models  // Set-up code for Clarifai API
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)  // Url input
	.then(data => { //data = whatever info API gives us
		res.json(data);
	})
	.catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1) //increment entries by 1
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}