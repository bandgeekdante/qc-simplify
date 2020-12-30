import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>
          What would you use an account for? Time will tell...
        </h2>
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
