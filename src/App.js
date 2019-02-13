import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Rank from './components/rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: '215dd94ed6ac4a679c442e15e952f75c'
});

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

class App extends Component {
  // Add in state
  constructor() {
    super();
    this.state = {
      input: '',  // This is what user enters into detect textbox
      imageUrl: ''
    }
  }

  // Create function to detect event when input in textbox changes. 
  // Note: onInputChange is a property of App, so when passing it down as prop to ImageLinkForm, we will need to refer to it as
    // 'this.onInputChange'
  onInputChange = (event) => {
    this.setState({input: event.target.value});  // Set state of input equal to value entered in textbox
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}); // Have imageUrl update to whatever is entered into textbox ('input')
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)  // Url input
      .then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {
        // there was an error
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className = 'particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange = {this.onInputChange} 
          onButtonSubmit = {this.onButtonSubmit} 
        />
        <FaceRecognition imageUrl = {this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
