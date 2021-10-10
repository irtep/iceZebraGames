import { useState, useEffect } from 'react';
import { getAll, saveTeam } from '../services/dbControl';
import { callDice } from '../functions/bloodBowl';
import { rerollPrices } from '../constants/constants';
import ShowAllPlayers from './ShowAllPlayers';
import Player from './Player';


const CreateTeam = () => {
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [faction, setFaction] = useState('Imperial Nobility');
  const [newRoster, setNewRoster] = useState([]);
  const [cost, setCost] = useState(0);
  const [rerolls, setRerolls] = useState(0);
  //const [reRolls, setRerolls] = useState(0);

  // when this app is loaded
  useEffect( () => {
    //get players from db
    getAll().then(initialData => {
       setPlayers(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
     // create options menu
     rerollPrices.forEach( (item) => {
       const o = document.createElement("option");
       o.text = item.team;
       o.value = item.team;
       o.key = item.team;
       document.getElementById("chooseFaction").appendChild(o);
     });
  }, []);

  const addFunc = (e) => {
    const clickedEntry = Number(e.target.id);
    let activeRoster = newRoster.concat([]);
    const selectedPlayer = players.filter( player => clickedEntry === player.id);
    const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
    const newCost = Number(cost) + Number(newPlayer.cost);
    activeRoster.push(newPlayer);
    setNewRoster(activeRoster);
    setCost(newCost);
  }
  /*
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
    drawBBfield("bloodBowlStadium", 16, 27, roster1, roster2, ball);
  }
*/
  const teamSelected = (e) => {
    setFaction(e.target.value);
  }

  const teamToDb = (e) => {
    e.preventDefault();
    const newTeam = {
      teamName: teamName,
      reRolls: rerolls,
      roster: newRoster
    }
    if (teamName !== '' && newRoster.length > 0) {
      saveTeam(newTeam);
      console.log('team saved');
    } else {
      console.log('empty fields');
    } 
    console.log('submitting: ', teamName, newRoster, rerolls);
  }

  const popPlayer = (e) => {
    if (newRoster.length > 0) {
      let activeRoster = newRoster.concat([]);
      const costMod = activeRoster[activeRoster.length - 1].cost;
      const newCost = Number(cost) - Number(costMod);
      activeRoster.pop();
      setNewRoster(activeRoster);
      setCost(newCost);
    }
  }

  const modRerolls = (e) => {
    const getCost = rerollPrices.filter( rr => rr.team === faction);
    if (e.target.id === 'rrPlus') {
      const newCost = Number(cost) + Number(getCost[0].price);
      const newRR = Number(rerolls) + 1;
      setRerolls(newRR);
      setCost(newCost);
    } else {
      if (rerolls > 0) {
        const newCost = Number(cost) - Number(getCost[0].price);
        const newRR = Number(rerolls) - 1;
        setRerolls(newRR);
        setCost(newCost);
      }
    }
  }

  return(
    <div>
      <div>
        <select id = "chooseFaction" onChange = {teamSelected}>
          <option value = "Choose a faction">Choose a faction</option>
        </select>
        <br />
        <button onClick= {popPlayer}>
          delete latest player
        </button>
        <br />
        <button id= 'rrPlus' onClick= {modRerolls}>
          add reroll
        </button>
        <button id= 'rrMinus' onClick= {modRerolls}>
          delete reroll
        </button>
        <br />
        <div>
          cost: {cost} rerolls: {rerolls}
        </div>
        <div>
          {newRoster.map( person => {
              return(
                <div key= {person.name + callDice(99999)}>
                  <Player
                    player= {person}
                  />
                </div>
               )
          })}
        </div>

      <form id= "addTeam" onSubmit={ teamToDb }>

        <div>
          name
          <input
            id= "teamName"
            type="text"
            value={ teamName }
            onChange={({ target }) => setTeamName(target.value)}
          />
        </div>
        <br/>
        <button id= "submitNew" type="submit">Save New Team</button>
      </form>
      </div>
      <div id= "players">
        players:<br/>
        <ShowAllPlayers
          selectedTeam = {faction}
          showThese = {players}
         addFunc = {addFunc}/>
      </div>
    </div>
    );
}

export default CreateTeam;
