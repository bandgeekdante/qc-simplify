import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { placeGate, getTips } from './Logic'

function ControlledGate({ name, y, x }) {
  const [, drag, preview] = useDrag({
    item: {
      type: ItemTypes.GATE,
      x: x,
      y: y,
      gate: name,
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
        {!(getTips() & 2) && y >=1 && <span className="tooltip-text">Slide gates past each other to apply commutation rules!</span>}
      </div>
    </>
  )
}

export default ControlledGate
