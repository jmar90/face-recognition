// EXPRESS AND BODY-PARSER SET UP
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); //knex is used for connecting to DB & using postgresql

const db = knex({  //connect to our db
	client: 'pg',
	connection: {	//provide information where DB is
		host: '127.0.0.1',	//local host
		user: 'julia',
		password: '',
		database: 'smart-brain'
	}
});

const app = express(); 

app.use(bodyParser.json());
app.use(cors());

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
		res.json(database.users[0]);
	} else {
		res.status(400).json('Error logging in');
	}
})

/* Register (create new user) */
app.post('/register', (req, res) => {
	// Grab email, name, & password from the request.body using destructuring
	const { email, name, password } = req.body;
	// Insert the email & other registration info into our users table in our 'db' database
	db('users')
		.returning('*')  //return all the columns
		.insert({
			email: email,
			name: name,
			joined: new Date()
	})
	.then(user => {
		res.json(user[0]); //res.json will convert response to JS object & then return that JS object
	})
	.catch(err => res.status(400).json('Unable to register'))  //if error (eg, email already registered), send person a message saying 'unable to register'
})

/* Profile */
app.get('/profile/:id', (req, res) => {
	// Grab id from request.params using destructuring. Pull id from params b/c id is coming from the URL 
	// (whatever number is entered in lieu of ':id'), not from the body of the request.
	const { id } = req.params;
	db.select('*').from('users').where({id})  //select user whose id equals the id from req.params
		.then(user => {
			if(user.length){ //If user is not an empty array (ie, it has length)
				res.json(user[0]) //res.json to convert user object from json to JS object. JS object of user will be returned.
			} else{
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('Error getting user'))
})

/* Image: update user to increase entries count */
app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			// Increase entries by 1
			user.entries++
			return res.json(user.entries);
		} 
	})
	if(!found){
		res.status(400).json('Not found');
	}
})

// CREATE SERVER ON PORT 3000
app.listen(3000, () => {
	console.log('App is running on port 3000');
})