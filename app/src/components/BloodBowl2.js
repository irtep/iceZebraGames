/*

Bugs:
-
-
-

The GameBrain
input that is gameObject
- some kind of machine learning web
export that is action

*/
import { drawBBfield, bloodBowlDices, makePlayer, checkLineUp, deviate, bounce, convertPosition, armourBroken }
from '../functions/bloodBowl';
import { arcVsArc, callDice } from '../functions/supportFuncs';
//import { setDefence/*, setOffence*/} from '../functions/ai/ai';
import { initialBloodBowlObject, /*rerollPrices*/ } from '../constants/constants';
//import { Player } from '../constants/classes';
import { useEffect, useState } from 'react';
import { getTeams, getAll } from '../services/dbControl';
import ShowAllTeams from './ShowAllTeams';
import '../styles/bloodBowl2.css';

const BloodBowl2 = ({game}) => {
  /*bb2 stuff*/
  // msg console
  const [msg, setMsg] = useState('select first teams');
  const [log, setLog] = useState('');
  const [actionButtons, setActionButtons] = useState('');
//  const [lastPlayer, setLastPlayer] = useState('');
//  const [lastAction, setLastAction] = useState('');
  const [oldData, setOldData] = useState('');
  //const [lastQuery, setLastQuery] = useState('');
//  const [lastResponse, setLastResponse] = useState('');
  const [firstKicker, setFirstKicker] = useState('');
  // log
  /*bb1 stuff:*/
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState ('Team 1');
  const [roster1, setRoster1] = useState ([]);
  const [roster2, setRoster2] = useState ([]);
  const [gameObject, setGameObject] = useState (initialBloodBowlObject);
  const [mousePosition, setMp] = useState('');
//  const [action, setAction] = useState('nothing');
  const [dices, setDices] = useState('');
  const [details, setDetails] = useState('');
  const [ball, setBall] = useState({x:10, y:10});
  const squareSize = 35;

  // when this app is loaded
  useEffect( () => {
    drawBBfield("bloodBowlStadium", 16, 27);
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

  const diceThrow = (e) => {
    setDices(bloodBowlDices(e.target.id));
  }

  const hovering = (e) => {
    // get mouse locations offsets to get where mouse is hovering.
    let r = document.getElementById('bloodBowlStadium').getBoundingClientRect();
    let x = e.clientX - r.left;
    let y = e.clientY - r.top;
    const hoverDetails = {x: x, y: y};
    const allPlayers = roster1.concat(roster2);
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
    });
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
    setMp(hoverDetails)
  }

  const activateTeam = (e) => {
    if (e.target.id === 'activateTeam1') {
      setActiveTeam('Team 1');
    } else {
      setActiveTeam('Team 2');
    }
  }

  const checkIfBallLocation = (loc) => {
    const gridLocOfBall = {x: Math.trunc( ball.x / 35 ), y: Math.trunc( ball.y / 35 )};
    if (gridLocOfBall === loc) {
      return true;
    } else {
      console.log("ball not here: ", loc, " vs ", gridLocOfBall);
      return false;
    }
  }

  // check states
  const checki = () => {
    console.log('roster 1', roster1);
    console.log('roster 2', roster2);
    console.log('gameObject ', gameObject);
    console.log('mouse: ', mousePosition);
    console.log('ball: ', ball);
    console.log('oldData ', oldData);
  //  console.log('action: ', action);
  }

  const pickUpAction = (who, opponentRoster) => {
    console.log("pick up action, by ", who.number);
    // console.log("opponents: ", opponentRoster);
    const sureHands = who.skills.filter( skill => skill === 'Sure Hands');
    const noHands = who.skills.filter( skill => skill === 'No Hands');
    const diceValue1 = callDice(6);
    const diceValue2 = callDice(6);
    const markers = who.markedBy(opponentRoster);
    let modifier = 0;
    if (markers.length > 0) {modifier = -Math.abs(markers.length)}
    const picking1 = who.skillTest('ag', diceValue1, modifier);

    if (noHands.length > 0) {
      return false;
    }
    if (picking1) {
      console.log('he has the ball');
      return true;
    } else {
      // with sure hands auto reroll
      if (sureHands.length > 0) {
        const picking2 = who.skillTest('ag', diceValue2, modifier);
        if (picking2) {
          console.log('after sure hands, ok');
          return true;
        }
      }
      return false;
    }
  }

  // after choosing yes or no from reroll query button
  const rerolls = (event) => {
    const yesOrNo = event.target.id;
    let logging = [];
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
//    const copyOfOldData = JSON.parse(JSON.stringify(oldData));
    let currentRoster = roster1.concat([]);
    let opponentRoster = roster2.concat([]);
    let activeTeamIndex = 'team1';
    let team2active = false;
    console.log('rerolls called: ', oldData);
//    console.log('copy of old data: ', copyOfOldData);

    if (activeTeam === 'Team 2') {
      activeTeamIndex = 'team2';
      currentRoster = roster2.concat([]);
      opponentRoster = roster1.concat([]);
      team2active = true;
    }

    if (yesOrNo === 'rerollYes') {
      const name = JSON.parse(event.target.name);
      const findThePlayer = currentRoster.filter( player => player.number === name.number);
      const foundPlayer = findThePlayer[0];
  //    console.log('name: ', name);
      const rerollDice = callDice(6);
  //    console.log('rerollDice: ', rerollDice);



    //  logging.push('Team reroll burned, reason: ');
    //  console.log('oldData.reasonWas ', oldData.reasonWas);
      copyOfgameObject[activeTeamIndex].rerolls--;

    //  console.log('found player: ', foundPlayer);
    //  console.log('name: ', name);
      if (name.preReroll.reasonWas === 'dodge') {
        //const newMarkCheck = foundPlayer.markedBy(opponentRoster);
        let modifier = name.preReroll.modifierWas;
        /*
        if (newMarkCheck.length > 0) {
          modifier = -1;
        }
        */
        const rerollTest = foundPlayer.skillTest('ag', rerollDice, modifier);
        console.log('rerollTest: ', rerollTest);
        if (rerollTest) {
          logging.push('reroll helped.');
          // this might be wrong location
          foundPlayer.move(name.x, name.y);
          const atBall = checkIfBallLocation(foundPlayer.getLocation());
          if (atBall) {
            logging.push("he tries to get the ball");
            const pickUpAttempt = pickUpAction(foundPlayer, opponentRoster);
            if (pickUpAttempt) {
              foundPlayer.withBall = true;
            } else {
              setBall(bounce(callDice(8), ball));
            }
            logging.push();
          }
          if (foundPlayer.movementLeft < 1) {
      //      console.log('setting to moved');
            foundPlayer.setStatus('moved');
          } else {
      //      console.log('settingto move');
            foundPlayer.setStatus('move');
          }
          if (team2active) {
      //      console.log('setting2: ', currentRoster);
            setRoster2(currentRoster);
          } else {
      //      console.log('setting1: ', currentRoster);
            setRoster1(currentRoster);
          }
          copyOfgameObject.phase = 'gameplay';
          setGameObject(copyOfgameObject);
        } else {
          logging.push('reroll failed too');
          setMsg('TURNOVER!');
          copyOfgameObject.phase = 'startTurn';
          if (activeTeam === 'Team 1') {
            setActiveTeam('Team 2');
          } else {
            setActiveTeam('Team 1');
          }
          setGameObject(copyOfgameObject);
          // should maybe call
          console.log('calling startTurn from rerolls');
          startTurn(roster1, roster2, copyOfgameObject);
        }
      }
      if (name.preReroll.reasonWas === 'rush') {
      //  console.log('reason was rush failure');
        const newRushRoll = callDice(6);
        if (newRushRoll === 1) {
          logging.push('reroll failed too');
          setMsg('TURNOVER!');
          copyOfgameObject.phase = 'startTurn';
          if (activeTeam === 'Team 1') {
            setActiveTeam('Team 2');
          } else {
            setActiveTeam('Team 1');
          }
          setGameObject(copyOfgameObject);
          // should maybe call
          console.log('calling startTurn from rerolls');
          startTurn(roster1, roster2, copyOfgameObject);
        } else {
          logging.push('reroll helped!');
          foundPlayer.move(name.x, name.y);
          if (foundPlayer.rushes < 1) {
            foundPlayer.setStatus('activated');
          } else {
            foundPlayer.setStatus('moved');
          }
          if (activeTeam === 'Team 1') {
            setActiveTeam('Team 2');
          } else {
            setActiveTeam('Team 1');
          }
          copyOfgameObject.phase = 'gameplay';
          setGameObject(copyOfgameObject);
        }
    //    console.log('rush');
      }
      // should then get oldData and set it as gameObject and rosters
      //const findFallenGuy = oldData.map( )
      //setLastResponse(true);
    } else {
//      console.log('no');
//      console.log('turn over phase ');
      setMsg('TURNOVER!');
      copyOfgameObject.phase = 'startTurn';
      if (activeTeam === 'Team 1') {
        setActiveTeam('Team 2');
      } else {
        setActiveTeam('Team 1');
      }
      setGameObject(copyOfgameObject);
      // should maybe call
      console.log('calling startTurn from rerolls');
      startTurn(roster1, roster2, copyOfgameObject);
    }
    setLog(logging);
  }

  // PHASES
  const gamePlay = () => {
    console.log('gamePlay called');
    let preReroll = {};
//    const mpx = Math.trunc(mousePosition.x / 35);
//    const mpy = Math.trunc(mousePosition.y / 35);
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    let currentRoster = copyOfRoster1;
    let opponentRoster = copyOfRoster2;
//    let team2Turn = false;
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let activeTeamIndex = 'team1';

    if (activeTeam === 'Team 2') {
      currentRoster = copyOfRoster2;
      opponentRoster = copyOfRoster1;
//      team2Turn = true;
      activeTeamIndex = "team2";
    }
    let newButtons = [];
    // check if action is selected

    currentRoster.forEach((item, i) => {
      // check if stunty and thick skull
      const stuntyCheck = item.skills.filter( skill => skill === 'Stunty');
      const thickSkullCheck = item.skills.filter( skill => skill === 'Thick Skull');
      const sureFeetCheck = item.skills.filter( skill => skill === 'Thick Skull');
      let stunty = false;
      let thickSkull = false;
      if (stuntyCheck.length === 1) {stunty = true;}
      if (thickSkullCheck.length === 1) {thickSkull = true;}

      // rush query
      if (item.status === 'rush') {
        const rushDice = callDice(6);
        const sureFeetDice = callDice(6);
        const checkIfMarked = item.markedBy(opponentRoster);
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);
        let logging = [`${item.number} is rushing...`];
        //console.log('marked: ', checkIfMarked);

        if (moveChecking.length === 1) {
          const moving = item.move(mousePosition.x, mousePosition.y);
          logging.push(`${item.number} moves. Movement left: ${moving}`);
          item.rushes--;
          console.log('rush dice: ', rushDice);

        }

        if (checkIfMarked.length > 0) {
          // moving from marked place
          const newMarkCheck = item.markedBy(opponentRoster);
          let modifier = 0;
          if (newMarkCheck.length > 0) {
            modifier = -1;
          }
          console.log('new mark check: ', newMarkCheck);
          logging.push('... he is marked');

          if (stunty.length > 0) {
            modifier = 0;
          }

          const dexCheck = item.skillTest('ag', callDice(6), modifier)

          if (dexCheck) {
            item.move(mousePosition.x, mousePosition.y);
            logging.push('...passes agility check!');
          } else {
            // save old data if user selects reroll
            item.preReroll = {
              gameObject: copyOfgameObject,
              roster1: JSON.parse(JSON.stringify(copyOfRoster1)),
              roster2: JSON.parse(JSON.stringify(copyOfRoster2)),
              reasonWas: 'dodge',
              skillWas: 'ag',
              modifierWas: modifier
            }
            // turn over!
            logging.push('... he falls! Turn over!');
            item.withBall = false;
            // armour check
            const armourRoll = callDice(12);
            const armourCheck = item.skillTest('av', armourRoll, 0);
            console.log('armour test: ', armourCheck, armourRoll);
            if (armourCheck) {
              const getInjuryMessage = armourBroken(stunty, thickSkull);
              item.setStatus(getInjuryMessage);
              logging.push(`player is: ${getInjuryMessage}`);
            } else {
              item.setStatus('fallen');
              logging.push('armour holds.');
            }
            console.log('setting old data: ', preReroll);
            copyOfgameObject.phase = 'turnOver';
            setOldData(preReroll);
            setRoster1(copyOfRoster1);
            setRoster2(copyOfRoster2);
            setGameObject(copyOfgameObject);
          }
          setLog(logging);
        }  // if marked ends
        if (item.rushes > 0) {
          item.setStatus('moved');
        } else {
          item.setStatus('activated');
        }

        if (rushDice === 1) {
          if (sureFeetCheck.length === 1 && sureFeetDice > 1) {
            console.log('sure feet saved');
          } else {
            console.log('saving for possible reroll');
            item.preReroll = {
              gameObject: copyOfgameObject,
              roster1: JSON.parse(JSON.stringify(copyOfRoster1)),
              roster2: JSON.parse(JSON.stringify(copyOfRoster2)),
              reasonWas: 'rush'
            }
            console.log('rushRoll 1');
            let logging = ['He trips!'];
            item.withBall = false;
            // falls
            // turn over!
            logging.push('... he falls! Turn over!');
            // armour check
            const armourRoll = callDice(12);
            const armourCheck = item.skillTest('av', armourRoll, 0);
            console.log('armour test: ', armourCheck, armourRoll);
            if (armourCheck) {
              const getInjuryMessage = armourBroken(stunty, thickSkull);
              item.setStatus(getInjuryMessage);
              logging.push(`player is: ${getInjuryMessage}`);
            } else {
              item.setStatus('fallen');
              logging.push('armour holds.');
            }
            // save old data if user selects reroll
            console.log('setting old data: ', preReroll);
            setOldData(preReroll);
            copyOfgameObject.phase = 'turnOver';
            setRoster1(copyOfRoster1);
            setRoster2(copyOfRoster2);
            setGameObject(copyOfgameObject);
            console.log('calling turnover phase from gamePlay, rush ');
            turnOverPhase(copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2, item, true);
          }
        } // rush dice 1 ends
        // (copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2)
        if (copyOfgameObject.phase === 'turnOver') {
          //console.log('phase is turn over');
          // (copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2)
          console.log('calling turnOverPhase from gamePlay (rush)');
          turnOverPhase(copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2, item, true);
        }
      }

      // move
      if (item.status === 'move' && copyOfgameObject.phase !== 'turnOver') {
        const checkIfMarked = item.markedBy(opponentRoster);
        const checkLegalSquares = item.checkForMove(currentRoster, opponentRoster);
        const convertedPosition = convertPosition(mousePosition, squareSize);
        const moveChecking = checkLegalSquares.filter( loc => loc.x === convertedPosition.x && loc.y === convertedPosition.y);
        let logging = [`${item.number} is moving...`];
        //console.log('marked: ', checkIfMarked);

        if (moveChecking.length === 1 && item.movementLeft > 0) {
          const moving = item.move(mousePosition.x, mousePosition.y);
          logging.push(`${item.number} moves. Movement left: ${moving}`);
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
          logging.push('... he is marked');

          if (stunty.length > 0) {
            modifier = 0;
          }

          const dexCheck = item.skillTest('ag', callDice(6), modifier)

          if (dexCheck) {
            item.move(mousePosition.x, mousePosition.y);
            logging.push('...passes agility check!');
          } else {
            // turn over!
            // save old data if user selects reroll
            item.preReroll = {
              gameObject: copyOfgameObject,
              roster1: JSON.parse(JSON.stringify(copyOfRoster1)),
              roster2: JSON.parse(JSON.stringify(copyOfRoster2)),
              reasonWas: 'dodge',
              skillWas: 'ag',
              modifierWas: modifier
            }
            logging.push('... he falls! Turn over!');
            item.withBall = false;
            // armour check
            const armourRoll = callDice(12);
            const armourCheck = item.skillTest('av', armourRoll, 0);
            console.log('armour test: ', armourCheck, armourRoll);
            if (armourCheck) {
              const getInjuryMessage = armourBroken(stunty, thickSkull);
              item.setStatus(getInjuryMessage);
              logging.push(`player is: ${getInjuryMessage}`);
            } else {
              item.setStatus('fallen');
              logging.push('armour holds.');
            }

            console.log('setting old data: ', preReroll);
            preReroll.who = item;
            setOldData(preReroll);
            copyOfgameObject.phase = 'turnOver';
            setRoster1(copyOfRoster1);
            setRoster2(copyOfRoster2);
            setGameObject(copyOfgameObject);
          }
          setLog(logging);
        }  // if marked when start to move ends
        //console.log('phase is: ', copyOfgameObject.phase);
        if (copyOfgameObject.phase === 'turnOver') {
          //console.log('phase is turn over');
          // (copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2)
          console.log('calling turnOverPhase from gamePlay (movement)');
          turnOverPhase(copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2, item, false);
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
            }
            if (reallyStupid.length > 0) {
              console.log('really stupid detected');
            }
            if (animalSavagery.length > 0) {
              console.log('animal savagery detected');
            }
            // create buttons:
            newButtons.push(<button id= 'move' onClick= {actions} key = {callDice(9999)}>Move</button>);
            if (copyOfgameObject[activeTeamIndex].blitz) {
              newButtons.push(<button id= 'blitz' onClick= {actions}  key = {callDice(9999)}>Blitz</button>);
            }
            if (checkIfMarked.length > 0) {
              newButtons.push(<button id= 'block' onClick= {actions}  key = {callDice(9999)}>Block</button>);
            }
            if (copyOfgameObject[activeTeamIndex].pass) {
              newButtons.push(<button id= 'pass' onClick= {actions}  key = {callDice(9999)}>Pass</button>);
            }
            if (copyOfgameObject[activeTeamIndex].handOff) {
              newButtons.push(<button id= 'handOff' onClick= {actions} key = {callDice(9999)}>HandOff</button>);
            }
            newButtons.push(<button id= 'endTurn' onClick= {actions} key = {callDice(9999)}>End turn</button>);
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

    setRoster1(copyOfRoster1);
    setRoster2(copyOfRoster2);
  }

  const turnOverPhase = (copyOfgameObject, activeTeamIndex, copyOfRoster1, copyOfRoster2, item, noReroll) => {
    if (gameObject[activeTeamIndex].rerolls > 0 && noReroll === false) {
      const makeName = JSON.stringify(item);
      console.log('rerolls left, who is: ', item);
      const activeButtons = <><button id= "rerollYes" name = {makeName} onClick = {rerolls}>Yes, re-roll</button><button id= "rerollNo" onClick = {rerolls}>no</button></>
      setActionButtons(activeButtons);
    } else {
      // start turn over sequince
      console.log('turn over phase ');
      // if had the ball, bounce the ball
      const fallenGuysLocation = {x: item.gridX, y: item.gridY};
      const checkingIfAtBall = checkIfBallLocation(fallenGuysLocation);
      if (checkingIfAtBall) {
        setBall(bounce(callDice(8), ball));
      }
      setMsg('TURNOVER!');
      const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
      copyOfgameObject.phase = 'startTurn';
      if (activeTeam === 'Team 1') {
        setActiveTeam('Team 2');
      } else {
        setActiveTeam('Team 1');
      }
      setGameObject(copyOfgameObject);
      console.log('calling startTurn from TurnOverPhase');
      startTurn(copyOfRoster1, copyOfRoster2, copyOfgameObject) ;
    }
  }

  const touchBack = (copyOfgameObject) => {
    console.log('touch back not coded yet, but was called, changed phase to StarTurn ');
    copyOfgameObject.phase = 'startTurn';
    setGameObject(copyOfgameObject);
  }

  const kickOff = (copyOfgameObject, currentRoster, copyOfRoster1, copyOfRoster2, team2Turn) => {
    console.log('kickOff called ');
    let touchBack = false;
//    let activeAgent;
//    team2Turn ? activeAgent = 'team2' : activeAgent = 'team1';
    //copyOfgameObject.phase = 'gamePlay';
    const deviationRoll = callDice(8);
    const deviationDistance = callDice(6);
    const bounceRoll = callDice(8);
    let placeOfBall = deviate(deviationRoll, deviationDistance, {x: mousePosition.x, y: mousePosition.y});
    setBall(placeOfBall);
    let forLog = [`deviation direction: ${deviationRoll}. deviation distance: ${deviationDistance}.`];
    if (activeTeam === 'Team 1') {
      //console.log('active === team2');
      currentRoster = copyOfRoster2;
      team2Turn = true;
      setFirstKicker('Team 1');
    }
    // check if someone is there to catch i
    let atLocation = [];
    currentRoster.forEach((item, i) => {
      const inLocation = item.isInLocation(placeOfBall, squareSize);
      if (inLocation) {atLocation.push(item)}
    });
    // if someone there, he tries to catch the ball
    if (atLocation.length === 1) {
      let rerollsLeft = 0;
      let catchSuccess = true;
      let negativeModifier = 0;
      const playerInAction = atLocation[0];
      let comparingToRoster = copyOfRoster1;
      if (activeTeam === 'Team 2') {
        comparingToRoster = copyOfRoster2;
        rerollsLeft = copyOfgameObject.team2.rerolls;
      } else {
        rerollsLeft = copyOfgameObject.team1.rerolls;
      }
      forLog.push(<br key= {callDice(9999)}/>);
      forLog.push(`${playerInAction.number} tries to catch...`);
      forLog.push(<br key= {callDice(9999)}/>);
      // check tacklezones
      const tacklers = playerInAction.markedBy(comparingToRoster);
      negativeModifier -= tacklers.length;
      const skillCheck = playerInAction.skillTest('ag', callDice(6), negativeModifier);
      if (skillCheck) {
        forLog.push(`Catch ok!`);
        atLocation[0].withBall = true;
        setRoster1(copyOfRoster1);
        setRoster2(copyOfRoster2);
      } else {
        forLog.push(`He fails to catch. Ball bounces to: ${bounceRoll}`);
        catchSuccess = false;
        // check if he has "Catch skill"
        const catchCheck = playerInAction.skills.filter( skill => skill === 'Catch');
        if (catchCheck.length === 1) {
          // rerolling for catch
          forLog.push(`... but the player re-tries as he has Catch skill...`);
          const skillCheck2 = playerInAction.skillTest('ag', callDice(6), negativeModifier);
          if (skillCheck2) {
            forLog.push(`Catch ok!`);
            catchSuccess = true;
          }
        }
        // ask if wants to re-roll if rerolls left?
        if (rerollsLeft > 0) {
          /* new system will be done for rerolls
          setMsg('want to try re-roll this?');
          setLastPlayer(playerInAction);
          setLastAction('catch');
          const activeButtons = <><button id= "rerollYes" onClick = {rerolls}>Yes, re-roll</button><button id= "rerollNo" onClick = {rerolls}>no</button></>
          setActionButtons(activeButtons);
          */
        }
      }
      if (!catchSuccess) {
        placeOfBall = bounce(bounceRoll, placeOfBall);
        setBall(placeOfBall);
      }
    } else {
      // nobody catching so bounces
      placeOfBall = bounce(bounceRoll, placeOfBall);
      setBall(placeOfBall);
    }

    // touch backs
    if ((deviationRoll === 4 || deviationRoll === 1 || deviationRoll === 6) &&
    deviationDistance === 6 && bounceRoll === 4) {
      forLog += 'it is a touch back!'
      setMsg('select a player who you want to have it');
      touchBack = true;
      copyOfgameObject.phase = 'touchBack';
    }
    if ((deviationRoll === 5 || deviationRoll === 3 || deviationRoll === 8) &&
      deviationDistance === 6 && bounceRoll === 5) {
      forLog += 'it is a touch back!'
      setMsg('select a player who you want to have it');
      touchBack = true;
      copyOfgameObject.phase = 'touchBack';
    }
    setLog(forLog);
    // switch to attacking team
    if (activeTeam === 'Team 1') {
      setActiveTeam('Team 2');
    } else {
      setActiveTeam('Team 1');
    }

    // set phase and thats it
    if (!touchBack) {
      console.log('not touchback, refreshing');
      copyOfgameObject.phase = 'startTurn';
      roster1.forEach((item, i) => {
        // set all activated as "ready"
        if (item.status === 'activated') {
          item.setStatus('ready');
          item.refreshMovement();
        }
        // set all fallen to prone
        if (item.status === 'fallen') {
          item.setStatus('prone');
        }
        // set all stunned to fallen
        if (item.status === 'stunned') {
          item.setStatus('fallen');
        }
      });
      roster2.forEach((item, i) => {
        // set all activated as "ready"
        if (item.status === 'activated') {
          item.setStatus('ready');
          item.refreshMovement();
        }
        // set all fallen to prone
        if (item.status === 'fallen') {
          item.setStatus('prone');
        }
        // set all stunned to fallen
        if (item.status === 'stunned') {
          item.setStatus('fallen');
        }
      });
      setMsg('click player to activate it');
    }
    setGameObject(copyOfgameObject);
    console.log('calling startTurn from kickOff');
    startTurn(copyOfRoster1, copyOfRoster2, copyOfgameObject);
  }

  const startTurn = (copyOfRoster1, copyOfRoster2, copyOfgameObject) => {
    console.log('start turn called');
    let activeTeamIndex = 'team1';
//    let currentRoster = copyOfRoster1;
    let opponentRoster = copyOfRoster2;
  //  let team2Turn = false;
    // setup
    if (activeTeam === 'Team 2') {
      console.log('team 2 starts');
      //console.log('active === team2');
  //    currentRoster = copyOfRoster2;
      opponentRoster = copyOfRoster1;
  //    team2Turn = true;
      activeTeamIndex = "team2";
      copyOfgameObject.team2.turn++;
    } else {
      console.log('team 1 starts');
      copyOfgameObject.team1.turn++;
    }
    // terminate half if 9th turn and first half
    if (copyOfgameObject.half === 1 && copyOfgameObject[activeTeamIndex].turn === 9) {
      copyOfgameObject.half = 2;
      copyOfgameObject.team1.turn = 0;
      copyOfgameObject.team2.turn = 0;
      copyOfgameObject.phase = 'set defence';
      if (firstKicker === 'Team 1') {
        setActiveTeam('Team 2');
      } else {
        setActiveTeam('Team 1');
      }
    }
    // terminate game if last turn passed
    if (copyOfgameObject.half === 2 && copyOfgameObject[activeTeamIndex].turn === 9) {
      console.log('game over!');
      setMsg('GAME OVER!');
      copyOfgameObject.phase = 'GAME OVER';
    }
    if (copyOfgameObject[activeTeamIndex].turn < 9) {
      copyOfgameObject.phase = 'gameplay';
      console.log('not yet 9th turn, setting to gameplay');
      copyOfgameObject.team1.blitz = true;
      copyOfgameObject.team1.foul = true;
      copyOfgameObject.team1.pass = true;
      copyOfgameObject.team1.handOff = true;
      copyOfgameObject.team2.blitz = true;
      copyOfgameObject.team2.foul = true;
      copyOfgameObject.team2.pass = true;
      copyOfgameObject.team2.handOff = true;
      // refresh players
      console.log('refreshing players');
      opponentRoster.forEach((item, i) => {
        if (item.status === 'activated' || item.status === 'moved') {
          console.log(item.name, ' set to ready');
          item.setStatus('ready');
          item.refreshMovement();
        }
        if (item.status === 'fallen') {
          console.log(item.name, ' set to prone');
          item.setStatus('prone');
        }
        if (item.status === 'stunned') {
          item.setStatus('fallen');
        }
      });
    }
    setGameObject(copyOfgameObject);
  //  console.log('calling gamePlay from startTurn');
  //  gamePlay();
  }

  // CLICKED
  const clicked = () => {
//    const mpx = Math.trunc(mousePosition.x / 35);
//    const mpy = Math.trunc(mousePosition.y / 35);
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    let currentRoster = copyOfRoster1;
  //  let opponentRoster = copyOfRoster2;
    let team2Turn = false;
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
//    let activeTeamIndex = 'team1';

    if (activeTeam === 'Team 2') {
      currentRoster = copyOfRoster2;
  //    opponentRoster = copyOfRoster1;
      team2Turn = true;
  //    activeTeamIndex = "team2";
    }

    // set defence and offence
    if (gameObject.phase === 'set defence' || gameObject.phase === 'set offence') {
      let actionDone = false;
      let activeButtons = <><button id= "reserveThis" onClick = {statuses}>move selected to reserves</button><button id= "defenceReady" onClick = {statuses}>defence formation is ready</button></>;
      // check if clicked player is player of defence (should be on turn)
      if (activeTeam === 'Team 2') {
        //console.log('active === team2');
        currentRoster = copyOfRoster2;
    //    opponentRoster = copyOfRoster1;
        team2Turn = true;
      }
      // check if someone is moving
      currentRoster.forEach((item, i) => {
        if (item.status === 'move' && !actionDone) {
          item.setStatus('activated');
          item.move(mousePosition.x, mousePosition.y);
          actionDone = true;
          team2Turn ? setRoster2(currentRoster) : setRoster1(currentRoster);
        }
      });
      if (!actionDone) {
        currentRoster.forEach((item, i) => {
          const collision = arcVsArc(mousePosition, item, 10, 15);
          //console.log('item and mouse ', item.x, item.y, mousePosition.x, mousePosition.y);
          if (collision) {
            item.setStatus('move');
            team2Turn ? setRoster2(currentRoster) : setRoster1(currentRoster);
          }
        });
      }
      if (gameObject.phase === 'set offence') {
        activeButtons = <><button id= "reserveThis" onClick = {statuses}>move selected to reserves</button><button id= "offenceReady" onClick = {statuses}>offence formation is ready</button></>
      }
      setActionButtons(activeButtons);
    }

    if (gameObject.phase === 'kick off') {
      kickOff(copyOfgameObject, currentRoster, copyOfRoster1, copyOfRoster2, team2Turn);
    }

    // touch back phase
    if (gameObject.phase === 'touchBack') {
      console.log('calling touchBack from clicked as phase is so');
      touchBack(copyOfgameObject);
    }

    // start of turn Continue here!
    /*
    if (gameObject.phase === 'startTurn') {
      console.log('sT');
      startTurn(copyOfRoster1, copyOfRoster2, copyOfgameObject);
    }
*/
    // gameplay phase
    if (gameObject.phase === 'gameplay') {
      console.log('calling gameplay from clicked as phase is so ');
      gamePlay();
    }
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
  }

  const actions = (event) => {
    const idOfAction = event.target.id;
    console.log('idofaction ', idOfAction);
  //  const bothRosters = roster1.concat(roster2);
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    let currentRoster = copyOfRoster1;
  //  let team2Turn = false;
    if (activeTeam === 'Team 2') {
      //console.log('active === team2');
      currentRoster = copyOfRoster2;
    //  team2Turn = true;
    }
    const playerWithAction = currentRoster.filter( player => player.status === 'ACTIVE');

    // might happen so that set is too slow and this is notnig...
    if (playerWithAction.length > 0) {
      playerWithAction[0].setStatus(idOfAction);
      // move
      if (idOfAction === 'move') {
        setMsg(`select next square to move for ${playerWithAction[0].number}. When ready, activate next player or terminate turn.`);
      }
      setRoster1(copyOfRoster1);
      setRoster2(copyOfRoster2);
    }

  }

  const statuses = (e) => {
    const selectedAction = e.target.id;
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    let currentRoster = copyOfRoster1;
    let team2Turn = false;

    console.log('statuses: ', selectedAction);
    if (activeTeam === 'Team 2') {
      //console.log('active === team2');
      currentRoster = copyOfRoster2;
      team2Turn = true;
    }

    if (selectedAction === 'reserveThis') {
      currentRoster.forEach((item, i) => {
        if (item.status === 'move') {
          item.setStatus('reserve');
          item.move(1900, 1900);
          /*
          item.x = mousePosition.x;
          item.y = mousePosition.y;
          */
          team2Turn ? setRoster2(currentRoster) : setRoster1(currentRoster);
        }
      });
    }

    if (selectedAction === 'defenceReady') {
      const checkUp = checkLineUp(currentRoster, false);

      if (checkUp) {
        setMsg('def formation ok, set now offense');
        copyOfgameObject.phase = 'set offence';
        setGameObject(copyOfgameObject);
        team2Turn ? setActiveTeam('Team 1') : setActiveTeam('Team 2');
      } else {
        setMsg('illegal formation. check wide zones, total players and scrimmage');
      }
    }

    if (selectedAction === 'offenceReady') {
      const checkUp = checkLineUp(currentRoster, true);

      if (checkUp) {
        setMsg('off formation ok, Kick Off now. Select place for a ball');
        copyOfgameObject.phase = 'kick off';
        setGameObject(copyOfgameObject);
        team2Turn ? setActiveTeam('Team 1') : setActiveTeam('Team 2');
      } else {
        setMsg('illegal formation. check wide zones, total players and scrimmage');
      }
    }
    setRoster1(copyOfRoster1);
    setRoster2(copyOfRoster2);
  }

  const quickSetup1 = () => {
    quickAddTeam(9);
    setActiveTeam('Team 2');
  }
  const quickSetup2 = () => {
    quickAddTeam(8);
  }

  const quickAddTeam =  (clickedEntry) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let active = 'team1';
    let startPoint = {x: 50, y: 100};
    let activeRoster = [];
    const selectedTeam = teams.filter( team => team.id === clickedEntry);

    if (activeTeam === 'Team 2') {
      active = 'team2';
      activeRoster = activeRoster.concat(roster2);
      startPoint.y = 450;
    } else {
      activeRoster = activeRoster.concat(roster1);
    }

    copyOfgameObject[active].rerolls = selectedTeam[0].reRolls;
    copyOfgameObject[active].team = selectedTeam[0].teamName;

    selectedTeam[0].roster.forEach((item) => {
      const selectedPlayer = players.filter( player => item.id === player.id);
      const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
      newPlayer.x = startPoint.x + (activeRoster.length + 1) * 36;
      newPlayer.y = startPoint.y;
      newPlayer.status = 'ready';
      activeRoster.push(newPlayer);
    });

    if (activeTeam === 'Team 2') {
      setRoster2(activeRoster);
    } else {
      setRoster1(activeRoster);
    }

    setGameObject(copyOfgameObject);
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
  }

  const addTeam =  (e) => { console.log('add team e', e);
    const clickedEntry = Number(e.target.id);
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let active = 'team1';
    let startPoint = {x: 50, y: 100};
    let activeRoster = [];
    const selectedTeam = teams.filter( team => team.id === clickedEntry);

    if (activeTeam === 'Team 2') {
      active = 'team2';
      activeRoster = activeRoster.concat(roster2);
      startPoint.y = 450;
    } else {
      activeRoster = activeRoster.concat(roster1);
    }

    copyOfgameObject[active].rerolls = selectedTeam[0].reRolls;
    copyOfgameObject[active].team = selectedTeam[0].teamName;

    selectedTeam[0].roster.forEach((item) => {
      const selectedPlayer = players.filter( player => item.id === player.id);
      const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
      newPlayer.x = startPoint.x + (activeRoster.length + 1) * 36;
      newPlayer.y = startPoint.y;
      newPlayer.status = 'ready';
      activeRoster.push(newPlayer);
    });

    if (activeTeam === 'Team 2') {
      setRoster2(activeRoster);
    } else {
      setRoster1(activeRoster);
    }

    setGameObject(copyOfgameObject);
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
  }

  const startGame = () => {
    if (roster1.length < 1 || roster2.length < 1) {
      return null;
    }

    setMsg('dice roll off:');
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let playerDice = 0;
    let aiDice = 0;
    let logging;

    do {
      playerDice = callDice(6);
      aiDice = callDice(6);
      logging = [`player rolled: ${playerDice}, ai rolled: ${aiDice}`];
    } while (playerDice === aiDice);

    setLog(logging);

    logging.push(<br key= {playerDice+logging+aiDice}/>);
    if (playerDice > aiDice) {
      logging.push('team 1 receives the kick!');
      setMsg('set defence for team 2:');
      setActiveTeam('Team 2');
    } else {
      logging.push('team 2 receives the kick!');
      setMsg('set defensive formation for team 1 (to right side!)');
      setActiveTeam('Team 1');
    }

    // make players as Players
    const convertedRoster1 = [];
    const convertedRoster2 = [];

    roster1.forEach((item, i) => {
      const createdPlayer = makePlayer(item, i, gameObject.team1.team);
      convertedRoster1.push(createdPlayer);
    });
    roster2.forEach((item, i) => {
      const createdPlayer = makePlayer(item, i, gameObject.team2.team);
      convertedRoster2.push(createdPlayer);
    });

    setRoster1(convertedRoster1);
    setRoster2(convertedRoster2);

    if (activeTeam === 'Team 1') {
    } else {
    //  const updatedRoster2 = setDefence(JSON.parse(JSON.stringify(roster2)));
    //  console.log('updr2 ', updatedRoster2);
      // tonne menee nyt jostain syystä vanhaa kamaa... tutkippas se...
      //setRoster2(updatedRoster2);
    }
    copyOfgameObject.phase = 'set defence';
    setGameObject(copyOfgameObject);
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
        <button id= "activateTeam1" onClick= {activateTeam}>
          team1
        </button>
        <button id= "activateTeam2" onClick= {activateTeam}>
          team2
        </button>
        <button id= "start" onClick= {startGame}>
          START GAME
        </button>
        <button id= "quickSetup1" onClick= {quickSetup1}>
          quickSetup1
        </button>
        <button id= "quickSetup2" onClick= {quickSetup2}>
          quickSetup2
        </button>
        <br/>{/*
        <button id= "turnPlus" onClick= {turnToggle}>
          turn+
        </button>
        <button id= "turnMinus" onClick= {turnToggle}>
          turn-
        </button>
        <button id= "rerollPlus" onClick= {rerollToggle}>
          reroll+
        </button>
        <button id= "rerollMinus" onClick= {rerollToggle}>
          reroll-
        </button>
        <button id= "scorePlus" onClick= {scoreToggle}>
          score+
        </button>
        <button id= "scoreMinus" onClick= {scoreToggle}>
          score-
        </button>*/}
        <br/>
        phase: {gameObject.phase}
        </div>
        <div id= "rightSide"> {/*
          <button id= "move" onClick= {statuses}>move</button>
          <button id= "prone" onClick= {statuses}>prone</button>
          <button id= "stunned" onClick= {statuses}>stunned</button>

          <button id= "fallen" onClick= {statuses}>fallen</button>
          <button id= "lostBlockZone" onClick= {statuses}>lostBlockZone</button>
          <button id= "activated" onClick= {statuses}>activated</button>

          <button id= "ready" onClick= {statuses}>ready</button>

          <button id= "team1ready" onClick= {statuses}>team 1 ready</button>
          <button id= "team2ready" onClick= {statuses}>team 2 ready</button>
          <br/>*/}
          <button id= "d6" onClick= {diceThrow}>d6</button>
          <button id= "2d6" onClick= {diceThrow}>2d6</button>
          <button id= "1block" onClick= {diceThrow}>1 x block</button>
          <button id= "2block" onClick= {diceThrow}>2 x block</button>
          <button id= "3block" onClick= {diceThrow}>3 x block</button>
          <button id= "d3" onClick= {diceThrow}>d3</button>
          <button id= "d8" onClick= {diceThrow}>d8</button>
          <button id= "d16" onClick= {diceThrow}>d16</button>
          <br/>{/*
          <button id= "moveBall" onClick= {statuses}>move ball</button>*/}
          {dices}
          <div className= "consoles" id= "log">
            {log}
          </div>
          <div>
            {actionButtons}
          </div>
        </div>
        <div id= "infos">
          Activated team: {activeTeam}<br/>
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

export default BloodBowl2;

/*
the arena should be
26width
15height
{}
*/
