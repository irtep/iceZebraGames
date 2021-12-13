
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
  this.rushes = 2;
  this.withBall = false;
  };

  refreshMovement() {
    this.rushes = 2;
    this.movementLeft = this.ma;
  }

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
    if (newStatus === 'knocked out' || newStatus === 'dead') {
      this.move(1900, 1900);
    }
  }

  getStats() {
    return this;
  }

  skillTest(skill, diceValue, modifier) {
    console.log('skillTest: ', skill, diceValue, modifier);
    const totalValue = diceValue + modifier;
    console.log('this[skill]: ', this[skill]);
    if (this[skill] <= totalValue) {
      console.log('pass, dice, modifier ', diceValue, modifier);
      return true;
    } else {
      console.log('failed, dice, modifier', diceValue, modifier);
      return false;
    }
  }

  // use this when checking with x and y, example 100 and 100
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

  // use this if using gridX and gridY, for example 1 and 1
  getLocation() {
    return {x: this.gridX, y: this.gridY};
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
          if (item.status === 'activated' || item.status === 'ready' || item.status === 'moved') {
            console.log('marker with status: ', item.status);
            markers.push(item);
          }
        }
      });
    });
    return markers;
  }

  // checks to what squares can move from current location
  checkForMove(friends, opponents) {
    let freeSquares = [];
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

    myTacklezone.forEach((item) => {
      let found = false;
      friends.forEach((item2) => {
        //console.log('compring to friend', item2.number);
        const hisSquare = item2.getLocation();
        //console.log('hisSquare.grixX and gridY ', hisSquare.x, hisSquare.y);
        if (item.x === hisSquare.x && item.y === hisSquare.y) {
          found = true;
        }
      });
      if (!found) {
        opponents.forEach((item2) => {
          const hisSquare = item2.getLocation();
          if (item.x === hisSquare.x && item.y === hisSquare.y) {
            found = true;
          }
        });
      }
      if (!found) {
        freeSquares.push(item);
      }
    });
    console.log('returning freeSquares: ', freeSquares);
    return freeSquares;
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
