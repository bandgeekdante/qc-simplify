import React from 'react';
import { ItemTypes } from './Constants';
import { canMoveKnight, moveKnight } from './Game';
import Square from './Square';
import { useDrop } from 'react-dnd';
import './BoardSquare.css';

function BoardSquare({ x, y, children }) {
  const black = (x + y) % 2 === 1
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.KNIGHT,
    canDrop: () => canMoveKnight(x, y),
    drop: () => moveKnight(x, y),
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
        height: '100%',
      }}
    >
      <Square black={black}>{children}</Square>
      {isOver && !canDrop && <div className='Overlay' style={{backgroundColor: 'red'}} />}
      {!isOver && canDrop && <div className='Overlay' style={{backgroundColor: 'yellow'}} />}
      {isOver && canDrop && <div className='Overlay' style={{backgroundColor: 'green'}} />}
      {/* {!isOver && !canDrop && <div className='Overlay' color="gray" />} */}
    </div>
  )
}

export default BoardSquare
