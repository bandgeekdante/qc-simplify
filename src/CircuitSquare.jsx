import React from 'react';
import { ItemTypes } from './Constants';
import { slideGate, squareClasses} from './Logic';
import { useDrop } from 'react-dnd';
import './styles.css';

function CircuitSquare({ y, x, gate, children }) {
  const [{ isOver, canDrop}, drop] = useDrop({
    accept: [ItemTypes.GATE],
    canDrop: (_, monitor) => !!monitor.isOver() && ((y >= 1 && monitor.getItem().gate === gate) || (y === 0 && x === 7)),
    hover: (item) => slideGate(item, y, x),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
  })
  let classes = squareClasses(y, x);
  // let goodDrag = isOver && ((y >= 1 && getItem.gate === gate) || (y === 0 && x === 7));
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
      {!!(classes & 1) && <div className="bottom-wire" />}
      {!!(classes & 2) && <div className="top-wire" />}
      <div className={"square"}>
        {children}
      </div>
      {console.log(canDrop)}
      {isOver && canDrop && <div className="overlay" style={{backgroundColor: 'green'}} />}
      {isOver && y >= 1 && !canDrop && <div className="overlay" style={{backgroundColor: 'red'}} />}
    </div>
  )
}

export default CircuitSquare
