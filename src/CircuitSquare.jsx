import React from 'react';
import { ItemTypes } from './Constants';
import { slideGate, squareClasses} from './Logic';
import { useDrop } from 'react-dnd';
import './styles.css';

function CircuitSquare({ y, x, gate, children }) {
  const [{ isOver, canDrop}, drop] = useDrop({
    accept: [ItemTypes.GATE],
    canDrop: (_, monitor) => !!monitor.isOver() && ((y === 0 && x === 7) || (y >= 1 && monitor.getItem().x === x && monitor.getItem().y === y)),
    hover: (item) => slideGate(item, y, x),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
  })
  let classes = squareClasses(y, x);
  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {(classes >= 0) && <div className="wire" />}
      <div className={"square"}>
        {children}
      </div>
      {!!(classes & 1) && <div className="bottom-wire" />}
      {!!(classes & 2) && <div className="top-wire" />}
      {isOver && canDrop && <div className="overlay" style={{backgroundColor: 'green'}} />}
      {isOver && y >= 1 && !canDrop && <div className="overlay" style={{backgroundColor: 'red'}} />}
    </div>
  )
}

export default CircuitSquare
