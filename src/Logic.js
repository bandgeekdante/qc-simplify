const maxX = 7;
const maxY = 6;
let placedGates = [...Array(maxY+1)].map(x=>Array(maxX+1).fill(false));
let partners = [...Array(maxY+1)].map(x=>Array(maxX+1).fill(false));
let globalPhase = 0;
let tips = 0;
let observer = null;

function emitChange() {
  observer(placedGates, globalPhase);
}

function cancelOne(y, x) {
  if (x > 0 && x < maxX && placedGates[y][x] && placedGates[y][x-1] && placedGates[y][x+1]) {
    cancelThree(y, x);
  }
  if (x > 0 && placedGates[y][x] && placedGates[y][x-1]) {
    setTimeout(function(){ cancelTwoControls(y, x, x-1); }, 1000);
    let gates = cancelTwo(placedGates[y][x-1], placedGates[y][x]);
    if (!gates[1]) {
      placedGates[y][x-1] = false;
      placedGates[y][x] = gates[0];
    }
  }
  if (x < maxX && placedGates[y][x] && placedGates[y][x+1]) {
    setTimeout(function(){ cancelTwoControls(y, x, x+1); }, 1000);
    let gates = cancelTwo(placedGates[y][x], placedGates[y][x+1]);
    if (!gates[1]) {
      placedGates[y][x+1] = false;
      placedGates[y][x] = gates[0];
    }
  }
}

function cancelThree(y, x) {
  if (placedGates[y][x-1] === placedGates[y][x+1] && !isControl(placedGates[y][x+1])) {
    if (placedGates[y][x-1] === placedGates[y][x]) {
      // XXX = X, YYY = Y, ZZZ = Z, HHH = H
      placedGates[y][x-1] = false;
      placedGates[y][x+1] = false;
    } else if (placedGates[y][x-1] === 'H' && PauliNumber(placedGates[y][x])) {
      placedGates[y][x-1] = false;
      placedGates[y][x+1] = false;
      if (placedGates[y][x] === 'X') {
        // HXH = Z
        placedGates[y][x] = 'Z';
      } else if (placedGates[y][x] === 'Y') {
        // HYH = -Y
        incGlobalPhase(1);
      } else if (placedGates[y][x] === 'Z') {
        // HZH = X
        placedGates[y][x] = 'X';
      }
    } else if (placedGates[y][x-1] === 'Y' && placedGates[y][x] === 'H') {
      // YHY = -H
      placedGates[y][x-1] = false;
      placedGates[y][x+1] = false;
      incGlobalPhase(1);
    }
  } else if (placedGates[y][x] === 'H' && (
              (placedGates[y][x-1] === 'X' && placedGates[y][x+1] === 'Z')
           || (placedGates[y][x-1] === 'Z' && placedGates[y][x+1] === 'X'))) {
    // XHZ = ZHX = H
    placedGates[y][x-1] = false;
    placedGates[y][x+1] = false;
  }
}

function isControl(gate) {
  return (gate === 'C' || gate === '+');
}

function cancelTwo(first, second) {
  if (first === second && !isControl(first)) {
    first = false;
    second = false;
    return [first, second];
  }
  let p1 = PauliNumber(first);
  let p2 = PauliNumber(second);
  if (p1 && p2) {
    if (p2-p1 === 1 || p2-p1 === -2) {
      first = PauliGate((p1 + 2) % 3);
      incGlobalPhase(1.5);
    } else {
      first = PauliGate((p1 + 1) % 3);
      incGlobalPhase(0.5);
    }
    second = false;
    return [first, second];
  }
  return [first, second];
}

function cancelTwoControls(y, x1, x2) {
  if (isControl(placedGates[y][x1]) && placedGates[y][x2] === placedGates[y][x1] &&
       partners[y][x1] === partners[y][x2]) {
    let partnerY = partners[y][x1];
    placedGates[y][x1] = false;
    placedGates[y][x2] = false;
    placedGates[partnerY][x1] = false;
    placedGates[partnerY][x2] = false;
    partners[y][x1] = false;
    partners[y][x2] = false;
    partners[partnerY][x1] = false;
    partners[partnerY][x2] = false;
    emitChange();
  }
}

function incGlobalPhase(inc) {
  globalPhase = (globalPhase + inc) % 2;
  if (globalPhase === 0) {
    placedGates[0][maxX] = false;
  } else {
    placedGates[0][maxX] = 'T';
  }
}

function PauliNumber(gate) {
  if (gate === 'X') {
    return 1;
  } else if (gate === 'Y') {
    return 2;
  } else if (gate === 'Z') {
    return 3;
  } else {
    return 0;
  }
}

