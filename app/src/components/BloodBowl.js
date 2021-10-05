import { drawBBfield } from '../functions/bloodBowl';
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
    let activeRoster = [];

    if (activeTeam === 'Team 1') {
      activeRoster = activeRoster.concat(roster1);
    } else {
      activeRoster = activeRoster.concat(roster2);
    }

    const selectedPlayer = players.filter( player => clickedEntry === player.id);
    console.log('selected player: ', selectedPlayer[0]);
    activeRoster.push(selectedPlayer[0]);

    if (activeTeam === 'Team 1') {
      setRoster1(activeRoster);
    } else {
      setRoster2(activeRoster);
    }
  }

  // sets team 1 or 2 to as active team, for player adding
  const activateTeam = (e) => {
    console.log('e: ', e.target.id);
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
  }

  return(
    <div style= {style}>
      <div>
      <button id= "activateTeam1" onClick= {activateTeam}>
        team1
      </button>
      <button id= "activateTeam2" onClick= {activateTeam}>
        team2
      </button>
      <button onClick= {checki}>
        checki
      </button>
      <div>
        Activated team: {activeTeam}
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
