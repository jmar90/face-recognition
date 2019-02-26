const handleRegister = (req, res, db, bcrypt) => {
	// Grab email, name, & password from the request.body using destructuring
	const { email, name, password } = req.body;
	if(!email || !name || !password){  //if email, name, or password left blank, end function & return 400 status error
		return res.status(400).json('Incorrect form submission');
	}
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
}

module.exports = {
	handleRegister: handleRegister  //export the above handleRegister function using the same name
};