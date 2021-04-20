import React from 'react'
import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { placeGate } from './Logic'

function SingleQubitGate({ name, y, x }) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.SINGLEQUBITGATE,
      x: x,
      y: y,
      gate: name
    },
    end: (item) => placeGate(item),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
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
          paddingTop: '10%',
          paddingRight: '15%',
          paddingBottom: '10%',
          paddingLeft: '15%',
          outline: '2px solid black',
          background: 'white',
          zIndex: 1
        }}
      >
        {name}
      </div>
    </>
  )
}

export default SingleQubitGate
