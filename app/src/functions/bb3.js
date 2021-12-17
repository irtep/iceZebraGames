import { blockDices } from '../constants/constants';
import { Player } from '../constants/classes';
import { callDice } from './supportFuncs';

///////////////////////////////////////
///     BLOOD BOWL VERSION 3  ////////
/////////////////////////////////////

// draw a grid to football field
export const drawBBfield = (kanv, gameObject) => {
  const xLines = 16;
  const yLines = 27;
  const baseSize = 15;
  const grid_size = 35;
  const canvas = document.getElementById(kanv);
  const ctx = canvas.getContext("2d");
  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  const num_lines_x = Math.floor(xLines);
  const num_lines_y = Math.floor(yLines);
  let color11 = "rgb(190,190,190)";
  let color12 = "white";
  let color21 = "rgb(70,70,70)";
  let color22 = "silver";
  let team1 = undefined;
  let team2 = undefined;
  let ball = undefined;
  if (gameObject !== undefined) {
    color11 = gameObject.team1.colors[0];
    color12 = gameObject.team1.colors[1];
    color21 = gameObject.team2.colors[0];
    color22 = gameObject.team2.colors[1];
    team1 = gameObject.team1.roster;
    team2 = gameObject.team2.roster;
    ball = gameObject.ball;
  }

  // call clear
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  // Draw grid lines along X-axis
  for(let i = 0; i <= num_lines_x; i++) {
    ctx.beginPath();
    if (i === 5 || i === 12) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 3;
    }
    else if (i === 1 || i === xLines) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = "#e9e9e9";
      ctx.lineWidth = 1;
    }
    if (i === num_lines_x) {
      ctx.moveTo(20, grid_size*i);
      ctx.lineTo(canvas_width, grid_size*i);
    }
    else {
      ctx.moveTo(20, grid_size*i);
      ctx.lineTo(canvas_width, grid_size*i+0.5);
    }
      ctx.stroke();
    }

    // Draw grid lines along Y-axis
    for (let i = 0; i <= num_lines_y; i++) {
      ctx.beginPath();
      if ( i === 14 || i === 1 || i === 27 ) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = "#e9e9e9";
        ctx.lineWidth = 1;
      }
      if(i === num_lines_y) {
        ctx.moveTo(grid_size*i, 20);
        ctx.lineTo(grid_size*i, canvas_height);
      }
      else {
        ctx.moveTo(grid_size*i, 20);
        ctx.lineTo(grid_size*i, canvas_height);
        ctx.fillStyle = 'red';
        ctx.fillText (i, grid_size*i, 20);
        ctx.fill();
      }
      ctx.stroke();
    }

    // draw endZones
    ctx.beginPath();
    ctx.fillStyle = "navy";
    ctx.rect(35, 35, grid_size, grid_size * xLines - 35);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "darkRed";
    ctx.rect(35 * yLines - 35, 35, grid_size, grid_size * xLines - 35);
    ctx.fill();

    // draw center circle
    ctx.beginPath();
    ctx.strokeStyle = "rgb(190,190,190)";
    ctx.arc(490, 300, 50, 0, 2 * Math.PI);
    ctx.stroke();

    // draw the ball
    if (ball !== undefined) {
      ctx.beginPath();
      ctx.strokeStyle = 'yellow';
      ctx.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
      ctx.stroke();
    }

    //draw teams
    if (team1 !== undefined) {
      //console.log('drawing teams');
      team1.forEach((item, i) => {
        //console.log('first guy: ', item.x, item.y);
        ctx.beginPath();
        ctx.fillStyle = color11;
        ctx.arc(item.x, item.y, baseSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = 'red';
        ctx.font = '12px Times New Roman';
        ctx.fillStyle = color12;
        ctx.fillText(item.name, item.x - 30, item.y - 10);
        ctx.fillStyle = color12;
        ctx.fillText(item.status, item.x - 20, item.y);
        ctx.fillText(item.number, item.x - 10, item.y + 10);
        if (item.status === 'move') {
          ctx.fillText(item.movementLeft, item.x + 5, item.y);
        }
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      team2.forEach((item, i) => {
        //console.log('first guy: ', item.x, item.y);
        ctx.beginPath();
        ctx.fillStyle = color21;
        ctx.arc(item.x, item.y, baseSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = 'blue';
        ctx.font = '12px Times New Roman';
        ctx.fillStyle = color22;
        ctx.fillText(item.name, item.x - 30, item.y - 10);
        ctx.fillStyle = color22;
        ctx.fillText(item.status, item.x - 20, item.y);
        ctx.fillText(item.number, item.x - 10, item.y + 10);
        if (item.status === 'move') {
          ctx.fillText(item.movementLeft, item.x + 5, item.y);
        }
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
    } else {
      console.log('team1 undefined');
    }
}

export const armourBroken = (stunty, thickSkull) => {
    const injuryRoll = callDice(12);
    console.log('inj roll: ', injuryRoll);
    let injuryMessage = 'stunned';
    // stunty
    if (stunty) {
      if (injuryRoll === 8 || injuryRoll === 7) {
        if (thickSkull && injuryRoll !== 7) {
          injuryMessage = 'knocked out';
        } else {
          // not thick skull
          injuryMessage = 'knocked out';
        }
      }
      else if (injuryRoll > 8) {
        injuryMessage = 'dead';
      }
    } else {
      // normal
      if (injuryRoll === 8 || injuryRoll === 9) {
        if (thickSkull && injuryRoll !== 8) {
          injuryMessage = 'knocked out';
        } else {
          // not thick skull
          injuryMessage = 'knocked out';
        }
      }
      else if (injuryRoll > 9) {
        injuryMessage = 'dead';
      }
    }
    return {msg: injuryMessage, roll: injuryRoll};
}

export const bloodBowlDices = (dicesSelect) => {
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
    case '2d6':
      const dice1 = JSON.stringify(callDice(6));
      const dice2 = JSON.stringify(callDice(6));
      results = `${dice1} ${dice2}`;
    break;
    case '1block':
      const dice3 = callDice(6)-1;
      results = blockDices[dice3];
    break;
    case '2block':
      const dice4 = callDice(6)-1;
      const dice5 = callDice(6)-1;
      results = `${blockDices[dice4]} ${blockDices[dice5]}`;
    break;
    case '3block':
      const dice6 = callDice(6)-1;
      const dice7 = callDice(6)-1;
      const dice8 = callDice(6)-1;
      results = `${blockDices[dice6]} ${blockDices[dice7]} ${blockDices[dice8]}`;
    break;
    // use these for Blood Bowl 2:
    case '1bd':
      const dice9 = callDice(6)-1;
      results = [blockDices[dice9]];
    break;
    case '2bd':
      const dice10 = callDice(6)-1;
      const dice11 = callDice(6)-1;
      results = [blockDices[dice10], blockDices[dice11]];
    break;
    case '3bd':
      const dice12 = callDice(6)-1;
      const dice13 = callDice(6)-1;
      const dice14 = callDice(6)-1;
      results = [blockDices[dice12], blockDices[dice13], blockDices[dice14]];
    break;
    default: console.log('dice not found!');
  }
  return results;
}

export const makePlayer = (player, index, team) => {
  let avIndex = 25;
  // passsing skill - might mess, so need to do this:
  if (player.stats[avIndex] === '+') {
    avIndex--;
  }
  if (player.stats[avIndex] === '0') {
    console.log('is + with: ', player.name);
    avIndex--;
  }

  const newPlayer = new Player(
    index, player.img, player.name, player.skills.split(', '), player.specialRules.split(', '),
    Number(player.stats[3]), // ma
    Number(player.stats[8]), // st
    Number(player.stats[13]), // ag
    Number(player.stats[19]), // pa
    Number(player.stats[avIndex]), // av
    'ready', team, player.x, player.y
  );

  // convert possible 10 and 11 AV
  if (player.stats[avIndex] === '1') {
    newPlayer.av = '1' + player.stats[avIndex + 1];
    newPlayer.av = Number(newPlayer.av);
  }
  // convert possible 10 and 11 AV
  if (player.stats[avIndex] === '0') {
    newPlayer.av = '1' + player.stats[avIndex + 1];
    newPlayer.av = Number(newPlayer.av);
  }
  return newPlayer;
}
/*
export const makePlayer = (player, index, team) => {
  let avIndex = 25;

  const creatingPlayer = (number, img, name, skills, specialRules, ma, st, ag, pa, av, status, team, x, y) => {
    const createdPlayer = {
      number: number, img: img, name: name, skills: skills, specialRules: specialRules, ma: ma, st: st, ag: ag,
      pa: pa, av: av, status: status, team: team, x: x, y: y,
      gridX: Math.trunc( x / 35 ), gridY: Math.trunc( y / 35 ), activated: false, targeted: false,
      movementLeft: ma, rushes: 2, withBall: false,
      refreshMovement: function() {
        this.rushes = 2;
        this.movementLeft = this.ma;
      },
      move: function(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.gridX = Math.trunc( newX / 35 );
        this.gridY = Math.trunc( newY / 35 );
        this.movementLeft--;
        return this.movementLeft;
      },
      setStatus: function(newStatus) {
        this.status = newStatus;
        if (newStatus === 'knocked out' || newStatus === 'dead') {
          this.move(1900, 1900);
        }
      },
      getStats: function() {
        return this;
      },
      skillTest: function(skill, diceValue, modifier) {
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
    }
    return createdPlayer;
  }

  // passsing skill - might mess, so need to do this:
  if (player.stats[avIndex] === '+') {
    avIndex--;
  }
  if (player.stats[avIndex] === '0') {
    console.log('is + with: ', player.name);
    avIndex--;
  }

  const newPlayer = creatingPlayer(
    index, player.img, player.name, player.skills.split(', '), player.specialRules.split(', '),
    Number(player.stats[3]), // ma
    Number(player.stats[8]), // st
    Number(player.stats[13]), // ag
    Number(player.stats[19]), // pa
    Number(player.stats[avIndex]), // av
    'ready', team, player.x, player.y
  );

  // convert possible 10 and 11 AV
  if (player.stats[avIndex] === '1') {
    newPlayer.av = '1' + player.stats[avIndex + 1];
    newPlayer.av = Number(newPlayer.av);
  }
  // convert possible 10 and 11 AV
  if (player.stats[avIndex] === '0') {
    newPlayer.av = '1' + player.stats[avIndex + 1];
    newPlayer.av = Number(newPlayer.av);
  }
  return newPlayer;
}
*/

export const checkLineUp = (lineUp, offence) => {
  console.log('line up to check: ', lineUp);
  const wideZone1 = [];
  const wideZone2 = [];
  const scrimmage = [];
  const illegals = [];
  let dublicated = false;
  let reserves = 0;
  let results = true;

  lineUp.forEach((item, i) => {
    // check if dublicated positions
    lineUp.forEach((item2, i2) => {
      // check if dublicated positions
      if (i !== i2 && item.gridX === item2.gridX && item.gridY === item2.gridY && item.status !== 'reserve') {
        dublicated = true;
        console.log('found dublicated positions');
      }
    });

    if (item.status === 'reserve') {
      reserves++;
    }
    if (item.gridY < 5) {
      //widezone 1
      wideZone1.push(item);
    }
    if (item.gridY > 11 && item.gridY < 16) {
      //widezone 2
      wideZone2.push(item);
    }

    if (offence) {
      if (item.gridX > 13 || item.gridY > 16 || item.gridX < 1 || item.gridY < 1) {
        //illegal
        if (item.status !== 'reserve') {
          illegals.push(item);
        }
      }
      if (item.gridX === 13) {
        //scrimmage
        scrimmage.push(item);
      }
    } else {
      if (item.gridX < 14 || item.gridY > 16 || item.gridX > 26 || item.gridY < 1) {
        //illegal
        if (item.status !== 'reserve') {
          illegals.push(item);
        }
      }
      if (item.gridX === 14) {
        //scrimmage
        scrimmage.push(item);
      }
    }
  });

  // check dublicated positions
  if (dublicated) { results = false; console.log('dublicated positions found');}
  // check wide zone 1
  if (wideZone1.length > 2) { results = false; console.log('too many in wz1'); }
  // check wide zone 2
  if (wideZone2.length > 2) { results = false; console.log('too many in wz2');  }
  // check that minimum of 3 are in scrimmage
  if (scrimmage.length < 3) { results = false; console.log('not enough in scrimmage');  }
  // check that 11 players
  if ((lineUp.length - reserves) > 11) { results = false; console.log('too many players');  }
  // illegals
  if (illegals.length > 0) { results = false; console.log('illegals');  } /*
  console.log('results: ', 'w1 ', wideZone1, 'w2 ',  wideZone2, 's ',  scrimmage, 'i ',
   illegals, 'res ',  reserves, 'resu ',  results);*/
  return results;
}

export const bounce = (bounceDir, currentPlace) => {
  const square = 35;
  // bounce
  switch (bounceDir) {
    case 1:
      currentPlace.x -= square;
      currentPlace.y -= square;
    break;
    case 2:
      currentPlace.x -= square;
    break;
    case 3:
      currentPlace.x += square;
      currentPlace.y += square;
    break;
    case 4:
      currentPlace.x -= square;
    break;
    case 5:
      currentPlace.x += square;
    break;
    case 6:
      currentPlace.x -= square;
      currentPlace.y += square;
    break;
    case 7:
      currentPlace.y += square;
    break;
    case 8:
      currentPlace.x += square;
      currentPlace.y += square;
    break;
    default: console.log('not found direction at swich of bounce');
  }
  return currentPlace;
}

export const deviate = (deviateDir, deviateDis, currentPlace) => {
  /*
  123
  4 5
  678
  */
  const square = 35;
  // deviate
  switch (deviateDir) {
    case 1:
      currentPlace.x -= square * deviateDis;
      currentPlace.y -= square * deviateDis;
    break;
    case 2:
      currentPlace.x -= square * deviateDis;
    break;
    case 3:
      currentPlace.x += square * deviateDis;
      currentPlace.y += square * deviateDis;
    break;
    case 4:
      currentPlace.x -= square * deviateDis;
    break;
    case 5:
      currentPlace.x += square * deviateDis;
    break;
    case 6:
      currentPlace.x -= square * deviateDis;
      currentPlace.y += square * deviateDis;
    break;
    case 7:
      currentPlace.y += square * deviateDis;
    break;
    case 8:
      currentPlace.x += square * deviateDis;
      currentPlace.y += square * deviateDis;
    break;
    default: console.log('not found direction at swich of deviation');
  }

  console.log('returning: ', currentPlace);
  return currentPlace;
}

export const convertPosition = (location, squareSize) => {
  const x = Math.trunc(location.x / squareSize);
  const y = Math.trunc(location.y /squareSize);
  return {x, y};
}
/*
d6,
d6 with reroll,
random dir nw,n,ne,e,se,s,sw,w,
d3
block dice 1, 2, 3x : player down, both down, push back, stumble, pow!
d8
d16
deviate
scatter
bounce
add stunned to statuses (they become prone after own turn)

*/
