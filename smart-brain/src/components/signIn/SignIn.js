import React from 'react';

// SignIn has been converted to a 'smart' component (was previously just a 'const') so that it has state, which will allow 
// us to monitor changes to the input of username/password
class SignIn extends React.Component {
	// Create states
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}

	// Create function that will run when input in email field changes. Change state to whatever value was entered by user.
	onEmailChange = (event) => {
		this.setState({ signInEmail: event.target.value })
	}

	// Create function that will run when input in password field.
	onPasswordChange = (event) => {
		this.setState({ signInPassword: event.target.value })
	}

	// Create function that will run when when sign in data is submitted (ie, sign in button clicked)
	onSubmitSignIn = () => {
		// Send (via post request) the email & password back to server (but first convert JS object to JSON via stringify). 
		// Server will compare entered user & password to user/password pairs in database.
		fetch('http://localhost:3000/signin', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
		.then(response => response.json())
		.then(user => {
			// If the data received back from server = valid user id
			if(user.id){
				this.props.loadUser(user);
				// Change route to 'home' (ie, user will be redirected to home page)
				this.props.onRouteChange('home');
			}
		})
	}

	render () {
		const { onRouteChange } = this.props; // Destructure props
		return (
			<article className= "br3 ba b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input   
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="email" name="email-address"  
				        	id="email-address"
				        	onChange = {this.onEmailChange}  // Add event listener for when input changes. When input does change, run onEmailChange function specified above.
				        	/>
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password"
				        	onChange = {this.onPasswordChange}
				        	/>
				      </div>
				    </fieldset>
				    <div className="">
				      <input 
				      	onClick = {this.onSubmitSignIn}  // When Sign In button clicked, run onRouteChange function & pass thru home as argument (ie, redirect back to homepage)
				      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      	type="submit" 
				      	value="Sign in" 
				      />
				    </div>
				    <div className="lh-copy mt3">
				      <p onClick = {() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
				    </div>
				  </div>
				</main>
			</article>
		);
	}
}

export default SignIn;