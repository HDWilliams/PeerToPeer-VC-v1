import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserList from "./components/UserList.js";
import CreateTopic from "./components/CreateTopic.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <CreateTopic />
      <UserList />
    </div>
  );
}

export default App;
