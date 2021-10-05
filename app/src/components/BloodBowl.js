import { drawBBfield, drawPlayers } from '../functions/bloodBowl';
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

  // when this app is loaded
  useEffect( () => {
    drawBBfield("bloodBowlStadium", 16, 27);
    getAll().then(initialData => {
       setPlayers(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
  }, []);

  // adds player to roster
  const addFunc = (e) => {
    const clickedEntry = Number(e.target.id);
    let startPoint = {x: 50, y: 400};
    let activeRoster = [];
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));

    if (activeTeam === 'Team 1') {
      activeRoster = activeRoster.concat(roster1);
    } else {
      activeRoster = activeRoster.concat(roster2);
      startPoint.x = 450;
    }

    const selectedPlayer = players.filter( player => clickedEntry === player.id);
    selectedPlayer[0].x = startPoint.x + (activeRoster.length + 1) * 31;
    selectedPlayer[0].y = startPoint.y;
    if (activeRoster.length > 10) {
      selectedPlayer[0].y = startPoint.y + 40;
      selectedPlayer[0].x = startPoint.x + (activeRoster.length - 10) * 31;;
    }
    activeRoster.push(selectedPlayer[0]);

    if (activeTeam === 'Team 1') {
      copyOfgameObject.team1.value += Number(selectedPlayer[0].cost);
      setRoster1(activeRoster);
    } else {
      copyOfgameObject.team2.value += Number(selectedPlayer[0].cost);
      setRoster2(activeRoster);
    }
    drawPlayers(("bloodBowlStadium", roster1, roster2);
    setGameObject(copyOfgameObject);
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

  return(
    <div style= {style}>

      <div>
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
      <div>
        Activated team: {activeTeam}<br/>
        {gameObject.team1.team}. score: {gameObject.team1.score} turn: {gameObject.team1.turn} rerolls: {gameObject.team1.rerolls} value: {gameObject.team1.value}<br/>
        {gameObject.team2.team}. score: {gameObject.team2.score} turn: {gameObject.team2.turn} rerolls: {gameObject.team2.rerolls} value: {gameObject.team2.value}
      </div>
      </div>
      <div id= "canvasPlace">
        <canvas
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
