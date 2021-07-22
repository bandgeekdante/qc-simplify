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
    cancelTwoControls(y, x, x-1);
    let gates = cancelTwo(placedGates[y][x-1], placedGates[y][x]);
    if (!gates[1]) {
      placedGates[y][x-1] = false;
      placedGates[y][x] = gates[0];
    }
  }
  if (x < maxX && placedGates[y][x] && placedGates[y][x+1]) {
    cancelTwoControls(y, x, x+1);
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
    for (let y = 1; y <= maxY; y++) {
      for (let diff = 0; diff <= Math.max(item.x, maxX-item.x); diff++) {
        if (item.x - diff >= 0) {
          cancelOne(y, item.x - diff);
        }
        if (item.x + diff <= maxX) {
          cancelOne(y, item.x + diff);
        }
      }
    }
    if (!isControl(item.gate)) {
      tips |= 1;
    } else {
      tips |= 16;
    }
  } else if (item.x === maxX) {
    tips |= 4;
  }
  emitChange();
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
      if (slideControl(item, toY, toX)) {
        emitChange();
      }
    }
    return;
  } else if (toGate && ((item.y === toY && Math.abs(toX-item.x) === 1) || item.gate === toGate)) {
    if (isControl(toGate)) {
      if (slideControl({x: toX, y: toY, gate: toGate}, item.y, item.x)) {
        item.gate = placedGates[toY][toX];
        placedGates[toY][toX] = false;
      } else {
        return;
      }
    } else {
      commuteGate(item, toY, toX);
    }
  } else if (availableSquare(toY, toX)) {
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
    } else if (toGate === 'H' || item.gate === 'H') {
      if (toGate === 'X') {
        placedGates[toY][toX] = 'Z';
      } else if (toGate === 'Z') {
        placedGates[toY][toX] = 'X';
      } else if (item.gate === 'X') {
        item.gate = 'Z';
      } else if (item.gate === 'Z') {
        item.gate = 'X';
      } else if (toGate === 'Y' || item.gate === 'Y') {
        incGlobalPhase(1);
      }
    }
  }
  placedGates[item.y][item.x] = placedGates[toY][toX];
  placedGates[toY][toX] = false;
}

function slideControl(item, toY, toX) {
  let targetGate = placedGates[toY][toX];
  let partnerY = partners[item.y][item.x];
  let partnerToY = partnerY;
  let partnerGate = item.gate === 'C' ? '+' : 'C';
  let targetPartner = false;
  if (partnerY) {
    if (!canCommuteControl(targetGate, item, toY, toX, partnerY)) {
      return false;
    }
    let partnerItem = {gate: partnerGate, y: partnerY, x: item.x};
    // find target location for the partner
    if (partnerY === toY) {
      // push partner in same direction if possible
      if (toY > item.y && toY < maxY && !placedGates[toY+1][toX]) {
        partnerToY = toY+1;
      } else if (toY < item.y && toY > 1 && !placedGates[toY-1][toX]) {
        partnerToY = toY-1;
      } else {
        // otherwise swap target with partner
        partnerToY = item.y;
      }
    }
    targetPartner = placedGates[partnerToY][toX];
    if (item.x !== toX && !canCommuteControl(targetPartner, partnerItem, partnerToY, toX, item.y)) {
      return false;
    }
    partnerGate = partnerItem.gate;
    // remove gate and partner
    placedGates[item.y][item.x] = false;
    placedGates[partnerY][item.x] = false;
    partners[item.y][item.x] = false;
    partners[partnerY][item.x] = false;
  } else {
    // create partner immediately below or immediately above item
    partnerY = toY + (toY <= maxY / 2 ? 1 : -1);
    partnerToY = partnerY;
    if (placedGates[toY][toX] || placedGates[partnerToY][toX]) {
      return false;
    }
  }
  if (toY >= 1) {
    // clear commuting gates
    if (!isControl(targetGate)) {
      placedGates[toY][toX] = false;
    }
    if (!isControl(targetPartner)) {
      placedGates[partnerToY][toX] = false;
    }
    if (Math.abs(toX-item.x) === 1) {
      let didSlideGate = !isControl(targetGate) || slideControl({gate: targetGate, y: toY, x: toX}, item.y, item.x);
      let didSlidePartner = !didSlideGate || !isControl(targetPartner) || partners[item.y][item.x] === partnerY ||
                            slideControl({gate: targetPartner, y: partnerY, x: toX}, partnerToY, item.x);
      if (!didSlideGate || !didSlidePartner) {
        // restore the state
        if (isControl(targetGate) && didSlideGate) {
          // slide the target gate back
          slideControl({gate: targetGate, y: toY, x: item.x}, item.y, toX);
        }
        placedGates[partnerToY][toX] = targetPartner;
        placedGates[toY][toX] = targetGate;
        partners[partnerY][item.x] = item.y;
        partners[item.y][item.x] = partnerY;
        placedGates[partnerY][item.x] = partnerGate;
        placedGates[item.y][item.x] = item.gate;
        return false;
      }
      if (targetGate || targetPartner) {
        tips |= 2;
      }
    }
    if ((!targetGate || PauliNumber(targetGate)) && (!targetPartner || PauliNumber(targetPartner))) {
      commuteHalfControl(item.gate, targetGate, item.y, partnerY, item.x);
      commuteHalfControl(partnerGate, targetPartner, partnerY, item.y, item.x);
    } else {
      // slide single-qubit gates
      if (targetGate && !isControl(targetGate)) {
        placedGates[toY][item.x] = targetGate;
      }
      if (targetPartner && !isControl(targetPartner)) {
        placedGates[partnerToY][item.x] = targetPartner;
      }
    }
    // place gate and partner at new locations
    placedGates[toY][toX] = item.gate;
    placedGates[partnerToY][toX] = partnerGate;
    partners[toY][toX] = partnerToY;
    partners[partnerToY][toX] = toY;
  }
  item.x = toX;
  item.y = toY;
  item.moved = true;
  return true;
}

