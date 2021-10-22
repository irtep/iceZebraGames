export const callDice = (max) => {
  const result =  1 + Math.floor(Math.random() * max);
  return result;
}

export const arcVsArc = (sub, obj, subSize, objSize) => {
  const dx = sub.x - obj.x;
  const dy = sub.y - obj.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < subSize + objSize) {
    return true;
  } else {
    return false;
  }
};

export const diceThrows = (dicesSelect) => {
  let results = null;

  switch (dicesSelect) {
    case 'd6':
      results = callDice(6);
    break;
    case 'd3':
      results = callDice(3);
    break;
    case 'd8':
      results = callDice(8);
    break;
    case 'd16':
      results = callDice(16);
    break;
    case '3d6':
      const dice1 = JSON.stringify(callDice(6));
      const dice2 = JSON.stringify(callDice(6));
      const dice3 = JSON.stringify(callDice(6));
      results = `${dice1} ${dice2} ${dice3}`;
    break;
    case '4d6':
      const dice4 = JSON.stringify(callDice(6));
      const dice5 = JSON.stringify(callDice(6));
      const dice6 = JSON.stringify(callDice(6));
      const dice7 = JSON.stringify(callDice(6));
      results = `${dice4} ${dice5} ${dice6} ${dice7}`;
    break;
    case '2d6':
      const dice8 = JSON.stringify(callDice(6));
      const dice9 = JSON.stringify(callDice(6));
      results = `${dice8} ${dice9}`;
    break;
    default: console.log('dice not found!');
  }
  return results;
};
