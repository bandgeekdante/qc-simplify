import React from 'react'
import ReactDOM from 'react-dom'
import Board from './Board'
import { observe } from './Game'

function App() {

  const root = document.getElementById('root')

  return (
    observe((knightPosition) => 
      ReactDOM.render(<Board knightPosition={knightPosition} />, root)
    )
  );
}

export default App;
