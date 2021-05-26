import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Circuit from './Circuit';
import { observe } from './Logic';

const root = document.getElementById('root')

observe((placedGates, globalPhase) => 
  ReactDOM.render(<Circuit placedGates={placedGates} globalPhase={globalPhase} />, root)
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
