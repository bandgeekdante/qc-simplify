import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { placeGate, getTips } from './Logic'

function SingleQubitGate({ name, y, x }) {
  const [, drag, preview] = useDrag({
    item: {
      type: ItemTypes.SINGLEQUBITGATE,
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
        className={`single-qubit-gate ${x <= 3 ? 'left' : 'right'}`}
      >
        {name}
        {!(getTips() & 1) && <span className="tooltip-text">Drag a gate onto a wire to start building your circuit!</span>}
        {!(getTips() & 2) && y >=1 && <span className="tooltip-text">Slide gates past each other to apply commutation rules!</span>}
      </div>
    </>
  )
}

export default SingleQubitGate
