import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { placeGate } from './Logic'

function ControlledGate({ name, y, x }) {
  const [, drag, preview] = useDrag({
    item: {
      type: ItemTypes.GATE,
      x: x,
      y: y,
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
        className={`control ${x <= 3 ? 'left' : 'right'}`}
      >
        ⊕
      </div>
    </>
  )
}

export default ControlledGate
