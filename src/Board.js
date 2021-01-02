import React from 'react'
import Knight from './Knight'
import BoardSquare from './BoardSquare'
import { DndProvider } from 'react-dnd-multi-backend'
// import { TouchBackend } from 'react-dnd-touch-backend'
// import { HTML5Backend } from 'react-dnd-html5-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'

function renderSquare(i, knightPosition) {
  const x = i % 8
  const y = Math.floor(i / 8)

  return (
    <div
      key={i}
      style={{ width: '12.5%', height: '12.5%' }}
    >
      <BoardSquare x={x} y={y}>
        {renderPiece(x, y, knightPosition)}
      </BoardSquare>
    </div>
  )
}

// function is_touch_device() {
//   if ("ontouchstart" in window || window.TouchEvent)
//     return true;

//   if (window.DocumentTouch && document instanceof DocumentTouch)
//     return true;

//   const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
//   const queries = prefixes.map(prefix => `(${prefix}touch-enabled)`);

//   return window.matchMedia(queries.join(",")).matches;
// }

function renderPiece(x, y, [knightX, knightY]) {
  if (x === knightX && y === knightY) {
    return <Knight />
  }
}

export default function Board({ knightPosition }) {
  const squares = []
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, knightPosition))
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
