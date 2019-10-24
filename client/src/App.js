import React from 'react';
import logo from './logo.svg';
import './App.css';
import PeerContainer from "./components/PeerContainer.js";

function App() {
    console.log('testing testing');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <PeerContainer />
      </header>
    </div>
  );
}

export default App;
