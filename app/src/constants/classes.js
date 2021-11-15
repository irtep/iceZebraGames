
export class BloodBowlCard {
  constructor(name, team, game, stats, skills, cost, specialRules) {
    this.name = name; this.team = team; this.game = game; this.stats = stats;
    this.skills = skills; this.cost = cost; this.specialRules = specialRules;
  }
}

// blood bowl players
export class Player {
  constructor(number, img, name, skills, specialRules, ma, st, ag, pa, av, status, team, x, y) {
  this.number = number; this.img = img; this.name = name; this.skills = skills;
  this.specialRules = specialRules; this.ma = ma; this.st = st; this.ag = ag; this.pa = pa;
  this.av = av; this.status = status; this.team = team; this.x = x; this.y = y;
  this.gridX = Math.trunc( x / 35 );
  this.gridY = Math.trunc( y / 35 );
  this.activated = false;
  this.targeted = false;
  this.movementLeft = ma;
  };

  move(newX, newY) {
    this.x = newX;
    this.y = newY;
    this.gridX = Math.trunc( newX / 35 );
    this.gridY = Math.trunc( newY / 35 );
    this.movementLeft--;
    return this.movementLeft;
  }

  setActivated() {
    this.activated = !this.activated;
  }

  setTargeted() {
    this.targeted = !this.targeted;
  }

  setStatus(newStatus) {
    this.status = newStatus;
  }

  getStats() {
    return this;
  }

  skillTest(skill, diceValue, modifier) {
    console.log('skillTest: ', skill, diceValue, modifier);
    const totalValue = diceValue + modifier;
    if (this[skill] <= totalValue) {
      console.log('pass');
      return true;
    } else {
      console.log('failed');
      return false;
    }
  }

  isInLocation(location, squareSize) {
    const locaConverted = {x: Math.trunc(location.x / squareSize), y: Math.trunc(location.y / squareSize)};
    const gridLocationOfPlayer = {x: this.gridX, y: this.gridY};
    if (locaConverted.x === gridLocationOfPlayer.x &&
        locaConverted.y === gridLocationOfPlayer.y) {
      return true;
    } else {
      return false;
    }
  }

  markedBy(listOfOpponents) {
    let markers = [];
    const myTacklezone = [
      {x: this.gridX-1, y: this.gridY-1},
      {x: this.gridX, y: this.gridY-1},
      {x: this.gridX+1, y: this.gridY-1},
      {x: this.gridX-1, y: this.gridY},
      {x: this.gridX+1, y: this.gridY},
      {x: this.gridX-1, y: this.gridY+1},
      {x: this.gridX, y: this.gridY+1},
      {x: this.gridX+1, y: this.gridY+1}
    ];
    listOfOpponents.forEach((item) => {
      myTacklezone.forEach((item2) => {
        if (item.gridX === item2.x && item.gridY === item2.y) {
          markers.push(item);
        }
      });
    });
    return markers;
  }
}
/*
name,
team,
game,
stats,
skills,
cost,
specialRules
*/
