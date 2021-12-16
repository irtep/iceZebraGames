/*

gotta find clear and smooth game flow.....something like where gameObject rolls around etc.
this state based does not work that well as it comes late when it should not be late

*/
import { drawBBfield, bloodBowlDices, makePlayer, checkLineUp, deviate, bounce, convertPosition, armourBroken }
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
    });
    drawBBfield("bloodBowlStadium", gameObject);
    setMp(hoverDetails)
  }

/////// PRE GAME  ////////////////

  const activateTeam = (e) => {
    const gO = JSON.parse(JSON.stringify(gameObject));
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
/*
    tempRoster.forEach((item, i) => {
      const createdPlayer = makePlayer(item, i, gO[active].team);
      gO[active].roster.push(createdPlayer);
    });
*/
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
    console.log('go: ', gO);
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

  const clicked = () => {
    const gO = JSON.parse(JSON.stringify(gameObject));
    let currentRoster = gO.team1.roster;
    if (gO.team2.active) { currentRoster = gO.team2.roster }
    console.log('gO: ', gO);
    // set defence and offence
    // CONTINUE from here.....
    if (gameObject.phase === 'set defence' || gameObject.phase === 'set offence') {
      let actionDone = false;
      let activeButtons = <><button id= "reserveThis" onClick = {statuses}>move selected to reserves</button><button id= "defenceReady" onClick = {statuses}>defence formation is ready</button></>;

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
    }
    setGameObject(gO);
  }

  const statuses = (e) => {
    const gO = JSON.parse(JSON.stringify(gameObject));
    let activeIndex = 'team1';
    if (gO.team2.active) { activeIndex = 'team2' }
    let currentRoster = gO[activeIndex].roster;
    const selectedAction = e.target.id;

    if (selectedAction === 'reserveThis') {
      currentRoster.forEach((item, i) => {
        if (item.status === 'move') {
          item.setStatus('reserve');
          item.move(1900, 1900);
        }
      });
    }

    if (selectedAction === 'defenceReady') {
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
    }

    if (selectedAction === 'offenceReady') {
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
      } else {
        setMsg('illegal formation. check wide zones, total players and scrimmage');
      }
    }
    setGameObject(gO);
  }

  return(
    <div id= "container">
      <div id= "controls">
        <div id= "leftSide">
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
<br/>{/*
          <button id= "moveBall" onClick= {statuses}>move ball</button>*/}

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
