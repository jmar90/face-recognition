// EXPRESS AND BODY-PARSER SET UP
const express = require('express');
const bodyParser = require('body-parser');

const app = express(); 

app.use(bodyParser.json());

// TEMP DATA (use until database is set up)
const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
}

// ROUTES
/* Root/home route */
app.get('/', (req, res) => {
	res.send(database.users);
})

/* Sign In */
app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json('Success');
	} else {
		res.status(400).json('Error logging in');
	}
})

/* Register (create new user) */
app.post('/register', (req, res) => {
	// Grab email, name, & password from the request.body using destructuring
	const { email, name, password } = req.body;
	// For time being, push data into users array (eventually, will create database)
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	// Return last item in users array (ie, the data for the user that was just created)
	res.json(database.users[database.users.length-1]);
})

// CREATE SERVER ON PORT 3000
app.listen(3000, () => {
	console.log('App is running on port 3000');
})

/*
Notes re: what we want to do with API
Routes:
/ --> res = this is working
/signIn --> POST request (posting user info). Respond with success/fail
/register --> POST request (add data to database). Respond with new user object.
/profile/:userId --> GET request (get user info). Respond with user.
/image --> PUT (will update score). Respond with updated user object.
*/