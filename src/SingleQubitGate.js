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
        className='single-qubit-gate'
      >
        {name}
        {getTips() === 0 && <span className="tooltip-text">Drag a gate onto a wire to start building your circuit!</span>}
      </div>
    </>
  )
}

export default SingleQubitGate
