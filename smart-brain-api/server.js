// EXPRESS SET UP
const express = require('express');
const app = express(); 

// ROUTES
app.get('/', (req, res) => {
	res.send('This is working');
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