/*

gotta find clear and smooth game flow.....something like where gameObject rolls around etc.
this state based does not work that well as it comes late when it should not be late

bugs:
Continue:
move ball does not work (button)
when player remove, does not lose ball

pre-game:
something..

start game:
kickoff => startTurn (phase: gameplay)

clicked => if gamePlay

*/
import { drawBBfield, bloodBowlDices, makePlayer, checkLineUp, deviate, bounce, convertPosition, armourBroken,
switchActiveTeam, checkIfBallLocation }
from '../functions/bb3';
import { arcVsArc, callDice } from '../functions/supportFuncs';
//import { setDefence/*, setOffence*/} from '../functions/ai/ai';
import { bb3InitialGameObject, /*rerollPrices*/ } from '../constants/constants';
//import { Player } from '../constants/classes';
import { useEffect, useState } from 'react';
import { getTeams, getAll } from '../services/dbControl';
import ShowAllTeams from './ShowAllTeams';
import '../styles/bloodBowl2.css';

const BloodBowl3 = ({game}) => {
  const [msg, setMsg] = useState('select first teams');
  const [log, setLog] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [mousePosition, setMp] = useState('');
  const [details, setDetails] = useState('');
  const [gameObject, setGameObject] = useState (bb3InitialGameObject);
  const [actionButtons, setActionButtons] = useState('');
  const [forceStatus, setForceStatus] = useState('off');
  const [dices, setDices] = useState('');
  const [action, setAction] = useState('nothing');
  const squareSize = 35;

  // when this component is loaded
  useEffect( () => {
    drawBBfield("bloodBowlStadium");
    getTeams().then(initialData => {
       setTeams(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
     getAll().then(initialData => {
        setPlayers(initialData);
      }).catch(err => {
        console.log('error', err.response);
      });
  }, []);

  const hovering = (e) => {
    // get mouse locations offsets to get where mouse is hovering.
    const gO = {...gameObject};
    let r = document.getElementById('bloodBowlStadium').getBoundingClientRect();
    let x = e.clientX - r.left;
    let y = e.clientY - r.top;
    const hoverDetails = {x: x, y: y};
    const allPlayers = gameObject.team1.roster.concat(gameObject.team2.roster);
    // check if hovering over someone
    allPlayers.forEach((item, i) => {
      const collision = arcVsArc(mousePosition, item, 10, 15);
      if (collision) {
        const presenting = `(${item.name})
        (MA ${item.ma})
        (ST ${item.st})
        (AG ${item.ag}+)
        (PA ${item.pa}+)
        (AV ${item.av}+)
        (${item.skills})
        (${item.specialRules})`;
        setDetails(presenting);
      }
      // set ball location
      if (item.withBall) {
        if (gO.ball.x !== item.x && gO.bally !== item.y) {
          gO.ball.x = item.x;
          gO.ball.y = item.y;
        }
      }
    });
    drawBBfield("bloodBowlStadium", gameObject);
    setMp(hoverDetails);
    setGameObject(gO);
  }

  const diceThrow = (e) => {
    setDices(bloodBowlDices(e.target.id));
  }

  const forceStatusSwitch = (e) => {
    setForceStatus(e.target.id);
  }

/////// PRE GAME  ////////////////

  const activateTeam = (e) => {
    const gO = {...gameObject};
    let index = 'team1';
    let index2 = 'team2';
    if (e.target.id === 'activateTeam2') {
      index = 'team2';
      index2 = 'team1';
    }
    gO[index].active = true;
    gO[index2].active = false;
    setGameObject(gO);
  }

  const addTeam =  (e) => {
    const clickedEntry = Number(e.target.id);
    const gO = JSON.parse(JSON.stringify(gameObject));
    let active = 'team1';
    let startPoint = {x: 50, y: 100};
    let activeRoster = [];
    const selectedTeam = teams.filter( team => team.id === clickedEntry);

    if (gO.team2.active) {
      active = 'team2';
      startPoint.y = 450;
    }

    activeRoster = gO[active].roster;

    gO[active].rerolls = selectedTeam[0].reRolls;
    gO[active].team = selectedTeam[0].teamName;
    gO[active].colors = [selectedTeam[0].color1, selectedTeam[0].color2]

    selectedTeam[0].roster.forEach((item) => {
      const selectedPlayer = players.filter( player => item.id === player.id);
      const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
      newPlayer.x = startPoint.x + (activeRoster.length + 1) * 36;
      newPlayer.y = startPoint.y;
      newPlayer.status = 'ready';
      activeRoster.push(newPlayer);
    });

    setGameObject(gO);
    drawBBfield("bloodBowlStadium", gO);
  }

  const startGame = () => {
    const gO = JSON.parse(JSON.stringify(gameObject));

    const roster1 = gO.team1.roster.concat([]);
    const roster2 = gO.team2.roster.concat([]);
    gO.team1.roster = [];
    gO.team2.roster = [];

    if (roster1.length < 1 || roster2.length < 1) {
      return null;
    }

    setMsg('dice roll off:');
    let playerDice = 0;
    let aiDice = 0;

    do {
      playerDice = callDice(6);
      aiDice = callDice(6);
      addToLog(`player rolled: ${playerDice}, ai rolled: ${aiDice}`);
    } while (playerDice === aiDice);

    addToLog(<br key= {playerDice+callDice(999)+aiDice}/>);

    if (playerDice > aiDice) {
      addToLog('team 1 receives the kick!');
      setMsg('set defence for team 2:');
      gO.team2.active = true;
      gO.team1.active = false;
    } else {
      addToLog('team 2 receives the kick!');
      setMsg('set defensive formation for team 1 (to right side!)');
      gO.team1.active = true;
      gO.team2.active = false;
    }

    roster1.forEach((item, i) => {
      const createdPlayer = makePlayer(item, i, gameObject.team1.team);
      gO.team1.roster.push(createdPlayer);
    });
    roster2.forEach((item, i) => {
      const createdPlayer = makePlayer(item, i, gameObject.team2.team);
      gO.team2.roster.push(createdPlayer);
    });

//    console.log('converted roster 1: ', convertedRoster1);
//    gO.team1.roster = convertedRoster1;
//    gO.team2.roster = convertedRoster2;
    //console.log('gO roster: ', gO.team1.roster);
    gO.phase = 'set defence';
    setGameObject(gO);
  }

  ///////////  DEBUG /////////////////
  const checki = () => {
    console.log('gameObject: ', gameObject);
  }

  /////////// FUNCTIONS //////////////
  const addToLog = (newMessage) => {
    const logs = document.getElementById('log');
    const copyOfLog = log.concat([]);
    copyOfLog.push(<br key= {callDice(9999)}/>);
    copyOfLog.push(newMessage);
    setLog(copyOfLog);
    logs.scrollTop = logs.scrollHeight;
  }

  const pickUpAction = (who, opponentRoster) => {
    const sureHands = who.skills.filter( skill => skill === 'Sure Hands');
    const noHands = who.skills.filter( skill => skill === 'No Hands');
    const diceValue1 = callDice(6);
    const diceValue2 = callDice(6);
    const markers = who.markedBy(opponentRoster);
    let modifier = 0;
    if (markers.length > 0) {modifier = -Math.abs(markers.length)}
    const picking1 = who.skillTest('ag', diceValue1, modifier);
    console.log('pick up dice and modifier: ', diceValue1, modifier);
    addToLog(`${who.number} tries to pick up. Dice: ${diceValue1}, modifier: ${modifier}`);

    if (noHands.length > 0) {
      addToLog('no hands, so failed.');
      return false;
    }
    if (picking1) {
      console.log('he has the ball');
      addToLog('... and he has the ball.');
      return true;
    } else {
      // with sure hands auto reroll
      if (sureHands.length > 0) {
        const picking2 = who.skillTest('ag', diceValue2, modifier);
        addToLog(`retry with Sure Hands: ${diceValue2} with modifier ${modifier}`);
        if (picking2) {
          addToLog('sure hands ok!')
          return true;
        }
      }
      return false;
    }
  }

  const gamePlay = () => {
    const gO = {...gameObject};
    console.log('gamePlay called');
    let currentRoster = gO.team1.roster;
    let opponentRoster = gO.team2.roster;
    let activeTeamIndex = 'team1';
    let newButtons = [];

    if (gO.team2.active) {
      currentRoster = gO.team2.roster;
      opponentRoster = gO.team1.roster;
//      team2Turn = true;
      activeTeamIndex = "team2";
    }

    // check first if user wants to set force status
    if (forceStatus !== 'off') {
      const convertedPosition = convertPosition(mousePosition, squareSize);

      currentRoster.forEach((item, i) => {
        if (item.gridX === convertedPosition.x && item.gridY === convertedPosition.y) {
          item.setStatus(forceStatus);
          if (forceStatus === 'knocked out' || forceStatus === 'dead') {
            item.move(1900, 1900);
          }
        }
      });
      opponentRoster.forEach((item, i) => {
        if (item.gridX === convertedPosition.x && item.gridY === convertedPosition.y) {
          item.setStatus(forceStatus);
          if (forceStatus === 'ko' || forceStatus === 'casualty') {
            item.move(1900, 1900);
          }
        }
      });
      // reset forceStatus
      setForceStatus('off');
      // set both rosters
      setGameObject(gO);
    }

    // check if pusher follows
    currentRoster.forEach((item, i) => {
      if (item.status === 'pushQuery') {
        // check if next to pushed and if
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);

        setMsg('choose place to follow up (only that place where that guy was)');
        if (moveChecking.length === 1) {
          item.move(mousePosition.x, mousePosition.y);
          addToLog(`${item.number} is following up...`);
            item.setStatus('activated');
        } else {
          item.setStatus('activated');
        }
      }
    });

    // check if pushed or side stepping
    opponentRoster.forEach((item, i) => {

      if (item.status === 'pushed' || item.status === 'pushedStunned' || item.status === 'pushedFallen') {
        // check if next to pushed and if
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);
        let nextStatus = 'activated';

        if (item.status === 'pushedStunned') { nextStatus = 'stunned'}
        if (item.status === 'pushedFallen') { nextStatus = 'fallen'}

        setMsg('choose place to push the pushed guy (chain push not supported atm.)');
        if (moveChecking.length === 1) {
          item.move(mousePosition.x, mousePosition.y);
          addToLog(`${item.number} is pushed...`);
            item.setStatus(nextStatus);
        } else {
          item.setStatus(nextStatus);
        }
      }

      else if (item.status === 'sideStepping') {
        // check if next to pushed and if
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);

        setMsg('choose place to sidestep the stepping guy');
        if (moveChecking.length === 1) {
          item.move(mousePosition.x, mousePosition.y);
          addToLog(`${item.number} is sidestepping...`);
          item.setStatus('ready');
        } else {
          item.setStatus('ready');
        }
      }

      // check if wants to follow up
      currentRoster.forEach((itemBB, ibb) => {
        if (itemBB.status === 'pushing') {
          itemBB.setStatus('pushQuery');
        }
      });
    });

    currentRoster.forEach((item, i) => {
      // check if stunty and thick skull
      const stuntyCheck = item.skills.filter( skill => skill === 'Stunty');
      const thickSkullCheck = item.skills.filter( skill => skill === 'Thick Skull');
      const sureFeetCheck = item.skills.filter( skill => skill === 'Thick Skull');
      const dauntlessCheck = item.skills.filter( skill => skill === 'Dauntless');
      //const brawlCheck = item.skills.filter( skill => skill === 'Brawl');
      //const blockCheck = item.skills.filter( skill => skill === 'Block');
      //const frenzyCheck = item.skills.filter( skill => skill === 'Frenzy');
      let stunty = false;
      let thickSkull = false;
      let targetClicked = false;

      if (stuntyCheck.length === 1) {stunty = true;}
      if (thickSkullCheck.length === 1) {thickSkull = true;}

      // block
      if (item.status === 'block') {
        const actionButtons = [];

        // remove older possible block statuses from friends
        currentRoster.forEach((itemB, ib) => {
          if (itemB.status === 'block' && ib !== i) {
            item.setStatus('activated');
          }
        });
        // also for move and blitz
        currentRoster.forEach((itemB, ib) => {
          if ((itemB.status === 'move' || item.status === 'blitz') && ib !== i) {
            item.setStatus('activated');
          }
        });

        opponentRoster.forEach((itemx, ix) => {
          // check from here if it was clicked
            const collision = arcVsArc(mousePosition, itemx, 10, 15);

            if (collision) {
              const markers = item.markedBy(opponentRoster);
              console.log('block targets: ', markers);

              if (markers.length > 0) {
                markers.forEach((itemm, im) => {
                  if (itemm.number === itemx.number && itemm.name === itemx.name) {
                    itemm.setStatus('target');
                    targetClicked = true;

                    if (targetClicked) {
                      // get strengths
                      let blockerSt = item.st;
                      let targetSt = itemm.st;
                      let blockerModifier = 0;
                      let targetModifier = 0;
                      let dices = [bloodBowlDices('1bd')];
                      let blockerDecides = true;

                      if (dauntlessCheck.length > 0 && targetSt > blockerSt) {
                        const dauntlessDice = callDice(6);
                        console.log('dauntless');
                        if (dauntlessDice > (targetSt - blockerSt)) {
                          blockerSt = targetSt
                          addToLog(`dauntless evens up with roll: ${dauntlessDice}`);
                        } else {
                          console.log('dauntless didnt help, rolled: ', dauntlessDice);
                          addToLog(`dauntless did not help: ${dauntlessDice}`);
                        }
                      }

                      // check helpers
                      const blockersFriends = itemm.markedBy(currentRoster);
                      const targetsFriends = item.markedBy(opponentRoster);
                      blockersFriends.forEach((itemBf) => {
                        const markingThis = itemBf.markedBy(opponentRoster);
                        if (markingThis.length === 0) {
                          blockerModifier++;
                        }
                      });
                      targetsFriends.forEach((itemBf) => {
                        const markingThis = itemBf.markedBy(currentRoster);
                        if (markingThis.length === 0) {
                          targetModifier++;
                        }
                      });
                      // block dices
                      if ( (blockerSt + blockerModifier) < (targetSt + targetModifier) ) {
                        blockerDecides = false;
                      }
                      // second dice
                      if ( (blockerSt + blockerModifier) !== (targetSt + targetModifier) ) {
                        dices.push(bloodBowlDices('1bd'));
                      }
                      // third dice
                      if ( ((blockerSt + blockerModifier) * 2) < (targetSt + targetModifier) ||
                           (blockerSt + blockerModifier) > ((targetSt + targetModifier) * 2)) {
                        dices.push(bloodBowlDices('1bd'));
                      }
                      console.log('blocker decides, dices: ', blockerDecides, dices);
                      gO.phase = 'blockQuery';
                      const blocker = JSON.parse(JSON.stringify(item));
                      const target = JSON.parse(JSON.stringify(itemm));
                      const blockData = {
                        blocker: blocker,
                        target: target,
                        blockerDecides: blockerDecides
                      };
                      const envelope = JSON.stringify(blockData);
                      dices.forEach((itemD) => {
                        const dice = <button key = {callDice(9999)} id = {itemD} value= {envelope} onClick= {block}>{itemD}</button>
                        actionButtons.push(dice);
                      });
                      if (blockerDecides) {
                        setMsg('active team, choose the dice!');
                      } else {
                        setMsg('non active team, choose the dice!');
                      }
                      setActionButtons(actionButtons);
                    } // target clicked ends
                  }
                });
              }
            }
        });
      }

      // pusher ....
      else if (item.status === 'pushing') {
        console.log('pushing');
        item.move(mousePosition.x, mousePosition.y);
        item.setStatus('activated');
      //  setAction('nothing');
      }

      // rush query
      else if (item.status === 'rush') {
        const rushDice = callDice(6);
        const sureFeetDice = callDice(6);
        const checkIfMarked = item.markedBy(opponentRoster);
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);
        //console.log('marked: ', checkIfMarked);

        addToLog(`${item.number} is rushing... dice: ${rushDice}`);
        if (moveChecking.length === 1) {
          item.move(mousePosition.x, mousePosition.y);
          //addToLog(`${item.number} moves. Movement left: ${moving}`);
          item.rushes--;
        }

        if (checkIfMarked.length > 0) {
          // moving from marked place
          const newMarkCheck = item.markedBy(opponentRoster);
          let modifier = 0;
          if (newMarkCheck.length > 0) {
            modifier = -1;
          }
          addToLog('... he is marked');

          if (stunty.length > 0) {
            modifier = 0;
          }

          const agiCheck = callDice(6);
          const dexCheck = item.skillTest('ag', agiCheck, modifier);
          addToLog(`dex check and mod: ${agiCheck} ${modifier}`);

          if (dexCheck) {
            item.move(mousePosition.x, mousePosition.y);
            addToLog(`agility check passed. roll: ${agiCheck}, modifier: ${modifier}`);
          } else {
            // save old data if user selects reroll
            /*
            item.preReroll = {
              gameObject: gO,
              reasonWas: 'dodge',
              skillWas: 'ag',
              modifierWas: modifier,
              oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}
            }*/
            // turn over!
            addToLog(`falls! agility check ${agiCheck} modifier: ${modifier}`);
            item.withBall = false;
            // armour check
            const armourRoll = callDice(12);
            const armourCheck = item.skillTest('av', armourRoll, 0);
            console.log('armour test: ', armourCheck, armourRoll);
            if (armourCheck) {
              const getInjuryMessage = armourBroken(stunty, thickSkull);
              item.setStatus(getInjuryMessage.msg);
              addToLog(`player is: ${getInjuryMessage.msg}`);
              addToLog(`armour roll was: ${armourRoll}`);
              addToLog(`injury roll was: ${getInjuryMessage.roll}`);
            } else {
              item.setStatus('fallen');
              addToLog(`armour holds with roll: ${armourRoll}`);
            }
            /*
            console.log('setting old data: ', preReroll);
            gO.phase = 'turnOver';
            setOldData(preReroll);
            setRoster1(copyOfRoster1);
            setRoster2(copyOfRoster2);
            setGameObject(gO);*/
          }
        }  // if marked ends
        if (item.rushes > 0) {
          item.setStatus('moved');
        } else {
          item.setStatus('activated');
        }

        if (rushDice === 1) {
          if (sureFeetCheck.length === 1 && sureFeetDice > 1) {
            addToLog('sure feet saved');
          } else {/*
            console.log('saving for possible reroll');
            item.preReroll = {
              gameObject: gO,
              reasonWas: 'rush',
              oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
            }
            item.withBall = false;
            // falls
            // turn over!
            addToLog(`falls! rush check was 1`);
            // armour check
            const armourRoll = callDice(12);
            const armourCheck = item.skillTest('av', armourRoll, 0);
            addToLog(`armour roll was: ${armourRoll}`);
            if (armourCheck) {
              const getInjuryMessage = armourBroken(stunty, thickSkull);
              item.setStatus(getInjuryMessage.msg);
              addToLog(`injuryroll: ${getInjuryMessage.roll}`);
              addToLog(`player is: ${getInjuryMessage.msg}`);
              addToLog(`injury roll was: ${getInjuryMessage.roll}`);
            } else {
              item.setStatus('fallen');
              addToLog(`armour holds with roll: ${armourRoll}`);
            }
            // save old data if user selects reroll
            gO.phase = 'turnOver';
            console.log('calling turnover phase from gamePlay, rush ');
            turnOverPhase(gO, item, true);
          }
        } // rush dice 1 ends
        // (gO, activeTeamIndex, copyOfRoster1, copyOfRoster2)
        if (gO.phase === 'turnOver') {
          //console.log('phase is turn over');
          // (gO, activeTeamIndex, copyOfRoster1, copyOfRoster2)
          console.log('calling turnOverPhase from gamePlay (rush)');
          turnOverPhase(gO, item, true);
        }
      }

      else if (item.status === 'foul') {
        const checkIfMarked = item.markedBy(opponentRoster);
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);

        //console.log('marked: ', checkIfMarked);
        gO[activeTeamIndex].blitz = false;
        addToLog(`${item.number} is fouling...`);
        // move
        if (moveChecking.length === 1) {
          console.log('foul: move check is 1: ', moveChecking);
          if (moveChecking.length === 1 && item.movementLeft > 0) {
            item.move(mousePosition.x, mousePosition.y);
            //addToLog(`${item.number} moves. Movement left: ${moving}`);
          }

          if (item.movementLeft < 1) {
            if (item.rushes > 0) {
              item.setStatus('moved');
              // remove all others moved to activated
              currentRoster.forEach((item2, i2) => {
                if (i !== i2 && item2.status === 'moved') {
                  item2.setStatus('activated');
                }
              });
            } else {
              item.setStatus('activated');
            }
          }

          if (checkIfMarked.length > 0) {
            // moving from marked place
            const newMarkCheck = item.markedBy(opponentRoster);
            let modifier = 0;
            console.log('new mark check: ', newMarkCheck);
            if (newMarkCheck.length > 0) {
              modifier = -1;
            }
            addToLog('... he is marked');

            if (stunty.length > 0) {
              modifier = 0;
            }

            const agiCheck = callDice(6);
            const dexCheck = item.skillTest('ag', agiCheck, modifier);
            addToLog(`dex check and mod: ${agiCheck} ${modifier}`);

            if (dexCheck) {
              item.move(mousePosition.x, mousePosition.y);
              addToLog(`agility check passed. roll: ${agiCheck}, modifier: ${modifier}`);
            } else {
              // turn over!
              // save old data if user selects reroll
              /*
              item.preReroll = {
                gameObject: gO,
                reasonWas: 'dodge',
                skillWas: 'ag',
                modifierWas: modifier,
                oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
              }
              addToLog(`falls! agility check ${agiCheck} modifier: ${modifier}`);
              item.withBall = false;
              // armour check
              const armourRoll = callDice(12);
              const armourCheck = item.skillTest('av', armourRoll, 0);
              console.log('armour test: ', armourCheck, armourRoll);
              if (armourCheck) {
                const getInjuryMessage = armourBroken(stunty, thickSkull);
                item.setStatus(getInjuryMessage.msg);
                addToLog(`player is: ${getInjuryMessage.msg}`);
                addToLog(`roll was: ${armourRoll}`);
                addToLog(`injury roll was: ${getInjuryMessage.roll}`);
              } else {
                item.setStatus('fallen');
                addToLog(`armour holds with roll: ${armourRoll}`);
              }
  //            preReroll.who = item;
    //          setOldData(preReroll);
              gO.phase = 'turnOver';
            }
          }  // if marked when start to move ends
          //console.log('phase is: ', gO.phase);
          if (gO.phase === 'turnOver') {
            //console.log('phase is turn over');
            // (gO, activeTeamIndex, copyOfRoster1, copyOfRoster2)
            console.log('calling turnOverPhase from gamePlay (foul)');
            turnOverPhase(gO, item, false);
          }
          // try to pick up the ball if at same place
          const ifAtBall = checkIfBallLocation(item.getLocation(), gO.ball);
          if (ifAtBall) {
            const tryingToPick = pickUpAction(item, opponentRoster);
            if (tryingToPick) {
              addToLog('he/she gets the ball');
              item.withBall = true;
            } else {
              // turn over if does not choose to reroll
              // save old data if user selects reroll
              // make modifier
              const markers = item.markedBy(opponentRoster);
              let modifier = 0;
              if (markers.length > 0) {modifier = -Math.abs(markers.length)}/*
              item.preReroll = {
                gameObject: gO,
                reasonWas: 'pickUp',
                skillWas: 'ag',
                modifierWas: modifier,
                oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
              }
              gO.ball = (bounce(callDice(8), gO.ball));
              gO.phase = 'turnOver';
              // at the moment cant be rerolled as not coded and tested
              turnOverPhase(gO, item, true);
            }
          }
        } // blitzh move ends
        // foul i think....
        else {
          console.log('foul: move check is not 1: ', moveChecking);
          const actionButtons = [];
          // set status to block
          item.setStatus('fouling');
          // remove older possible block statuses from friends
          currentRoster.forEach((itemB, ib) => {
            if (itemB.status === 'block' && ib !== i) {
              item.setStatus('activated');
            }
          });
          // also for move and blitz
          currentRoster.forEach((itemB, ib) => {
            if ((itemB.status === 'move' || item.status === 'blitz' || item.status === 'foul') && ib !== i) {
              item.setStatus('activated');
            }
          });
          // CONTINUE FROM HERE IN FOUL ACTION!
          opponentRoster.forEach((itemx, ix) => {
            // check from here if it was clicked
              const collision = arcVsArc(mousePosition, itemx, 10, 15);

              if (collision) {
                const markers = item.markedBy(opponentRoster);
                console.log('block targets: ', markers);

                if (markers.length > 0) {
                  markers.forEach((itemm, im) => {
                    if (itemm.number === itemx.number && itemm.name === itemx.name) {
                      itemm.setStatus('target');
                      targetClicked = true;

                      if (targetClicked) {
                        // get strengths
                        let blockerSt = item.st;
                        let targetSt = itemm.st;
                        let blockerModifier = 0;
                        let targetModifier = 0;
                        let dices = [bloodBowlDices('1bd')];
                        let blockerDecides = true;

                        if (dauntlessCheck.length > 0 && targetSt > blockerSt) {
                          const dauntlessDice = callDice(6);
                          console.log('dauntless');
                          if (dauntlessDice > (targetSt - blockerSt)) {
                            blockerSt = targetSt
                            addToLog(`dauntless evens up with roll: ${dauntlessDice}`);
                          } else {
                            addToLog(`dauntless did not help: ${dauntlessDice}`);
                          }
                        }

                        // check helpers
                        const blockersFriends = itemm.markedBy(currentRoster);
                        const targetsFriends = item.markedBy(opponentRoster);
                        blockersFriends.forEach((itemBf) => {
                          const markingThis = itemBf.markedBy(opponentRoster);
                          if (markingThis.length === 0) {
                            blockerModifier++;
                          }
                        });
                        targetsFriends.forEach((itemBf) => {
                          const markingThis = itemBf.markedBy(currentRoster);
                          if (markingThis.length === 0) {
                            targetModifier++;
                          }
                        });
                        // block dices
                        if ( (blockerSt + blockerModifier) < (targetSt + targetModifier) ) {
                          blockerDecides = false;
                        }
                        // second dice
                        if ( (blockerSt + blockerModifier) !== (targetSt + targetModifier) ) {
                          dices.push(bloodBowlDices('1bd'));
                        }
                        // third dice
                        if ( ((blockerSt + blockerModifier) * 2) < (targetSt + targetModifier) ||
                             (blockerSt + blockerModifier) > ((targetSt + targetModifier) * 2)) {
                          dices.push(bloodBowlDices('1bd'));
                        }
                        console.log('blocker decides, dices: ', blockerDecides, dices);
                        gO.phase = 'blockQuery';
                        const blocker = JSON.parse(JSON.stringify(item));
                        const target = JSON.parse(JSON.stringify(itemm));
                        const blockData = {
                          blocker: blocker,
                          target: target,
                          blockerDecides: blockerDecides
                        };
                        const envelope = JSON.stringify(blockData);
                        dices.forEach((itemD) => {
                          const dice = <button key = {callDice(9999)} id = {itemD} value= {envelope} onClick= {block}>{itemD}</button>
                          actionButtons.push(dice);
                        });
                        if (blockerDecides) {
                          setMsg('active team, choose the dice!');
                        } else {
                          setMsg('non active team, choose the dice!');
                        }
                        setActionButtons(actionButtons);
                        // need to check that target and block are cleared too and complete this..
                      } // target clicked ends
                    }
                  });
                }
              }
          });
        } // blitz block ends
      }

      // blitz
      else if (item.status === 'blitz') {
        const checkIfMarked = item.markedBy(opponentRoster);
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);

        //console.log('marked: ', checkIfMarked);
        gO[activeTeamIndex].blitz = false;
        //addToLog(`${item.number} is blitzing...`);
        // move
        if (moveChecking.length === 1) {
          console.log('blitz: move check is 1: ', moveChecking);
          if (moveChecking.length === 1 && item.movementLeft > 0) {
            item.move(mousePosition.x, mousePosition.y);
            //addToLog(`${item.number} moves. Movement left: ${moving}`);
          }

          if (item.movementLeft < 1) {
            if (item.rushes > 0) {
              item.setStatus('moved');
              // remove all others moved to activated
              currentRoster.forEach((item2, i2) => {
                if (i !== i2 && item2.status === 'moved') {
                  item2.setStatus('activated');
                }
              });
            } else {
              item.setStatus('activated');
            }
          }

          if (checkIfMarked.length > 0) {
            // moving from marked place
            const newMarkCheck = item.markedBy(opponentRoster);
            let modifier = 0;

            if (newMarkCheck.length > 0) {
              modifier = -1;
            }
            addToLog('... he is marked');

            if (stunty.length > 0) {
              modifier = 0;
            }

            const agiCheck = callDice(6);
            const dexCheck = item.skillTest('ag', agiCheck, modifier);
            addToLog(`dex check and mod: ${agiCheck} ${modifier}`);

            if (dexCheck) {
              item.move(mousePosition.x, mousePosition.y);
              addToLog(`agility check passed. roll: ${agiCheck}, modifier: ${modifier}`);
            } else {
              // turn over!
              // save old data if user selects reroll
              /*
              item.preReroll = {
                gameObject: gO,
                reasonWas: 'dodge',
                skillWas: 'ag',
                modifierWas: modifier,
                oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
              }
              addToLog(`falls! agility check ${agiCheck} modifier: ${modifier}`);
              item.withBall = false;
              // armour check
              const armourRoll = callDice(12);
              const armourCheck = item.skillTest('av', armourRoll, 0);

              addToLog(`armour roll was: ${armourRoll}`);
              if (armourCheck) {
                const getInjuryMessage = armourBroken(stunty, thickSkull);
                item.setStatus(getInjuryMessage.msg);
                addToLog(`injuryroll: ${getInjuryMessage.roll}`);
                addToLog(`player is: ${getInjuryMessage.msg}`);
              } else {
                item.setStatus('fallen');
                addToLog(`armour holds with roll: ${armourRoll}`);
              }
  //            preReroll.who = item;
    //          setOldData(preReroll);
              gO.phase = 'turnOver';
            }
          }  // if marked when start to move ends
          //console.log('phase is: ', gO.phase);
          if (gO.phase === 'turnOver') {
            //console.log('phase is turn over');
            // (gO, activeTeamIndex, copyOfRoster1, copyOfRoster2)
            console.log('calling turnOverPhase from gamePlay (movement)');
            turnOverPhase(gO, item, false);
          }
          // try to pick up the ball if at same place
          const ifAtBall = checkIfBallLocation(item.getLocation(), gO.ball);
          if (ifAtBall) {
            const tryingToPick = pickUpAction(item, opponentRoster);
            if (tryingToPick) {
              addToLog('he got the ball');
              item.withBall = true;
            } else {
              // turn over if does not choose to reroll
              // save old data if user selects reroll
              // make modifier
              const markers = item.markedBy(opponentRoster);
              let modifier = 0;
              if (markers.length > 0) {modifier = -Math.abs(markers.length)}/*
              item.preReroll = {
                gameObject: gO,
                reasonWas: 'pickUp',
                skillWas: 'ag',
                modifierWas: modifier,
                oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
              }
              gO.ball(bounce(callDice(8), gO.ball));
              gO.phase = 'turnOver';
              // at the moment cant be rerolled as not coded and tested
              turnOverPhase(gO, item, true);
            }
          }
        } // blitzh move ends
        // block
        else {
          const actionButtons = [];
          // set status to block
          item.setStatus('block');
          // remove older possible block statuses from friends
          currentRoster.forEach((itemB, ib) => {
            if (itemB.status === 'block' && ib !== i) {
              item.setStatus('activated');
            }
          });
          // also for move and blitz
          currentRoster.forEach((itemB, ib) => {
            if ((itemB.status === 'move' || item.status === 'blitz') && ib !== i) {
              item.setStatus('activated');
            }
          });

          opponentRoster.forEach((itemx, ix) => {
            // check from here if it was clicked
              const collision = arcVsArc(mousePosition, itemx, 10, 15);

              if (collision) {
                const markers = item.markedBy(opponentRoster);
                console.log('block targets: ', markers);

                if (markers.length > 0) {
                  markers.forEach((itemm, im) => {
                    if (itemm.number === itemx.number && itemm.name === itemx.name) {
                      itemm.setStatus('target');
                      targetClicked = true;

                      if (targetClicked) {
                        // get strengths
                        let blockerSt = item.st;
                        let targetSt = itemm.st;
                        let blockerModifier = 0;
                        let targetModifier = 0;
                        let dices = [bloodBowlDices('1bd')];
                        let blockerDecides = true;

                        if (dauntlessCheck.length > 0 && targetSt > blockerSt) {
                          const dauntlessDice = callDice(6);
                          console.log('dauntless');
                          if (dauntlessDice > (targetSt - blockerSt)) {
                            blockerSt = targetSt
                            addToLog('dauntless evens up');
                          } else {
                            addToLog('dauntless didnt help, rolled: ', dauntlessDice);
                          }
                        }

                        // check helpers
                        const blockersFriends = itemm.markedBy(currentRoster);
                        const targetsFriends = item.markedBy(opponentRoster);
                        blockersFriends.forEach((itemBf) => {
                          const markingThis = itemBf.markedBy(opponentRoster);
                          if (markingThis.length === 0) {
                            blockerModifier++;
                          }
                        });
                        targetsFriends.forEach((itemBf) => {
                          const markingThis = itemBf.markedBy(currentRoster);
                          if (markingThis.length === 0) {
                            targetModifier++;
                          }
                        });
                        // block dices
                        if ( (blockerSt + blockerModifier) < (targetSt + targetModifier) ) {
                          blockerDecides = false;
                        }
                        // second dice
                        if ( (blockerSt + blockerModifier) !== (targetSt + targetModifier) ) {
                          dices.push(bloodBowlDices('1bd'));
                        }
                        // third dice
                        if ( ((blockerSt + blockerModifier) * 2) < (targetSt + targetModifier) ||
                             (blockerSt + blockerModifier) > ((targetSt + targetModifier) * 2)) {
                          dices.push(bloodBowlDices('1bd'));
                        }
                        //console.log('blocker decides, dices: ', blockerDecides, dices);
                        gO.phase = 'blockQuery';
                        const blocker = JSON.parse(JSON.stringify(item));
                        const target = JSON.parse(JSON.stringify(itemm));
                        const blockData = {
                          blocker: blocker,
                          target: target,
                          blockerDecides: blockerDecides
                        };
                        const envelope = JSON.stringify(blockData);
                        dices.forEach((itemD) => {
                          const dice = <button key = {callDice(9999)} id = {itemD} value= {envelope} onClick= {block}>{itemD}</button>
                          actionButtons.push(dice);
                        });
                        if (blockerDecides) {
                          setMsg('active team, choose the dice!');
                        } else {
                          setMsg('non active team, choose the dice!');
                        }
                        setActionButtons(actionButtons);
                        // need to check that target and block are cleared too and complete this..
                      } // target clicked ends
                    }
                  });
                }
              }
          });
        } // blitz block ends

      }
      // move
      else if (item.status === 'move' && gO.phase !== 'turnOver') {
        const checkIfMarked = item.markedBy(opponentRoster);
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);

        //console.log('marked: ', checkIfMarked);
        if (moveChecking.length === 1 && item.movementLeft > 0) {
          item.move(mousePosition.x, mousePosition.y);
          //addToLog(`${item.number} moves. Movement left: ${moving}`);
        }

        if (item.movementLeft < 1) {
          if (item.rushes > 0) {
            item.setStatus('moved');
            // remove all others moved to activated
            currentRoster.forEach((item2, i2) => {
              if (i !== i2 && item2.status === 'moved') {
                item2.setStatus('activated');
              }
            });
          } else {
            item.setStatus('activated');
          }
        }

        if (checkIfMarked.length > 0) {
          // moving from marked place
          const newMarkCheck = item.markedBy(opponentRoster);
          let modifier = 0;
          console.log('new mark check: ', newMarkCheck);
          if (newMarkCheck.length > 0) {
            modifier = -1;
          }
          addToLog('... he is marked');

          if (stunty.length > 0) {
            modifier = 0;
          }

          const agiCheck = callDice(6);
          const dexCheck = item.skillTest('ag', agiCheck, modifier);
          addToLog(`dex check and mod: ${agiCheck} ${modifier}`);

          if (dexCheck) {
            item.move(mousePosition.x, mousePosition.y);
            addToLog(`agility check passed. roll: ${agiCheck}, modifier: ${modifier}`);
          } else {
            // turn over!
            // save old data if user selects reroll
            /*
            item.preReroll = {
              gameObject: gO,
              reasonWas: 'dodge',
              skillWas: 'ag',
              modifierWas: modifier,
              oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
            }
            addToLog(`falls! agility check ${agiCheck} modifier: ${modifier}`);
            item.withBall = false;
            // armour check
            const armourRoll = callDice(12);
            const armourCheck = item.skillTest('av', armourRoll, 0);
            console.log('armour test: ', armourCheck, armourRoll);
            if (armourCheck) {
              const getInjuryMessage = armourBroken(stunty, thickSkull);
              item.setStatus(getInjuryMessage.msg);
              addToLog(`injuryroll: ${getInjuryMessage.roll}`);
              addToLog(`player is: ${getInjuryMessage.msg}`);
              addToLog(`roll was: ${armourRoll}`);
            } else {
              item.setStatus('fallen');
              addToLog(`armour holds with roll: ${armourRoll}`);
            }
//            preReroll.who = item;
  //          setOldData(preReroll);
            gO.phase = 'turnOver';
          }
        }  // if marked when start to move ends
        //console.log('phase is: ', gO.phase);
        if (gO.phase === 'turnOver') {
          //console.log('phase is turn over');
          // (gO, activeTeamIndex, copyOfRoster1, copyOfRoster2)
          console.log('calling turnOverPhase from gamePlay (movement)');
          turnOverPhase(gO, item, false);
        }
        // try to pick up the ball if at same place
        const ifAtBall = checkIfBallLocation(item.getLocation(), gO.ball);
        console.log('at ball: ', ifAtBall);
        if (ifAtBall) {
          const tryingToPick = pickUpAction(item, opponentRoster);
          if (tryingToPick) {
            addToLog(item.number, ' got the ball');
            item.withBall = true;
          } else {
            // turn over if does not choose to reroll
            // save old data if user selects reroll
            // make modifier
            const markers = item.markedBy(opponentRoster);
            let modifier = 0;
            if (markers.length > 0) {modifier = -Math.abs(markers.length)}/*
            item.preReroll = {
              gameObject: gO,
              reasonWas: 'pickUp',
              skillWas: 'ag',
              modifierWas: modifier,
              oldLoc: {x: JSON.parse(JSON.stringify(item.x)), y: JSON.parse(JSON.stringify(item.y))}*/
            }
            // ball bounces
            gO.ball = (bounce(callDice(8), gO.ball));
            gO.phase = 'turnOver';
            // disabled reroll posibility for now as not yet coded
            turnOverPhase(gO, item, true);
          }
        }
      } // move  ends

      // the rest
      else {
          // activate the selected player
          // check if this has Bone Head, Very Stupid or Animaly Savagery
          const boneHead = item.skills.filter( skill => skill === 'Bone Head');
          const reallyStupid = item.skills.filter( skill => skill === 'Really Stupid');
          const animalSavagery = item.skills.filter( skill => skill === 'Animal Savagery');
          const collision = arcVsArc(mousePosition, item, 10, 15);
          const bigGuyRolls = callDice(6);
          //console.log('item and mouse ', item.x, item.y, mousePosition.x, mousePosition.y);

          // for ready guys
          if (collision && (item.status === 'ready' || item.status === 'prone')) {
            const checkIfMarked = item.markedBy(opponentRoster);

            // if prone
            if (item.status === 'prone') {
              // modificated to 2 as the move is lost elsewhere too
              item.movementLeft = item.ma - 2;
              console.log('prone, movemenLeft now: ', item.movementLeft);
            }

            // remove old moves and actives
            currentRoster.forEach((item2, i2) => {
              if (item2.status === 'move') {
                item2.setStatus('activated');
              }
              if (item2.status === 'ACTIVE') {
                item2.setStatus('activated');
              }
            });
            console.log('setting ', item.number, ' to ACTIVE');
            item.setStatus('ACTIVE');
            item.setActivated();
            setMsg('choose action for this player.');
            if (boneHead.length > 0) {
              console.log('bone head detected');
              if (bigGuyRolls === 1) {
                item.setStatus('prone');
                addToLog('big guy roll 1');
              }
            }
            if (reallyStupid.length > 0) {
              console.log('really stupid detected');
              if (bigGuyRolls === 1) {
                item.setStatus('prone');
                addToLog('big guy roll 1');
              }
            }
            if (animalSavagery.length > 0) {
              console.log('animal savagery detected');
              if (bigGuyRolls === 1) {
                item.setStatus('prone');
                addToLog('big guy roll 1');
              }
            }
            // create buttons:
            newButtons.push(<button id= 'move' onClick= {actions} key = {callDice(9999)}>Move</button>);
            newButtons.push(<button id= 'activated' onClick= {actions} key = {callDice(9999)}>End activation</button>);
            if (gO[activeTeamIndex].blitz) {
              newButtons.push(<button id= 'blitz' onClick= {actions}  key = {callDice(9999)}>Blitz</button>);
            }
            if (checkIfMarked.length > 0) {
              newButtons.push(<button id= 'block' onClick= {actions}  key = {callDice(9999)}>Block</button>);
            }
            if (gO[activeTeamIndex].pass) {
              newButtons.push(<button id= 'pass' onClick= {actions}  key = {callDice(9999)}>Pass</button>);
            }
            if (gO[activeTeamIndex].handOff) {
              newButtons.push(<button id= 'handOff' onClick= {actions} key = {callDice(9999)}>HandOff</button>);
            }
            newButtons.push(<button id= 'endTurn2' onClick= {actions} key = {callDice(9999)}>End turn</button>);
            if (item.withBall) {
              console.log('is with ball!');
              newButtons.push(<button id= 'pass' onClick= {actions}  key = {callDice(9999)}>Pass</button>);
              newButtons.push(<button id= 'handOff' onClick= {actions}  key = {callDice(9999)}>Hand off</button>);
            }
            setActionButtons(newButtons);
          }

          // for moved
          if (collision && item.status === 'moved') {
            console.log('selected to ask if wants to rush #', item.number);
            item.setStatus('ACTIVE');
            item.setActivated();
            setMsg('choose action for this player.');

            // create buttons:
            newButtons.push(<button id= 'rush' onClick= {actions} key = {callDice(9999)}>Rush</button>);
            setActionButtons(newButtons);
          }
      }
    });  // forEach ends

    console.log('gamePlay ends, setting gameObject');
    setGameObject(gO);
  }

  const block = (event) => {
    const decision = event.target.id;
    const blockData = JSON.parse(event.target.value);
    const gO = {...gameObject};
    let currentRoster = gO.team1.roster;
    let opponentRoster = gO.team2.roster;
    let activeTeamIndex = 'team1';

    console.log('blocker decides: ', blockData.blockerDecides);
    if (gO.team2.active) {
      currentRoster = gO.team2.roster;
      opponentRoster = gO.team1.roster;
      activeTeamIndex = 'team2';
    }
    let searchBlocker = currentRoster.filter( player => player.number === blockData.blocker.number);
    let searchTarget = opponentRoster.filter( player => player.number === blockData.target.number);
    const foundBlocker = searchBlocker[0];
    const foundTarget = searchTarget[0];
    // blockers skills
    const blockerStunty = foundBlocker.skills.filter( skill => skill === 'Stunty');
    const blockerThickskull = foundBlocker.skills.filter( skill => skill === 'Thick Skull');
    const blockerMightyBlow1 = foundBlocker.skills.filter( skill => skill === 'Mighty Blow (1+)');
    const blockerClaws = foundBlocker.skills.filter( skill => skill === 'Claws');
    const blockerBlock = foundBlocker.skills.filter( skill => skill === 'Block');
    const blockerWrestle = foundBlocker.skills.filter( skill => skill === 'Wrestle');
    //const blockerTackle = foundBlocker.skills.filter( skill => skill === 'Tackle');
    // targets skills
    //const targetStunty = foundTarget.skills.filter( skill => skill === 'Stunty');
    //const targetThickskull = foundTarget.skills.filter( skill => skill === 'Thick Skull');
    const targetBlock = foundTarget.skills.filter( skill => skill === 'Block');
    const targetWrestle = foundTarget.skills.filter( skill => skill === 'Wrestle');
    const targetDodge = foundTarget.skills.filter( skill => skill === 'Dodge');
    const targetFend = foundTarget.skills.filter( skill => skill === 'Fend');
    const targetStandFirm = foundTarget.skills.filter( skill => skill === 'Stand Firm');
    const targetSideStep = foundTarget.skills.filter( skill => skill === 'Side Step');
    let stunty = false;
    let thickSkull = false;
    //let mightyBlow = false;
    //let claws = false;
    let turnOverComing = false;
/*
    foundBlocker.preReroll = {
      reasonWas: '',
      modifierWas: 0
    }
*/
    if (decision === '(player down)') {
      if (blockerStunty.length === 1) {
        stunty = true;
      }
      if (blockerThickskull.length === 1) {
        thickSkull = true;
      }
      addToLog(`is stunty? ${stunty}, has thick skull? ${thickSkull}`);
      // armour check
      const armourRoll = callDice(12);
      const armourCheck = foundBlocker.skillTest('av', armourRoll, 0);
      console.log('armour test: ', armourCheck, armourRoll);
      addToLog(`player down! armour armour roll: ${armourRoll}`);
      if (armourCheck) {
        const getInjuryMessage = armourBroken(stunty, thickSkull);
        foundBlocker.setStatus(getInjuryMessage.msg);
        addToLog(`player is: ${getInjuryMessage.msg}`);
        addToLog(`injury roll was: ${getInjuryMessage.roll}`);
      } else {
        foundBlocker.setStatus('fallen');
        addToLog(`armour holds with roll: ${armourRoll}`);
      }
      if (foundBlocker.withBall) {
        foundBlocker.withBall = false;
        gO.ball = bounce(callDice(8), gO.ball);
      }
      // player down and turn over
  //    foundBlocker.preReroll.reasonWas = 'block';
    //  foundBlocker.preReroll.modifierWas = 0;
      gO.phase = 'turnOver';
      console.log('calling turn over phase from failed block ');
      // when reroll for blocks is done, change true to false
      turnOverPhase(gO, foundBlocker, true);
    }
    else if (decision === '(both down)') {
      // depends if get block or wrestle
      if (blockerWrestle.length === 1) {
        addToLog(`blocker wrestles both to prone`);
        foundBlocker.setStatus('prone');
        foundTarget.setStatus('prone');
      }
      else {
        if (blockerBlock.length === 0) {
          // armour check
          const armourRoll = callDice(12);
          const armourCheck = foundBlocker.skillTest('av', armourRoll, 0);
          addToLog(`both down! blockers armour roll: ${armourRoll}`);
          if (armourCheck) {
            const getInjuryMessage = armourBroken(stunty, thickSkull);
            foundBlocker.setStatus(getInjuryMessage.msg);
            addToLog(`inj roll: ${getInjuryMessage.roll}`)
            addToLog(`blocker is: ${getInjuryMessage.msg}`);
            addToLog(`armour roll of blocker was: ${armourRoll}`);
          } else {
            foundBlocker.setStatus('fallen');
            addToLog(`blockers armour holds with roll: ${armourRoll}, he is fallen now`);
          }
          turnOverComing = true;
        } else {
          if (targetWrestle.length === 0) {
            addToLog('blocker has Block skill. Not knocked down');
          } else {
            addToLog('target wrestles both to prone');
            foundBlocker.setStatus('prone');
            foundTarget.setStatus('prone');
          }
        }
        if (targetBlock.length === 0 && targetWrestle.length === 0) {
          // armour check
          const armourRoll = callDice(12);
          const armourCheck = foundTarget.skillTest('av', armourRoll, 0);
          console.log('armour test: ', armourCheck, armourRoll);
          addToLog(`armour roll: ${armourRoll}`);
          if (armourCheck) {
            const getInjuryMessage = armourBroken(stunty, thickSkull);
            foundTarget.setStatus(getInjuryMessage.msg);
            addToLog(`inj roll: ${getInjuryMessage.roll}`)
            addToLog(`player is: ${getInjuryMessage.msg}`);
            addToLog(`roll was: ${armourRoll}`);
          } else {
            foundTarget.setStatus('fallen');
            addToLog(`targets armour holds with roll: ${armourRoll} he is fallen`);
          }
        } else {
          addToLog('target has Block skill. Not knocked down');
        }
      }
      if (foundBlocker.withBall) {
        foundBlocker.withBall = false;
        gO.ball = bounce(callDice(8), gO.ball);
      }
      if (foundTarget.withBall) {
        foundTarget.withBall = false;
        gO.ball = bounce(callDice(8), gO.ball);
      }
    }
    else if (decision === '(push back)') {
      addToLog(`it is a push!`);
      if (targetStandFirm.length === 0) {
        // push the target
        if (targetSideStep.length === 0) {
          setMsg('set place for pushed player')
          foundTarget.setStatus('pushed');
        } else {
          foundTarget.setStatus('sideStepping');
        }
        // where?
        if (targetFend.length === 0) {
          foundBlocker.setStatus('pushing');
        } else {
          foundBlocker.setStatus('activated');
          addToLog(`target is fending. can't follow`);
        }
      }
    }
    else if (decision === '(stumble)') {
      addToLog('stumble!');
      // push + kd or just push if has Dodge
      if (targetDodge.length === 0) {
        let modifier = 0;
        if (blockerMightyBlow1.length === 1) {
          modifier = 1;
        }
        // armour check
        const armourRoll = callDice(12);
        let armourCheck = foundTarget.skillTest('av', armourRoll, modifier);
        if (blockerClaws.length === 1 && armourRoll > 7) {
          console.log('claws effective');
          armourCheck = true;
        }
        console.log('armour test: ', armourCheck, armourRoll);
        addToLog(`armour test vs target: ${armourRoll} with modifier: ${modifier}`);
        if (armourCheck) {
          const getInjuryMessage = armourBroken(stunty, thickSkull);
          foundTarget.setStatus(getInjuryMessage.msg);
          addToLog(`player is: ${getInjuryMessage.msg}`);
          addToLog(`injury roll was: ${getInjuryMessage.roll}`);
          if (getInjuryMessage === 'stunned') {
            foundTarget.setStatus('pushedStunned');
            if (targetFend.length === 0) {
              foundBlocker.setStatus('pushing');
            } else {
              addToLog('fending, can not follow.');
            }
          }
        } else {
          if (targetFend.length === 0) {
            foundBlocker.setStatus('pushing');
          } else {
            addToLog('fending, can not follow');
          }
          foundTarget.setStatus('pushedFallen');
          addToLog(`targets armour holds with roll: ${armourRoll}`);
          // later gotta add so that can be pushed too if didnt ko or die
        }
        if (foundTarget.withBall) {
          foundTarget.withBall = false;
          gO.ball = bounce(callDice(8), gO.ball);
        }
      } else {
        setMsg('set place for pushed player')
        addToLog('target has dodge, so converted to push.');
        foundTarget.setStatus('pushed');
        if (targetFend.length === 0) {
          foundBlocker.setStatus('pushing');
        }
      }
    }
    else if (decision === '(pow!)') {
      addToLog(`pow! `);
      // push + kd
      let modifier = 0;
      if (blockerMightyBlow1.length === 1) {
        modifier = 1;
      }
      // armour check
      const armourRoll = callDice(12);
      let armourCheck = foundTarget.skillTest('av', armourRoll, modifier);
      if (blockerClaws.length === 1 && armourRoll > 7) {
        addToLog('claws effective');
        armourCheck = true;
      }
      addToLog(`armour roll vs target: ${armourRoll} with modifier: ${modifier}`);
      if (armourCheck) {
        const getInjuryMessage = armourBroken(stunty, thickSkull);
        addToLog(`player is: ${getInjuryMessage.msg}`);
        addToLog(`injury roll was: ${getInjuryMessage.roll}`);
        foundTarget.setStatus(getInjuryMessage.msg);
        if (getInjuryMessage === 'stunned') {
          foundTarget.setStatus('pushedStunned');
          if (targetFend.length === 0) {
            foundBlocker.setStatus('pushing');
          }
        }
        if (foundTarget.withBall) {
          foundTarget.withBall = false;
          gO.ball = bounce(callDice(8), gO.ball);
        }
      } else {
        addToLog(`armour holds with roll ${armourRoll}`);
        if (targetFend.length === 0) {
          foundBlocker.setStatus('pushing');
        }
        foundTarget.setStatus('pushedFallen');
        addToLog(`armour holds with roll: ${armourRoll}`);
        // later gotta add so that can be pushed too if didnt ko or die
      }
    }
    else { console.log('not found the block dice...');}
    // update rosters to roster1 and roster 2
    // update phase
    if (turnOverComing) {
      gO.phase = 'turnOver';
      turnOverPhase(gO, foundBlocker, true);
    } else {
      gO.phase = 'gameplay';
      setGameObject(gO);
    }
  }

  const turnOverPhase = (gO, item, noReroll) => {
  //  let activeTeamIndex = 'team1';

    if (gO.team2.active) {
    //  activeTeamIndex = 'team2';
    }

// lets forget re rolls in this moment, i code them later
/*
    if (gameObject[activeTeamIndex].rerolls > 0 && noReroll === false) {
      const makeName = JSON.stringify(item);
      console.log('rerolls left, who is: ', item);
      const activeButtons = <><button id= "rerollYes" name = {makeName} onClick = {rerolls}>Yes, re-roll</button><button id= "rerollNo" onClick = {rerolls}>no</button></>
      setActionButtons(activeButtons);
    } else { */
      // start turn over sequince
      console.log('turn over phase ');
      // if had the ball, bounce the ball
      const fallenGuysLocation = {x: item.gridX, y: item.gridY};
      const checkingIfAtBall = checkIfBallLocation(fallenGuysLocation, gO.ball);
      if (checkingIfAtBall) {
        gO.ball = (bounce(callDice(8), gO.ball));
      }
      setMsg('TURNOVER!');
      gO.phase = 'startTurn';
      switchActiveTeam(gO);
      console.log('calling startTurn from TurnOverPhase');
      startTurn(gO) ;
//    }
  }

  const actions = (event) => {
    const idOfAction = event.target.id;
    let gO = {...gameObject};
    let currentRoster = gO.team1.roster;

    if (gO.team2.active) {
      currentRoster = gO.team2.roster;
    }

    if (idOfAction === 'endTurn' || idOfAction === 'endTurn2') {
      // start turn over sequince
      setMsg('change of turn!');
      gO.phase = 'startTurn';
      gO = switchActiveTeam(gO);
      console.log('calling startTurn from TurnOverPhase');
      startTurn(gO) ;
    }
    else if (idOfAction === 'activated') {
      const playerWithAction = currentRoster.filter( player => player.status === 'move');
      if (playerWithAction.length > 0) {
        playerWithAction[0].setStatus(idOfAction);
      }
    }
    else {
      const playerWithAction = currentRoster.filter( player => player.status === 'ACTIVE');
      // might happen so that set is too slow and this is notnig...
      if (playerWithAction.length > 0) {
        playerWithAction[0].setStatus(idOfAction);
        // move
        if (idOfAction === 'move') {
          setMsg(`select next square to move for ${playerWithAction[0].number}. When ready, activate next player or terminate turn.`);
        }
        setGameObject(gO);
      }
    }
  }

  const clicked = () => {
    const gO = { ...gameObject};
    let currentRoster = gO.team1.roster;
    if (gO.team2.active) { currentRoster = gO.team2.roster }
    let activeButtons = '';

    if (action === 'moveBall') {
      const newPosition = {x: mousePosition.x, y: mousePosition.y};
      // set withBall to false from old carrier
      gO.team1.roster.forEach((item, i) => {
        if (item.withBall) { item.withBall = false; }
      });
      gO.team2.roster.forEach((item, i) => {
        if (item.withBall) { item.withBall = false; }
      });

      gO.ball = newPosition;
      setAction('nothing');
      setGameObject(gO);
    }

    if (action === 'setCarrier') {
      const convertedPosition = convertPosition(mousePosition, squareSize);
      // set withBall to new carrier if any
      gO.team1.roster.forEach((item, i) => {
        if (item.gridX === convertedPosition.x && item.gridY === convertedPosition.y) {
          console.log('setting ', item.number, ' to ball carrier');
          item.withBall = true;
        }
      });
      gO.team2.roster.forEach((item, i) => {
        if (item.gridX === convertedPosition.x && item.gridY === convertedPosition.y) {
          console.log('setting ', item.number, ' to ball carrier');
          item.withBall = true;
        }
      });
      setGameObject(gO);
      setAction('nothing');
    }

    // set defence and offence
    if (gameObject.phase === 'set defence' || gameObject.phase === 'set offence') {
      let actionDone = false;
      activeButtons = <><button id= "reserveThis" onClick = {statuses}>move selected to reserves</button><button id= "defenceReady" onClick = {statuses}>defence formation is ready</button></>;

      // check if someone is moving
      currentRoster.forEach((item, i) => {
        if (item.status === 'move' && !actionDone) {
          item.setStatus('activated');
          item.move(mousePosition.x, mousePosition.y);
          actionDone = true;
        }
      });
      if (!actionDone) {
        currentRoster.forEach((item, i) => {
          const collision = arcVsArc(mousePosition, item, 10, 15);
          //console.log('item and mouse ', item.x, item.y, mousePosition.x, mousePosition.y);
          if (collision) {
        //    item.setStatus('move');
          console.log('collising with: ', item);
          item.setStatus('move');
          }
        });
      }
      if (gameObject.phase === 'set offence') {
        activeButtons = <><button id= "reserveThis" onClick = {statuses}>move selected to reserves</button><button id= "offenceReady" onClick = {statuses}>offence formation is ready</button></>
      }
      setActionButtons(activeButtons);
      setGameObject(gO);
    }
    else if (gO.phase === 'gameplay') {
      gamePlay();
    }
  }

  const kickOff = (gO) => {
    console.log('kickOff called ');
    let currentRoster = [];
    let opponentRoster = [];
    const deviationRoll = callDice(8);
    const deviationDistance = callDice(5);
    const bounceRoll = callDice(8);
    let placeOfBall = deviate(deviationRoll, deviationDistance, {x: mousePosition.x, y: mousePosition.y});
    gO.ball = placeOfBall;
    addToLog(`deviation direction: ${deviationRoll}. deviation distance: ${deviationDistance}.`);
    if (gO.team1.active) {
      //console.log('active === team2');
      currentRoster = gO.team1.roster;
      gO.firstKicker = 'Team 1';
    } else {
      currentRoster = gO.team2.roster;
      gO.firstKicker = 'Team 2';
    }
    // check if someone is there to catch i
    let atLocation = [];
    currentRoster.forEach((item, i) => {
      const inLocation = item.isInLocation(placeOfBall, squareSize);
      if (inLocation) {atLocation.push(item)}
    });
    // if someone there, he tries to catch the ball
    if (atLocation.length === 1) {
      let catchSuccess = true;
      let negativeModifier = 0;
      const playerInAction = atLocation[0];

      gO.team1.active ?
      opponentRoster = gO.team2.roster :
      opponentRoster = gO.team1.roster;

      addToLog(`${playerInAction.number} tries to catch...`);
      // check tacklezones
      const tacklers = playerInAction.markedBy(opponentRoster);
      negativeModifier -= tacklers.length;
      const skillCheck = playerInAction.skillTest('ag', callDice(6), negativeModifier);
      if (skillCheck) {
        addToLog(`Catch ok!`);
        atLocation[0].withBall = true;
      } else {
        addToLog(`He fails to catch. Ball bounces to: ${bounceRoll}`);
        catchSuccess = false;
        // check if he has "Catch skill"
        const catchCheck = playerInAction.skills.filter( skill => skill === 'Catch');
        if (catchCheck.length === 1) {
          // rerolling for catch
          addToLog(`... but the player re-tries as he has Catch skill...`);
          const skillCheck2 = playerInAction.skillTest('ag', callDice(6), negativeModifier);
          if (skillCheck2) {
            addToLog(`Catch ok!`);
            catchSuccess = true;
          }
        }
      }
      if (!catchSuccess) {
        placeOfBall = bounce(bounceRoll, placeOfBall);
        gO.ball = placeOfBall;
      }
    } else {
      // nobody catching so bounces
//      placeOfBall = bounce(bounceRoll, placeOfBall);
      gO.ball = placeOfBall;
    }

    gO.phase = 'startTurn';
    currentRoster.forEach((item, i) => {
      item.setStatus('ready');
      item.refreshMovement();
    });
    opponentRoster.forEach((item, i) => {
      item.setStatus('ready');
      item.refreshMovement();
    });

  setMsg('kick off ready');
  gO = switchActiveTeam(gO);
  //setGameObject(gO); // remove this when startTurn(gO) is done
  console.log('calling startTurn from kickOff');
  startTurn(gO);
  }

  const startTurn = (gO) => {
    console.log('start turn called');
    let currentRoster = gO.team1.roster;
  //  let opponentRoster = gO.team2.roster;
    let activeTeamIndex = 'team1';

    // setup
    if (gO.team2.active) {
      addToLog('team 2 starts');
      //addToLog('active === team2');
      currentRoster = gO.team2.roster;
    //  opponentRoster = gO.team1.roster;
      activeTeamIndex = "team2";
    }

    gO[activeTeamIndex].turn++;
    addToLog(`${activeTeamIndex}, turn ${gO[activeTeamIndex].turn} starts`);
    // terminate half if 9th turn and first half
    if (gO.half === 1 && gO[activeTeamIndex].turn === 9) {
      gO.half = 2;
      gO.team1.turn = 0;
      gO.team2.turn = 0;
      gO.phase = 'set defence';
      console.log('first kicker was: ', gO.firstKicker);
      if (gO.firstKicker === 'Team 1') {
        gO.team2.active = true;
        gO.team1.active = false;
      } else {
        gO.team1.active = true;
        gO.team2.active = false;
      }
    }
    // terminate game if last turn passed
    if (gO.half === 2 && gO[activeTeamIndex].turn === 9) {
      console.log('game over!');
      setMsg('GAME OVER!');
      gO.phase = 'GAME OVER';
    }
    if (gO[activeTeamIndex].turn < 9) {
      gO.phase = 'gameplay';
      console.log('not yet 9th turn, setting to gameplay');
      gO.team1.blitz = true;
      gO.team1.foul = true;
      gO.team1.pass = true;
      gO.team1.handOff = true;
      gO.team2.blitz = true;
      gO.team2.foul = true;
      gO.team2.pass = true;
      gO.team2.handOff = true;
      // refresh players
      console.log('refreshing players');
      currentRoster.forEach((item, i) => {
        if (item.status === 'activated' || item.status === 'target' || item.status === 'moved' || item.status === 'move' || item.status === 'block' || item.status === 'blitz' || item.status === 'pass' || item.status === 'handOff') {
          //console.log(item.name, ' set to ready');
          item.setStatus('ready');
          item.refreshMovement();
        }
        if (item.status === 'fallen') {
          //console.log(item.name, ' set to prone');
          item.setStatus('prone');
        }
        if (item.status === 'stunned') {
          item.setStatus('fallen');
        }
      });
    }
    setGameObject(gO);
  //  console.log('calling gamePlay from startTurn');
  //  gamePlay();
  }

  const statuses = (e) => {
    const gO = {...gameObject};
    let activeIndex = 'team1';
    if (gO.team2.active) { activeIndex = 'team2' }
    let currentRoster = gO[activeIndex].roster;
    const selectedAction = e.target.id;

    // move ball
    if (selectedAction === 'gameplay') {
      gO.phase = 'gameplay';
      setGameObject(gO);
    }
    // move ball
    if (selectedAction === 'moveBall') {
      setAction('moveBall');
    }
    // set Carrier
    if (selectedAction === 'setCarrier') {
      setAction('setCarrier');
    }

    if (selectedAction === 'reserveThis') {
      currentRoster.forEach((item, i) => {
        if (item.status === 'move') {
          item.setStatus('reserve');
          item.move(1900, 1900);
        }
      });
      setGameObject(gO);
    }

    else if (selectedAction === 'defenceReady') {
      const checkUp = checkLineUp(currentRoster, false);

      if (checkUp) {
        setMsg('def formation ok, set now offense');
        gO.phase = 'set offence';
        if (activeIndex === 'team1') {
          gO.team1.active = false;
          gO.team2.active = true;
        } else {
          gO.team1.active = true;
          gO.team2.active = false;
        }
      } else {
        setMsg('illegal formation. check wide zones, total players and scrimmage');
      }
      setGameObject(gO);
    }

    else if (selectedAction === 'offenceReady') {
      const checkUp = checkLineUp(currentRoster, true);

      if (checkUp) {
        setMsg('off formation ok, Kick Off now. Select place for a ball');
        gO.phase = 'kick off';
        if (activeIndex === 'team1') {
          gO.team1.active = false;
          gO.team2.active = true;
        } else {
          gO.team1.active = true;
          gO.team2.active = false;
        }
        kickOff(gO);
      } else {
        setMsg('illegal formation. check wide zones, total players and scrimmage');
      }
    }
  }

  return(
    <div id= "container">
      <div id= "controls">
        <div id= "leftSide">
        mouse: {mousePosition.x} {mousePosition.y}<br/>
        <br/>
        <button onClick= {checki}>
          checki
        </button>
        <br/>
        <button id= "activateTeam1" onClick= {activateTeam}>
        team1
        </button>
        <button id= "activateTeam2" onClick= {activateTeam}>
        team2
        </button>
        <button id= "start" onClick= {startGame}>
          START GAME
        </button>
        <br/>
        </div>
        <div id= "rightSide">
        <button id= "d6" onClick= {diceThrow}>d6</button>
        <button id= "2d6" onClick= {diceThrow}>2d6</button>
        <button id= "1block" onClick= {diceThrow}>1 x block</button>
        <button id= "2block" onClick= {diceThrow}>2 x block</button>
        <button id= "3block" onClick= {diceThrow}>3 x block</button>
        <button id= "d3" onClick= {diceThrow}>d3</button>
        <button id= "d8" onClick= {diceThrow}>d8</button>
        <button id= "d16" onClick= {diceThrow}>d16</button>
        <button id= "moveBall" onClick= {statuses}>move ball</button>
        <button id= "gameplay" onClick= {statuses}>gameplay phase</button>
        <button id= "setCarrier" onClick= {statuses}>set carrier</button>
        <button id= 'endTurn' onClick= {actions} key = {callDice(9999)}>End turn</button>
        <button id= "statusChange" onClick = {statuses}>move selected to reserves</button>{/*
        <button id= "pushingThis" onClick = {statuses}>pushing</button>*/}
        <br/>
        <button id= "fallen" onClick= {forceStatusSwitch} className= "yellowButtons">fallen</button>
        <button id= "stunned" onClick= {forceStatusSwitch} className= "yellowButtons">stunned</button>
        <button id= "ko" onClick= {forceStatusSwitch} className= "yellowButtons">ko</button>
        <button id= "casualty" onClick= {forceStatusSwitch} className= "yellowButtons">casualty</button>
        <button id= "activated" onClick= {forceStatusSwitch} className= "yellowButtons">activated</button>
        <button id= "ready" onClick= {forceStatusSwitch} className= "yellowButtons">ready</button>
        <button id= "Off" onClick= {forceStatusSwitch} className= "yellowButtons">stop force setting</button>
          <br/>
          {dices}<br/>
          {actionButtons}
        </div>
        <div id= "infos">
          {gameObject.team1.team}. score: {gameObject.team1.score} turn: {gameObject.team1.turn} rerolls: {gameObject.team1.rerolls} value: {gameObject.team1.value}<br/>
          {gameObject.team2.team}. score: {gameObject.team2.score} turn: {gameObject.team2.turn} rerolls: {gameObject.team2.rerolls} value: {gameObject.team2.value}
          <br/>
            <div className= "consoles" id= "console">
              {msg}
            </div>

        </div>
      </div>
      <div id= "canvasPlace">
        <canvas
          onMouseMove= {hovering}
          onClick= {clicked}
          id= "bloodBowlStadium"
          width = {950}
          height = {1000}>
        </canvas>
      </div>
      <div id= "rules">
        {details}
        <div className= "consoles" id= "log">
          {log}
        </div>
      </div>
      <div id= "teams">
        select team:<br/>
        <ShowAllTeams
         showThese = {teams}
         addFunc = {addTeam}/>
      </div>
    </div>
    );
}

export default BloodBowl3;

/*
the arena should be
26width
15height
{}
*/
