const handleProfileGet = (req, res, db) => {
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
}

module.exports = {
	handleProfileGet: handleProfileGet
}