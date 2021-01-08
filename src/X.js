import React from 'react'
import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { removeGate } from './Logic'

function X() {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.SINGLEQUBITGATE },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        removeGate(0, 0)
      }
    }
  })
  return (
    <>
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          fontSize: 25,
          fontWeight: 'bold',
          cursor: 'move',
        }}
      >
        X
      </div>
    </>
  )
}

export default X
