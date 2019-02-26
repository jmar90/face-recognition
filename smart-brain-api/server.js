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

// ROUTES
/* Root/home route */
app.get('/', (req, res) => {
	res.send(database.users);
})

/* Sign In */
app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email) //pull email & hash from login table where email equal to email entered by user
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash); //use bcrypt to compare hash to entered password
			if(isValid){ //if the hash & entered password match
				return db.select('*').from('users') //You always want to make sure that you are returning the data
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0]) //return JS object of user information
					})
					.catch(err => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong credentials'))
})

/* Register (create new user) */
app.post('/register', (req, res) => {
	// Grab email, name, & password from the request.body using destructuring
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password); //hash password
		//Create transaction where login data is first entered, then the email from login table is entered into registration table
		db.transaction(trx => {
			trx.insert({ //insert hash password & email into login table
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				// Insert the email & other registration info into our users table
				return trx('users')
					.returning('*')  //return all the columns
					.insert({
						email: loginEmail[0], //to return content (otherwise it returns {"name@gmail.com"} )
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]); //res.json will convert response to JS object & then return that JS object
					})
			})
			.then(trx.commit) //if all code runs, send transaction through
			.catch(trx.rollback) //rollback changes if anything fails
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
	db('users').where('id', '=', id)
		.increment('entries', 1) //increment entries by 1
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('Unable to get entries'))
})

// CREATE SERVER ON PORT 3000
app.listen(3000, () => {
	console.log('App is running on port 3000');
})