function PauliGate(number) {
  if (number === 1) {
    return 'X';
  } else if (number === 2) {
    return 'Y';
  } else if (number === 0) {
    return 'Z';
  }
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }
  observer = o;
  emitChange();
}

export function placeGate(item) {
  if (item.y >= 1) {
    // placedGates[item.y][item.x] = item.gate;
    cancelOne(item.y, item.x);
    for (let diff = 1; diff <= Math.max(item.x, maxX-item.x); diff++) {
      if (item.x - diff >= 0) {
        cancelOne(item.y, item.x - diff);
      }
      if (item.x + diff <= maxX) {
        cancelOne(item.y, item.x + diff);
      }
    }
    tips |= 1;
  } else if (item.x === maxX) {
    tips |= 4;
  }
  emitChange();
}

export function placeControl(item) {
  if (item.y >= 1) {
    tips |= 16;
    placeGate(item);
  }
}

export function slideGate(item, toY, toX) {
  if (item.y >= 1) {
    item.gate = placedGates[item.y][item.x];
  }
  let toGate = placedGates[toY][toX];
  if (item.y === toY && item.x === toX) {
    return;
  } else if (isControl(item.gate)) {
    if (toY >= 1 || toX === maxX) {
      slideControl(item, toY, toX);
    }
    return;
  } else if (toGate && item.y === toY && Math.abs(toX-item.x) === 1) {
    if (isControl(toGate)) {
      if (slideControl({x: toX, y: toY, gate: toGate}, item.y, item.x)) {
        item.gate = placedGates[toY][toX];
      } else {
        return;
      }
    } else {
      commuteGate(item, toY, toX)
    }
  } else if (canPlaceGate(item, toY, toX)) {
    placedGates[item.y][item.x] = false;
  } else {
    return;
  }
  item.x = toX;
  item.y = toY;
  if (toY >= 1) {
    placedGates[toY][toX] = item.gate;
  }
  item.moved = true;
  emitChange();
}

function commuteGate(item, toY, toX) {
  let toGate = placedGates[toY][toX];
  if (toGate !== item.gate) {
    tips |= 2;
     if (PauliNumber(toGate) && PauliNumber(item.gate)) {
      incGlobalPhase(1);
    } else {
      // commuting with H
      if (toGate === 'X') {
        placedGates[toY][toX] = 'Z';
      } else if (toGate === 'Z') {
        placedGates[toY][toX] = 'X';
      } else if (item.gate === 'X') {
        item.gate = 'Z';
      } else if (item.gate === 'Z') {
        item.gate = 'X';
      } else {
        // commuting H and Y
        incGlobalPhase(1);
      }
    }
  }
  placedGates[item.y][item.x] = placedGates[toY][toX];
  placedGates[toY][toX] = false;
  cancelOne(item.y, item.x);
}

function slideControl(item, toY, toX) {
  // if (item.gate !== placedGates[item.y][item.x]) {
  //   // do nothing if recursively called after already moving the gate
  //   return true;
  // }
  let targetGate = placedGates[toY][toX];
  let partnerY = partners[item.y][item.x];
  if (!canCommuteControl(targetGate, item, toY, toX, partnerY)) {
    return false;
  }
  let partnerGate = item.gate === 'C' ? '+' : 'C';
  let targetPartner = false;
  if (partnerY !== false) {
    // get partner info
    targetPartner = placedGates[partnerY][toX];
    // swap partner Y if necessary
    if (partnerY === toY) {
      partnerY = item.y;
    };
    if (item.x !== toX && !canCommuteControl(targetPartner, {gate: partnerGate, y: partnerY, x: item.x}, partnerY, toX, item.y)) {
      return false;
    }
    // remove gate and partner
    placedGates[item.y][item.x] = false;
    placedGates[partnerY][item.x] = false;
    partners[item.y][item.x] = false;
    partners[partnerY][item.x] = false;
  } else {
    // create partner immediately below or immediately above item
    partnerY = toY + (toY <= maxY / 2 ? 1 : -1);
    if (placedGates[partnerY][toX]) {
      return false;
    }
  }
  if (toY >= 1) {
    // clear commuting gates
    placedGates[toY][toX] = false;
    placedGates[partnerY][toX] = false;
    if (targetGate || targetPartner) {
      tips |= 2;
    }
    if (Math.abs(toX-item.x) === 1) {
      if ((isControl(targetGate) && !slideControl({gate: targetGate, y: toY, x: toX}, item.y, item.x)) ||
         (!isControl(targetGate) && isControl(targetPartner) &&
          !slideControl({gate: targetPartner, y: partnerY, x: toX}, partnerY, item.x))) {
          // restore the state
          placedGates[partnerY][toX] = targetPartner;
          placedGates[toY][toX] = targetGate;
          partners[partnerY][item.x] = item.y;
          partners[item.y][item.x] = partnerY;
          placedGates[partnerY][item.x] = partnerGate;
          placedGates[item.y][item.x] = item.gate;
          return false;
        }
      }
      if (PauliNumber(targetPartner) && PauliNumber(targetGate)) {
        commuteHalfControl(partnerGate, targetPartner, partnerY, item.y, item.x);
        commuteHalfControl(item.gate, targetGate, item.y, partnerY, item.x);
      } else {
        // slide single-qubit gates
        if (!isControl(targetGate)) {
          placedGates[toY][item.x] = targetGate;
          cancelOne(toY,item.x);
        }
        if (!isControl(targetPartner)) {
          placedGates[partnerY][item.x] = targetPartner;
          cancelOne(partnerY,item.x);
        }
      }
    // place gate and partner at new locations
    placedGates[toY][toX] = item.gate;
    placedGates[partnerY][toX] = partnerGate;
    partners[toY][toX] = partnerY;
    partners[partnerY][toX] = toY;
  }
  item.x = toX;
  item.y = toY;
  item.moved = true;
  emitChange();
  return true;
}

