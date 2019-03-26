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
const particlesOptions = {
  particles: {
    number: { 
      value: 275,
      density: { enable: true } 
    },
    opacity: { value: 0.3 },
    size: { 
      value: 28,
      random: true
    },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out"
    }
  }
}

// Set initial state (all states are blank/at default values)
const initialState = {
  input: '',  
  imageUrl: '',
  box: {},
  route: 'signin',  
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
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    // Bounding box for face data 
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});  
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}); 
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

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState) 
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    } 
    this.setState({route: route});
  }

  // Here is where we specify what the App component will actually render
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state; 
    return (
      <div className="App">
        <Particles className = 'particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
        { route === 'home'  
          ? <div>       
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
              ? <SignIn loadUser= {this.loadUser} onRouteChange = {this.onRouteChange}/>  
              : <Register loadUser= {this.loadUser} onRouteChange = {this.onRouteChange}/>  
            )
        }
      </div>
    );
  }
}

export default App;
