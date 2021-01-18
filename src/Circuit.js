import React from 'react'
import X from './X'
import CircuitSquare from './CircuitSquare'
import { DndProvider } from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'

function renderSquare(i, placedGates) {
  const y = Math.floor(i / 8)
  const x = i % 8

  return (
    <div
      key={i}
      style={{ width: '12.5%', height: '12.5%' }}
    >
      <CircuitSquare y={y} x={x}>
        {renderGate(y, x, placedGates)}
      </CircuitSquare>
    </div>
  )
}

function renderGate(y, x, placedGates) {
  if ((placedGates[y][x]) || (y === 0 && x === 0)) {
    return <X y={y} x={x}/>
  }
}

export default function Circuit({ placedGates }) {
  const squares = []
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, placedGates))
  }

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
