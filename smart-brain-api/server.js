// EXPRESS AND BODY-PARSER SET UP
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); 

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
app.get('/', (req, res) => {res.send('It is working');})

/* Sign In */
app.post('/signin', signin.handleSignin(db, bcrypt))

/* Register (create new user) */
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

/* Profile */
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

/* Image: update user to increase entries count */
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// CREATE SERVER ON PORT 3000
app.listen(process.env.PORT || 3000, () => {
	console.log(`App is running on port ${process.env.PORT}`);
})