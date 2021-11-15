/*
grid need to be id:d by x and y.

need to convert current player cards to more divisioned,
could convert it onLoad or change them at db

need to be clear input/output system to support the ai

at gameObject:
- positions of all players in x and y system
- number of half, number of turn,

gamePlay:
- could maybe skip fans, kick-off and weather? (or not?)
- console were done actions would be logged
- dice face off to who will start,
- if human, then ai sets defence, etc..
then click "phase ready"
- kick off shoot "select where to kick", then selected, that
is marked and then "phase ready"
- maybe then option to make kick-off event?
- offensive turn
- click to activate, then asks "choose action"
that is then chosen and you need to start move or choose target

at constants:
- list of "when activated" rules, for example "Bonehead" and list of who
are affected"

The GameBrain
input that is gameObject
- some kind of machine learning web
export that is action

*/
import { drawBBfield, bloodBowlDices, makePlayer, checkLineUp, deviate, bounce }
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
  const [lastPlayer, setLastPlayer] = useState('');
  const [lastAction, setLastAction] = useState('');
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

  // sets team 1 or 2 to as active team, for player adding

  const activateTeam = (e) => {
    if (e.target.id === 'activateTeam1') {
      setActiveTeam('Team 1');
    } else {
      setActiveTeam('Team 2');
    }
  }

  // check states
  const checki = () => {
    console.log('roster 1', roster1);
    console.log('roster 2', roster2);
    console.log('gameObject ', gameObject);
    console.log('mouse: ', mousePosition);
    console.log('ball: ', ball);
  //  console.log('action: ', action);
  }

  // game control buttons
  /*
  const turnToggle = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let toggling = 'team1';

    if (activeTeam === "Team 2") {
      toggling = 'team2';
    }

    if (e.target.id === 'turnPlus') {
      copyOfgameObject[toggling].turn++;
    } else {
      copyOfgameObject[toggling].turn--;
    }

    setGameObject(copyOfgameObject);
  }
  const rerollToggle = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let toggling = 'team1';

    if (activeTeam === "Team 2") {
      toggling = 'team2';
    }

    if (e.target.id === 'rerollPlus') {
      let rerollCost = 0;
      copyOfgameObject[toggling].rerolls++;
      // add value of reroll to teams value
      rerollPrices.forEach((item, i) => {
        if (item.team === copyOfgameObject[toggling].team) {
          console.log('found the team ', item.team, item.price);
          rerollCost = item.price;
        }
      });
      copyOfgameObject[toggling].value += rerollCost;
    } else {
      copyOfgameObject[toggling].rerolls--;
    }

    setGameObject(copyOfgameObject);
  }

  const scoreToggle = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let toggling = 'team1';

    if (activeTeam === "Team 2") {
      toggling = 'team2';
    }

    if (e.target.id === 'scorePlus') {
      copyOfgameObject[toggling].score++;
    } else {
      copyOfgameObject[toggling].score--;
    }

    setGameObject(copyOfgameObject);
  }
*/

  const rerolls = (event) => {
    const yesOrNo = event.target.id;
    console.log('event: ', yesOrNo, lastPlayer, lastAction);
  }

  const clicked = () => {
    const mpx = Math.trunc(mousePosition.x / 35);
    const mpy = Math.trunc(mousePosition.y / 35);
    console.log('clicked', mpx, mpy);
    console.log('phase is: ', gameObject.phase);
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    let currentRoster = copyOfRoster1;
    let opponentRoster = copyOfRoster2;
    let team2Turn = false;
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));

    /* new code */
    // set defence and offence
    if (gameObject.phase === 'set defence' || gameObject.phase === 'set offence') {
      let actionDone = false;
      let activeButtons = <><button id= "reserveThis" onClick = {statuses}>move selected to reserves</button><button id= "defenceReady" onClick = {statuses}>defence formation is ready</button></>;
      // check if clicked player is player of defence (should be on turn)
      if (activeTeam === 'Team 2') {
        //console.log('active === team2');
        currentRoster = copyOfRoster2;
        opponentRoster = copyOfRoster1;
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
      let touchBack = false;
      let activeAgent;
      team2Turn ? activeAgent = 'team2' : activeAgent = 'team1';
      copyOfgameObject[activeAgent].turn = 1;
      copyOfgameObject.phase = 'gamePlay';
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
        console.log('t/f ', inLocation);
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
            setMsg('want to try re-roll this?');
            setLastPlayer(playerInAction);
            setLastAction('catch');
            const activeButtons = <><button id= "rerollYes" onClick = {rerolls}>Yes, re-roll</button><button id= "rerollNo" onClick = {rerolls}>no</button></>
            setActionButtons(activeButtons);
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
        copyOfgameObject.phase = 'gameplay';
        setMsg('click player to activate it');
      }
      setGameObject(copyOfgameObject);
    }

    // touch back phase
    if (gameObject.phase === 'touchBack') {
      console.log('touch back not coded yet');
    }

    // gameplay phase
    if (gameObject.phase === 'gameplay') {
      let newButtons = [];
      let activeTeamIndex = 'team1';
      // setup
      if (activeTeam === 'Team 2') {
        //console.log('active === team2');
        currentRoster = copyOfRoster2;
        opponentRoster = copyOfRoster1;
        team2Turn = true;
        activeTeamIndex = "team2";
        copyOfgameObject.team2.turn++;
      } else {
        copyOfgameObject.team1.turn++;
      }

      currentRoster.forEach((item, i) => {
        // set all activated as "ready"
        if (item.status === 'activated') {
          item.setStatus('ready');
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
        console.log('should be now set defence phase');
        copyOfgameObject.team1.blitz = true;
        copyOfgameObject.team1.foul = true;
        copyOfgameObject.team1.pass = true;
        copyOfgameObject.team1.handOff = true;
        copyOfgameObject.team2.blitz = true;
        copyOfgameObject.team2.foul = true;
        copyOfgameObject.team2.pass = true;
        copyOfgameObject.team2.handOff = true;
        setGameObject(copyOfgameObject);
      }
      // terminate game if last turn passed
      if (copyOfgameObject.half === 2 && copyOfgameObject[activeTeamIndex].turn === 9) {
        console.log('game over!');
        setMsg('GAME OVER!');
        copyOfgameObject.phase = 'GAME OVER';
        console.log(copyOfgameObject);
        setGameObject(copyOfgameObject);
      }

      // check if action is selected
      // CONTINUE FROM HERE
      
      // activate the selected player
      currentRoster.forEach((item, i) => {
        const collision = arcVsArc(mousePosition, item, 10, 15);
        //console.log('item and mouse ', item.x, item.y, mousePosition.x, mousePosition.y);
        if (collision) {
          const checkIfMarked = item.markedBy(opponentRoster);
          item.setStatus('ACTIVE');
          item.setActivated();
          setMsg('choose action for this player.');
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
          setActionButtons(newButtons);
        }
      });
      setRoster1(copyOfRoster1);
      setRoster2(copyOfRoster2);
    }
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
  }

  const actions = (event) => {
    const idOfAction = event.target.id;
  //  const bothRosters = roster1.concat(roster2);
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    let currentRoster = copyOfRoster1;
    let team2Turn = false;
    if (activeTeam === 'Team 2') {
      //console.log('active === team2');
      currentRoster = copyOfRoster2;
      team2Turn = true;
    }
    const playerWithAction = currentRoster.filter( player => player.status === 'ACTIVE');

    playerWithAction[0].setStatus(idOfAction);
    // move
    if (idOfAction === 'move') {

    }
    setRoster1(copyOfRoster1);
    setRoster2(copyOfRoster2);
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

  const addTeam =  (e) => {
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
