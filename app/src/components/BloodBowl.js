import { drawBBfield, arcVsArc } from '../functions/bloodBowl';
import { initialBloodBowlObject, rerollPrices } from '../constants/constants';
import { useEffect, useState } from 'react';
import { getAll } from '../services/dbControl';
import ShowAllPlayers from './ShowAllPlayers';

const style = {
  background: 'green'
};

const BloodBowl = ({game}) => {
  const [players, setPlayers] = useState([]);
  const [activeTeam, setActiveTeam] = useState ('Team 1');
  const [roster1, setRoster1] = useState ([]);
  const [roster2, setRoster2] = useState ([]);
  const [gameObject, setGameObject] = useState (initialBloodBowlObject);
  const [mousePosition, setMp] = useState('');
  const [action, setAction] = useState('nothing');

  // when this app is loaded
  useEffect( () => {
    drawBBfield("bloodBowlStadium", 16, 27);
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
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2);
    setMp(hoverDetails)
  }
  // adds player to roster
  const addFunc = (e) => {
    const clickedEntry = Number(e.target.id);
    let startPoint = {x: 50, y: 100};
    let activeRoster = [];
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));

    if (activeTeam === 'Team 1') {
      activeRoster = activeRoster.concat(roster1);
    } else {
      activeRoster = activeRoster.concat(roster2);
      startPoint.y = 450;
    }

    const selectedPlayer = players.filter( player => clickedEntry === player.id);
    const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
    newPlayer.x = startPoint.x + (activeRoster.length + 1) * 36;
    newPlayer.y = startPoint.y;
    newPlayer.status = 'ready';

    activeRoster.push(newPlayer);

    if (activeTeam === 'Team 1') {
      copyOfgameObject.team1.value += Number(selectedPlayer[0].cost);
      setRoster1(activeRoster);
    } else {
      copyOfgameObject.team2.value += Number(selectedPlayer[0].cost);
      setRoster2(activeRoster);
    }
    //drawPlayers("bloodBowlStadium", roster1, roster2);
    setGameObject(copyOfgameObject);
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2);
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

  const toggleTeam = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let toggling = 'team1';

    if (activeTeam === "Team 2") {
      toggling = 'team2';
    }
    copyOfgameObject[toggling].team = e.target.id;
    setGameObject(copyOfgameObject);
  }

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
    console.log('click action: ', action);
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
  }

  const statuses = (e) => {
    const selectedAction = e.target.id;
    setAction(selectedAction);
  }

  return(
    <div style= {style}>

      <div>
      mouse: {mousePosition.x} {mousePosition.y}<br/>
      <button id= "Imperial Nobility" onClick= {toggleTeam}>
        Imperial Nobility
      </button>
      <button id= "Black Orc" onClick= {toggleTeam}>
        Black Orc
      </button>
      <button id= "Dwarf" onClick= {toggleTeam}>
        Dwarf
      </button>
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
      <button id= "move" onClick= {statuses}>move</button>
      <button id= "prone" onClick= {statuses}>prone</button>

      <button id= "fallen" onClick= {statuses}>fallen</button>
      <button id= "lostBlockZone" onClick= {statuses}>lostBlockZone</button>
      <button id= "activated" onClick= {statuses}>activated</button>

      <button id= "ready" onClick= {statuses}>ready</button>

      <button id= "team1ready" onClick= {statuses}>team 1 ready</button>
      <button id= "team2ready" onClick= {statuses}>team 2 ready</button>
      <div>
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
      <div>
        players:<br/>
        <ShowAllPlayers
         showThese = {players}
         addFunc = {addFunc}/>
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
