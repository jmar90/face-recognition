import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Rank from './components/rank/Rank';
import './App.css';

// Set up Clarifai API (enter API key, assign to var 'app') - code came from Clarifai's website
const app = new Clarifai.App({
  apiKey: '215dd94ed6ac4a679c442e15e952f75c'
});

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

// Build Class Component
class App extends Component {
  // Add in state for input (textbox) and imageUrl (note: constructor()...super(), etc. is the code syntax required by React)
  constructor() {
    super();
    this.state = {
      input: '',  // This is what user enters into detect textbox. Have initial state be equal to empty string.
      imageUrl: '',
      box: {},
      route: 'signin',  // Route state will keep track of where we are on page. Want to start on sign in.
      isSignedIn: false,
    }
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
    app.models  // Set-up code for Clarifai API
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)  // Url input
      // calculateFaceLocation receives response from Clarifai's face detection API & then uses that to generate coordinates for box.
      // displayFaceBox then receives these coordinates from calculateFaceLocation & generates a square from them.
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  // When person signs in, redirect to home; sign out, redirect to sign in
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
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
              <Rank />
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit} 
              />
              <FaceRecognition box = {box} imageUrl = {imageUrl} />
            </div> 
          : (
              route === 'signin' 
              ? <SignIn onRouteChange = {this.onRouteChange}/>  // If route state equal to signin, return SignIn component
              : <Register onRouteChange = {this.onRouteChange}/>  // Otherwise, return Register form
            )
        }
      </div>
    );
  }
}

export default App;
