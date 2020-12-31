import React from 'react'
import Knight from './Knight'
import Square from './Square'
import { moveKnight } from './Game'

function renderSquare(i, [knightX, knightY]) {
  const x = i % 8
  const y = Math.floor(i / 8)
  const black = (x + y) % 2 == 1
  const isKnightHere = knightX === x && knightY === y
  const piece = isKnightHere ? <Knight /> : null

  return (
    <div
      key={i}
      style={{ width: '12.5%', height: '12.5%' }}
      onClick={() => handleSquareClick(x, y)}
    >
      <Square black={black}>{piece}</Square>
    </div>
  )
}

function handleSquareClick(toX, toY) {
  moveKnight(toX, toY)
}

export default function Board({ knightPosition }) {
  const squares = []
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition))
  }

  return (
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
  );
}
