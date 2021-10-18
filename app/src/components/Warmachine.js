import { arcVsArc, callDice } from '../functions/bloodBowl';
import { drawWMfield } from '../functions/warmachine';
import { initialBloodBowlObject, rerollPrices, blockDices } from '../constants/constants';
import { useEffect, useState } from 'react';
import { getWhArmies, getAll } from '../services/dbControl';
import ShowAllTeams from './ShowAllTeams';
import '../styles/warmachine.css';

const Warmachine = ({game}) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState ('Team 1');
  const [roster1, setRoster1] = useState ([]);
  const [roster2, setRoster2] = useState ([]);
  const [gameObject, setGameObject] = useState (initialBloodBowlObject);
  const [mousePosition, setMp] = useState('');
  const [action, setAction] = useState('nothing');
  const [dices, setDices] = useState('');
  const [details, setDetails] = useState('');
  const [ball, setBall] = useState({x:10, y:10});

  // when this app is loaded
  useEffect( () => {
    drawWMfield("warmachineField", 47, 47);
    getWhArmies().then(initialData => {
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
    const dicesSelect = e.target.id;
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
      default: console.log('dice not found!');
    }
    setDices(results);
  }

  const hovering = (e) => {
    // get mouse locations offsets to get where mouse is hovering.
    let r = document.getElementById('warmachineField').getBoundingClientRect();
    let x = e.clientX - r.left;
    let y = e.clientY - r.top;
    const hoverDetails = {x: x, y: y};
    const allPlayers = roster1.concat(roster2);
    // check if hovering over someone
    allPlayers.forEach((item, i) => {
      const collision = arcVsArc(mousePosition, item, 10, 15);
      if (collision) {
        const presenting = `(${item.name})
        (${item.stats})
        (${item.skills})
        (${item.specialRules})`;
        setDetails(presenting);
      }
    });
    drawWMfield("warmachineField", 47, 47, roster1, roster2, ball);
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
    console.log('action: ', action);
  }

  // game control buttons
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
/* not used
  const toggleTeam = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let toggling = 'team1';

    if (activeTeam === "Team 2") {
      toggling = 'team2';
    }
    copyOfgameObject[toggling].team = e.target.id;
    setGameObject(copyOfgameObject);
  }
*/
  const popPlayer = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    if (activeTeam === "Team 1") {
      if (roster1.length > 0) {
        copyOfgameObject.team1.value -= roster1[roster1.length-1].cost;
        roster1.pop();
      }
    } else {
      if (roster2.length > 0) {
        copyOfgameObject.team2.value -= roster1[roster2.length-1].cost;
        roster2.pop();
      }
    }
    setGameObject(copyOfgameObject);
  }

  const clicked = () => {
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);
    // check if someone is moving
    copyOfRoster1.forEach((item, i) => {
      if (item.status === 'move') {
        item.status = 'activated';
        item.x = mousePosition.x;
        item.y = mousePosition.y;
        setRoster1(copyOfRoster1);
      }
    });
    copyOfRoster2.forEach((item, i) => {
      if (item.status === 'move') {
        item.status = 'activated';
        item.x = mousePosition.x;
        item.y = mousePosition.y;
        setRoster2(copyOfRoster2);
      }
    });
    if (action !== 'nothing') {
      // check who and set status
      copyOfRoster1.forEach((item, i) => {
        const collision = arcVsArc(mousePosition, item, 10, 15);
        if (collision) {item.status = action; setRoster1(copyOfRoster1);}
        setAction('nothing');
      });
      // check who and set status
      copyOfRoster2.forEach((item, i) => {
        const collision = arcVsArc(mousePosition, item, 10, 15);
        if (collision) {item.status = action; setRoster2(copyOfRoster2);}
        setAction('nothing');
      });
    }
    // move ball
    if (action === 'moveBall') {
      const newPosition = {x: mousePosition.x, y: mousePosition.y};
      setBall(newPosition);
    }
  }

  const statuses = (e) => {
    const selectedAction = e.target.id;

    if (selectedAction === 'team1ready') {
      const copyOfRoster1 = roster1.concat([]);
        copyOfRoster1.forEach((item, i) => {
          if (item.status === 'activated' || item.status === 'lostBlockZone') {
            item.status = 'ready';
          }
        });
        setRoster1(copyOfRoster1);
    } else if (selectedAction === 'team2ready') {
      const copyOfRoster2 = roster2.concat([]);
      copyOfRoster2.forEach((item, i) => {
        if (item.status === 'activated' || item.status === 'lostBlockZone') {
          item.status = 'ready';
        }
      });
      setRoster2(copyOfRoster2);
    } else {
      setAction(selectedAction);
    }
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
    drawWMfield("warmachineField", 47, 47, roster1, roster2, ball);
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
        <button onClick= {popPlayer}>
          delete latest player
        </button>
        <button id= "activateTeam1" onClick= {activateTeam}>
          team1
        </button>
        <button id= "activateTeam2" onClick= {activateTeam}>
          team2
        </button>
        <br/>
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
        </button>
        <br/>
        </div>
        <div id= "rightSide">
          <button id= "move" onClick= {statuses}>move</button>
          <button id= "prone" onClick= {statuses}>prone</button>
          <button id= "stunned" onClick= {statuses}>stunned</button>

          <button id= "fallen" onClick= {statuses}>fallen</button>
          <button id= "lostBlockZone" onClick= {statuses}>lostBlockZone</button>
          <button id= "activated" onClick= {statuses}>activated</button>

          <button id= "ready" onClick= {statuses}>ready</button>

          <button id= "team1ready" onClick= {statuses}>team 1 ready</button>
          <button id= "team2ready" onClick= {statuses}>team 2 ready</button>
          <br/>
          <button id= "d6" onClick= {diceThrow}>d6</button>
          <button id= "2d6" onClick= {diceThrow}>2d6</button>
          <button id= "1block" onClick= {diceThrow}>1 x block</button>
          <button id= "2block" onClick= {diceThrow}>2 x block</button>
          <button id= "3block" onClick= {diceThrow}>3 x block</button>
          <button id= "d3" onClick= {diceThrow}>d3</button>
          <button id= "d8" onClick= {diceThrow}>d8</button>
          <button id= "d16" onClick= {diceThrow}>d16</button>
          <br/>
          <button id= "moveBall" onClick= {statuses}>move ball</button>
          {dices}
        </div>
        <div id= "infos">
          Activated team: {activeTeam}<br/>
          {gameObject.team1.team}. score: {gameObject.team1.score} turn: {gameObject.team1.turn} rerolls: {gameObject.team1.rerolls} value: {gameObject.team1.value}<br/>
          {gameObject.team2.team}. score: {gameObject.team2.score} turn: {gameObject.team2.turn} rerolls: {gameObject.team2.rerolls} value: {gameObject.team2.value}
        </div>
      </div>
      <div id= "canvasPlace">
        <canvas
          onMouseMove= {hovering}
          onClick= {clicked}
          id= "warmachineField"
          width = {1000}
          height = {1300}>
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

export default Warmachine;

/*
the arena should be
26width
15height
{}
*/
