
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
