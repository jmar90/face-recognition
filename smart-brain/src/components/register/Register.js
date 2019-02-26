import React from 'react';

class Register extends React.Component {
	// Create states
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			name: ''
		}
	}

	// Create function that will run when input in email field changes. Change state to whatever value was entered by user.
	onEmailChange = (event) => {
		this.setState({ email: event.target.value })
	}

	// Create function that will run when input in password field.
	onPasswordChange = (event) => {
		this.setState({ password: event.target.value })
	}

	// Create function that will run when input in name field.
	onNameChange = (event) => {
		this.setState({ name: event.target.value })
	}

	// Create function that will run when when sign in data is submitted (ie, sign in button clicked)
	onSubmitSignIn = () => {
		// Send (via post request) the email & password back to server (but first convert JS object to JSON via stringify). 
		// Server will compare entered user & password to user/password pairs in database.
		fetch('http://localhost:3000/register', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				name: this.state.name
			})
		})
		.then(response => response.json())
		.then(user => {
			// If user data is received (server.js currently set up to return the last user if registration is correct)
			if(user.id){
				//loadUser is defined in App.js & passed down as prop to Register.js
				this.props.loadUser(user);
				// Change route to 'home' (ie, user will be redirected to home page)
				this.props.onRouteChange('home');
			}
		})
	}

	render() {
		return (
			<article className= "br3 ba b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">  {/*Use div, not form, b/c form will automatically try to submit something, which we don't want*/}
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Register</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
				        <input 
				        		className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        		type="text" 
				        		name="name"  
				        		id="name"
				        		onChange = { this.onNameChange }
				        		/>
				      </div>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        		className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        		type="email" 
				        		name="email-address"  
				        		id="email-address"
				        		onChange = { this.onEmailChange }
				        		/>
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        		className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        		type="password" 
				        		name="password"  
				        		id="password"
				        		onChange = { this.onPasswordChange }  // Add event listener to listen for change in password field; run onPasswordChange function when there is a change.
				        		/>
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
				      	onClick = {this.onSubmitSignIn}  // When Sign In button clicked, run onSubmitSignIn function
				      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      	type="submit" 
				      	value="Register" 
				      />
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default Register;