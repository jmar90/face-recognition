import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Rank from './components/rank/Rank';
import './App.css';

// Set up Particles.js: Select properties of particles & assign them to var particlesOption
// (consulted library's website for object names; partcilesOptions was name chosen by me - could've chosen any name)
const particlesOptions = {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true,
        value_area: 800
      }
    },
    opacity: {
      value: 0.3
    },
    line_linked: {
      opacity: 0.3
    }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'repulse'
      },
      resize: true
    }
  }
}

// Set initial state (all states are blank/at default values)
const initialState = {
  input: '',  // This is what user enters into detect textbox. Have initial state be equal to empty string.
  imageUrl: '',
  box: {},
  route: 'signin',  // Route state will keep track of where we are on page. Want to start on sign in.
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

// Build App Component
class App extends Component {
  // Add in state for input (textbox) and imageUrl (note: constructor()...super(), etc. is the code syntax required by React)
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    // Set state of user to be equal to the user data passed thru loadUser ('data')
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    // Bounding box for face data (remember, bounding box defined as % of image's height/width)
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      // Return box (note left_col, top_row, etc. are properties generated by Clarifai that we've captured in clarifaiFace)
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    // Set the state of box equal to the box argument that displayFaceBox receives 
    // (which will be the face location coordinates generated by calculateFaceLocation)
    this.setState({box: box});
  }

  // Create function to detect event when input in textbox changes. 
  // Note: onInputChange is a property of App, so when passing it down as prop to ImageLinkForm, we will need to refer to it as
    // 'this.onInputChange'
  onInputChange = (event) => {
    this.setState({input: event.target.value});  // Set state of input equal to value entered in textbox
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}); // Have imageUrl update to whatever is entered into textbox ('input')
      // calculateFaceLocation receives response from Clarifai's face detection API & then uses that to generate coordinates for box.
      // displayFaceBox then receives these coordinates from calculateFaceLocation & generates a square from them.
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input,
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(response => response.json())
          .then(count => {
            // Set entries to current count
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  // When person signs in, redirect to home; sign out, redirect to sign in
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState) //By setting to initial state, user info will be removed from state
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    } 
    this.setState({route: route});
  }

  // Here is where we specify what the App component will actually render
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;  // Destructure to clean up code
    return (
      <div className="App">
        <Particles className = 'particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
        { route === 'home'  
          ? <div>       { /* If route equal to home, render home screen */}
              <Logo />  
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit} 
              />
              <FaceRecognition box = {box} imageUrl = {imageUrl} />
            </div> 
          : (
              route === 'signin' 
              ? <SignIn loadUser= {this.loadUser} onRouteChange = {this.onRouteChange}/>  // If route state equal to signin, return SignIn component
              : <Register loadUser= {this.loadUser} onRouteChange = {this.onRouteChange}/>  // Otherwise, return Register form
            )
        }
      </div>
    );
  }
}

export default App;
