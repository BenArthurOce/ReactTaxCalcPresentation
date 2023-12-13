import React, { Component } from 'react';
import TaxFrontend from './TaxFrontend.js';
import './App.css';



class App extends Component {
  state = {
    data: null
  };


  render() {
    return <TaxFrontend />;
  }
}

export default App;
