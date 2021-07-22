import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { placeGate, getTips } from './Logic'

function SingleQubitGate({ name, y, x }) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: ItemTypes.GATE,
      x: x,
      y: y,
      gate: name,
    },
    end: (item) => placeGate(item),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
  });
  preview(getEmptyImage(), { captureDraggingState: true });
  return (
    <>
      <div
        ref={drag}
        className={`single-qubit-gate ${x <= 3 ? 'left' : 'right'}`}
      >
        {name}
        {!(getTips() & 1) && !isDragging && <span className="tooltip-text">Drag a gate onto a wire to start building your circuit!</span>}
        {!(getTips() & 2) && y >=1 && !isDragging && <span className="tooltip-text">Slide gates past each other to apply commutation rules!</span>}
      </div>
    </>
  )
}

export default SingleQubitGate
