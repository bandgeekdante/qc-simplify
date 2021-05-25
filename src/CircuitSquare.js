import React from 'react';
import { ItemTypes } from './Constants';
import { canPlaceGate, slideGate} from './Logic';
import Square from './Square';
import { useDrop } from 'react-dnd';
import './CircuitSquare.css';

function CircuitSquare({ y, x, children }) {
  const [{ isOver, canDrop}, drop] = useDrop({
    accept: ItemTypes.SINGLEQUBITGATE,
    canDrop: (item) => canPlaceGate(item, y, x),
    hover: (item) => slideGate(item, y, x),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
  })

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <Square y={y}>{children}</Square>
      {!isOver && canDrop && <div className='Overlay' style={{backgroundColor: 'yellow'}} />}
      {isOver && canDrop && <div className='Overlay' style={{backgroundColor: 'green'}} />}
    </div>
  )
}

export default CircuitSquare
