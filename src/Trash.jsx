import { clearCircuit, getTips } from './Logic'

function Trash() {
  return (
    <>
      <div
        className = 'trash right'
        onClick = {clearCircuit}
      >
        {/* TODO: Replace Unicode with an actual icon */}
        🗑
        {/* {console.log(getTips())} */}
        {!(getTips() & 12) && <span className="tooltip-text">Drag a gate here to remove it, or click to clear the circuit!</span>}
        {((getTips() & 12) === 4) && <span className="tooltip-text">Click here to clear the circuit!</span>}
        {((getTips() & 12) === 8) && <span className="tooltip-text">Drag a gate here to remove it!</span>}
      </div>
    </>
  );
}

export default Trash;
