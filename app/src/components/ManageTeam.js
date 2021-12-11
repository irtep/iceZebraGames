import { useState, useEffect } from 'react';
import { getAll, saveTeam, getTeams } from '../services/dbControl';
import { callDice } from '../functions/supportFuncs';
import { rerollPrices } from '../constants/constants';
import ShowAllPlayers from './ShowAllPlayers';
import Player from './Player';
import SetupAllTeams from './SetupAllTeams';

const ManageTeam = () => {
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [faction, setFaction] = useState('Imperial Nobility');
  const [newRoster, setNewRoster] = useState([]);
  const [cost, setCost] = useState(0);
  const [rerolls, setRerolls] = useState(0);
  const [color1, setColor1] = useState('black');
  const [color2, setColor2] = useState('silver');
  const [teams, setTeams] = useState([]);
  //const [reRolls, setRerolls] = useState(0);
/*
getTeams().then(initialData => {
   setTeams(initialData);
 }).catch(err => {
   console.log('error', err.response);
 });
*/
  // when this app is loaded
  useEffect( () => {
    //get players from db
    getAll().then(initialData => {
       setPlayers(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
     getTeams().then(initialData => {
        setTeams(initialData);
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

  const teamSelected = (e) => {
    setFaction(e.target.value);
  }

  const teamToDb = (e) => {
    e.preventDefault();
    const newTeam = {
      teamName: teamName,
      reRolls: rerolls,
      roster: newRoster,
      color1: color1,
      color2: color2
    }
    if (teamName !== '' && newRoster.length > 0) {
      saveTeam(newTeam);
      console.log('team saved');
    } else {
      console.log('empty fields');
    }
    console.log('submitting: ', teamName, newRoster, rerolls);
  }

  const popPlayer = () => {
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

  const loadTeam = () => {
    console.log('load clicked ');
    // clear what is selected now...

    // chain that team to
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
          <input
            id= "firstColor"
            type="text"
            value={ color1 }
            onChange={({ target }) => setColor1(target.value)}
          />
          <input
            id= "secondColor"
            type="text"
            value={ color2 }
            onChange={({ target }) => setColor2(target.value)}
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
      <div id= "teams" className = "greybackgroud">
        select team:<br/>
        <SetupAllTeams
         showThese = {teams}
         addFunc = {loadTeam}
         />
      </div>
    </div>
    );
}

export default ManageTeam;
