import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { placeGate } from './Logic'

function ControlledGate({ name, cY, cX, gY, gX }) {
  const [, drag, preview] = useDrag({
    item: {
      type: ItemTypes.CONTROLLEDGATE,
      cX: cX,
      cY: cY,
      gX: gX,
      gY: gY,
      gate: name,
      moved: false
    },
    end: (item) => placeGate(item),
  });
  preview(getEmptyImage(), { captureDraggingState: true });
  return (
    <>
      <div
        ref={drag}
        style={{
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
        •
      </div>
    </>
  )
}

export default ControlledGate
