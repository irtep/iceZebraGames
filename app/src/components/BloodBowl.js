import { drawBBfield, bloodBowlDices } from '../functions/bloodBowl';
import { arcVsArc } from '../functions/supportFuncs';
import { initialBloodBowlObject, rerollPrices } from '../constants/constants';
import { useEffect, useState } from 'react';
import { getTeams, getAll } from '../services/dbControl';
import ShowAllTeams from './ShowAllTeams';
import '../styles/bloodBowl.css';

const BloodBowl = ({game}) => {
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
        (${item.stats})
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
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
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

export default BloodBowl;

/*
the arena should be
26width
15height
{}
*/
