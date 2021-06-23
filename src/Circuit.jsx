import React from 'react';
import SingleQubitGate from './SingleQubitGate';
import Control from './Control'
import ControlledGate from './ControlledGate'
import CircuitSquare from './CircuitSquare';
import Trash from './Trash'
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';

function renderSquare(i, placedGates) {
  const y = Math.floor(i / 8);
  const x = i % 8;

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
  if (y === 0) {
    if (x === 0) {
      return <SingleQubitGate name={'X'} y={y} x={x}/>;
    } else if (x === 1) {
      return <SingleQubitGate name={'Z'} y={y} x={x}/>;
    } else if (x === 2) {
      return <SingleQubitGate name={'Y'} y={y} x={x}/>;
    } else if (x === 3) {
      return <SingleQubitGate name={'H'} y={y} x={x}/>;
    } else if (x === 4) {
      return <Control name={'C'} y={y} x={x}/>;
    } else if (x === 7 && placedGates.some(a => a.some(Boolean))) {
      return <Trash/>;
    }
  } else if (placedGates[y][x] === 'C') {
    return <Control y={y} x={x}/>;
  } else if (placedGates[y][x] === '+') {
    return <ControlledGate name={'+'} y={y} x={x}/>;
  } else if (placedGates[y][x]) {
    return <SingleQubitGate name={placedGates[y][x]} y={y} x={x}/>;
  }
}

function displayGlobalPhase(globalPhase) {
  if (globalPhase === 0) {
    return "0";
  } else if (globalPhase === 1) {
    return "π";
  } else if (globalPhase === 0.5) {
    return "π/2";
  } else if (globalPhase === 1.5) {
    return "-π/2";
  }
}

function renderGlobalPhase(globalPhase) {
  return (
    <div
      key={7*8}
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
      Global phase = {displayGlobalPhase(globalPhase)}
    </div>
  )
}

export default function Circuit({ placedGates, globalPhase }) {
  const squares = [];
  for (let i = 0; i < 7*8; i++) {
    squares.push(renderSquare(i, placedGates));
  }
  squares.push(renderGlobalPhase(globalPhase))
  return (
    <DndProvider
      options={HTML5toTouch}
    >
      <div
        style={{
          width: '100vmin',
          height: '100vmin',
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        {squares}
      </div>
    </DndProvider>
  );
}
