// EXPRESS AND BODY-PARSER SET UP
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); //knex is used for connecting to DB & using postgresql

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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
app.get('/', (req, res) => {res.send(database.users);})

/* Sign In */
	//first run function with db & bcrypt, & then it automatically receives req & res
	//so, we can use below syntax vs. writing '/signin', (req,res) => {signin.handleSignin(res,req,db,bcrypt)}
	//Which syntax you use is a matter of preference (we'll keep the old syntax for register, profile, & image)
app.post('/signin', signin.handleSignin(db, bcrypt))

/* Register (create new user) */
	// dependency injection - inject the dependency that handleRegister needs (ie, pass down var needed for handleRegister to run)
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

/* Profile */
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

/* Image: update user to increase entries count */
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// CREATE SERVER ON PORT 3000
app.listen(3000, () => {
	console.log('App is running on port 3000');
})