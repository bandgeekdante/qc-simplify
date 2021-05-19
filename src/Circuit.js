import React from 'react'
import SingleQubitGate from './SingleQubitGate'
import CircuitSquare from './CircuitSquare'
import { DndProvider } from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'

function renderSquare(i, placedGates, globalPhase) {
  const y = Math.floor(i / 8)
  const x = i % 8

  return (
    <div
      key={i}
      style={{ width: '12.5%', height: '12.5%' }}
    >
      <CircuitSquare y={y} x={x}>
        {renderGate(y, x, placedGates, globalPhase)}
      </CircuitSquare>
    </div>
  )
}

function renderGate(y, x, placedGates) {
  if (y === 0) {
    if (x === 0) {
      return <SingleQubitGate name={'X'} y={y} x={x}/>
    } else if (x === 1) {
      return <SingleQubitGate name={'Z'} y={y} x={x}/>
    } else if (x === 2) {
      return <SingleQubitGate name={'Y'} y={y} x={x}/>
    }
  } else if (placedGates[y][x]) {
    return <SingleQubitGate name={placedGates[y][x]} y={y} x={x}/>
  }
}

function renderGlobalPhase(globalPhase) {
  return (
    <div
      key={56}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '12.5%',
        width: '100%',
        fontSize: 25,
        fontWeight: 'bold',
      }}
    >
      Global phase = {globalPhase}
    </div>
  )
}

export default function Circuit({ placedGates, globalPhase }) {
  const squares = []
  for (let i = 0; i < 56; i++) {
    squares.push(renderSquare(i, placedGates))
  }
  squares.push(renderGlobalPhase(globalPhase))
  return (
    <DndProvider
      options={HTML5toTouch}
    >
      <div
        style={{
          width: 'min(100vw,100vh)',
          height: 'min(100vw,100vh)',
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        {squares}
      </div>
    </DndProvider>
  );
}
