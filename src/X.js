import React from 'react'
import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'

function X({ y, x }) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.SINGLEQUBITGATE,
            x: x,
            y: y},
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
        X
      </div>
    </>
  )
}

export default X
