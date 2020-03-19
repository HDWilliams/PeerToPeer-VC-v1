import React from 'react';
import './App.css';
import PeerContainer from "./components/PeerContainer.js";
import TopicListView from "./components/TopicListView.js";

function App() {
    console.log('testing testing');
  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" alt="logo" />
        <PeerContainer />
        <TopicListView/>
      </header>
    </div>
  );
}

export default App;