function canCommuteControl(targetGate, item, toY, toX, partnerY) {
  if (targetGate && toY >= 1) {
    // check if we should commute the control
    let targetGate = placedGates[partnerY][toX];
    if (item.y === toY && Math.abs(toX-item.x) === 1) {
      if (targetGate === 'H' && targetGate === 'H') {
        // both H swap direction of control
        item.gate = item.gate === 'C' ? '+' : 'C';
        return true;
      }
      if (!PauliNumber(targetGate) && targetGate !== item.gate) {
        // cannot slide horizontally across H or opposite control
        return false;
      }
      if (isControl(targetGate)) {
        let partnerGate = placedGates[partnerY][item.x];
        let oppositePartner = placedGates[partners[toY][toX]][toX];
        let oppositePartnerCommuting = placedGates[partners[toY][toX]][item.x];
        let partnerMatches = !targetGate || controlToPauli(partnerGate) === controlToPauli(targetGate);
        let oppositeMatches = !oppositePartnerCommuting || controlToPauli(oppositePartner) === controlToPauli(oppositePartnerCommuting);
        if (partnerMatches !== oppositeMatches) {
          // either they both match (so no extra gates get created) or neither match (so extra gates cancel out)
          return false;
        }
      }
    } else if (toX !== item.x || toY !== partnerY) {
      // cannot push vertically onto another gate
      return false;
    }
  }
  return true;
}

// convert a control gate to its corresponding Pauli gate
function controlToPauli(gate) {
  if (gate === 'C') {
    return 'Z';
  } else if (gate === '+') {
    return 'X';
  } else {
    return gate;
  }
}

function commuteHalfControl(controlGate, commuteGate, controlY, partnerY, x) {
  if ((controlGate === 'C' && commuteGate === 'Z') || (controlGate === '+' && commuteGate === 'X')) {
    placedGates[controlY][x] = cancelTwo(commuteGate, placedGates[controlY][x])[0]
  } else if ((controlGate === '+' && commuteGate === 'Z') || (controlGate === 'C' && commuteGate === 'X')) {
    placedGates[controlY][x] = cancelTwo(commuteGate, placedGates[controlY][x])[0];
    placedGates[partnerY][x] = cancelTwo(commuteGate, placedGates[partnerY][x])[0];
  } else if (commuteGate === 'Y') {
    placedGates[controlY][x] = cancelTwo(commuteGate, placedGates[controlY][x])[0];
    placedGates[partnerY][x] = cancelTwo((controlGate === 'C' ? 'X' : 'Z'), placedGates[partnerY][x])[0];
  }
  cancelOne(controlY, x);
  cancelOne(partnerY, x);
}

export function canPlaceGate(item, toY, toX) {
  return (
    ((toY >= 1 && toY <= maxY) && ((item.moved && item.y === toY && item.x === toX) || !(placedGates[toY][toX])))
    || ((item.y >= 1 || item.x === maxX) && toY === 0 && toX === maxX)
  );
}

export function getTips() {
  // 1: place a single-qubit gate on the circuit
  // 2: slide different gates past each other
  // 4: drag a gate to the trash
  // 8: click the trash to clear the circuit
  // 16: place a control on the circuit
  return tips;
}

export function clearCircuit() {
  placedGates = [...Array(maxY+1)].map(x=>Array(maxX+1).fill(false));
  partners = [...Array(maxY+1)].map(x=>Array(maxX+1).fill(false));
  globalPhase = 0;
  tips |= 8;
  emitChange();
}
