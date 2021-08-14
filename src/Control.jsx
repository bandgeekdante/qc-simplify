import { ItemTypes } from './Constants'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { placeGate, getTips, swapControl } from './Logic'

function Control({ name, y, x }) {
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
        className={`control ${x <= 3 ? 'left' : 'right'}`}
        onDoubleClick= {() => swapControl(y,x)}
      >
        <span className={`circle${name === 'C' ? ' fill' : ''}`}></span>
        {!(getTips() & 16) && !isDragging && <span className="tooltip-text">Drag this control to make a CNOT gate!</span>}
        {!(getTips() & 32) && !isDragging && y >=1 &&
         ((name === 'C' && <span className="tooltip-text">Double-click to swap the CNOT direction!</span>)
                        || <span className="tooltip-text">Double-click to make a Control-Z gate!</span>)}
      </div>
    </>
  )
}

export default Control