function canCommuteControl(targetGate, item, toY, toX, partnerY) {
  if (targetGate && toY >= 1) {
    // check if we should commute the control
    let targetPartner = placedGates[partnerY][toX];
    if (item.y === toY && Math.abs(toX-item.x) === 1) {
      if (targetGate === 'H' && targetPartner === 'H') {
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
        let partnerMatches = !targetPartner || controlToPauli(partnerGate) === controlToPauli(targetPartner);
        let oppositeMatches = !oppositePartnerCommuting || controlToPauli(oppositePartner) === controlToPauli(oppositePartnerCommuting);
        if (partnerMatches !== oppositeMatches) {
          // either they both match (so no extra gates get created) or neither match (so extra gates cancel out)
          return false;
        }
      }
    } else if (toX !== item.x || toY !== partnerY) {
      // cannot jump to another gate or push vertically onto another gate
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
}

export function swapControl(y, x) {
  if (y >= 1) {
    let controlGate = placedGates[y][x];
    placedGates[y][x] = placedGates[partners[y][x]][x];
    placedGates[partners[y][x]][x] = controlGate;
    tips |= 32;
    emitChange();
  }
}

function availableSquare(toY, toX) {
  return (toY >= 1 && toY <= maxY && !placedGates[toY][toX]) || (toY === 0 && toX === maxX);
}

export function squareClasses(y, x) {
  if (y < 1 || y > maxY) {
    return -8; // no wire
  }
  for (let i = 1; i < y; i++) {
    if (partners[i][x] && partners[i][x] > y) {
      return 3; // vertical wire
    }
  }
  if (isControl(placedGates[y][x])) {
    let partnerY = partners[y][x];
    if (partnerY > y) {
      return 1; // bottom wire
    } else if (partnerY < y) {
      return 2; // top wire
    }
  }
  return 0;
}

export function getTips() {
  // 1: place a single-qubit gate on the circuit
  // 2: slide different gates past each other
  // 4: drag a gate to the trash
  // 8: click the trash to clear the circuit
  // 16: place a control on the circuit
  // 32: swap direction of CNOT
  return tips;
}

export function clearCircuit() {
  placedGates = [...Array(maxY+1)].map(x=>Array(maxX+1).fill(false));
  partners = [...Array(maxY+1)].map(x=>Array(maxX+1).fill(false));
  globalPhase = 0;
  tips |= 8;
  emitChange();
}
