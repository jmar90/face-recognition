const handleSignin = (db, bcrypt) => (req, res) => { //Run handleSign with db & bcrypt. Then, we run function again with req & res.
	const { email, password } = req.body;
	if(!email || !password){  //if email or password left blank, end function & return 400 status error
		return res.status(400).json('Incorrect form submission');
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', email) //pull email & hash from login table where email equal to email entered by user
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash); //use bcrypt to compare hash to entered password
			if(isValid){ //if the hash & entered password match
				return db.select('*').from('users') //You always want to make sure that you are returning the data
					.where('email', '=', email)
					.then(user => {
						res.json(user[0]) //return JS object of user information
					})
					.catch(err => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong credentials')
			}
		})
		.catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}