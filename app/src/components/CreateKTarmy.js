import { useState, useEffect } from 'react';
import { getAll, saveKillTeam } from '../services/dbControl';
import { callDice } from '../functions/supportFuncs';
import { killTeamFactions } from '../constants/constants';
import ShowKtUnits from './ShowKtUnits';
import Player from './Player';
const style = {color: 'rgb(170,170,170)'}

const CreateKTarmy = () => {
  const [units, setUnits] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [faction, setFaction] = useState('cryx');
  const [newRoster, setNewRoster] = useState([]);
//  const [unitCost, setUnitCost] = useState(0);
//  const [battleGroupPoints, setBattleGroupPoints] = useState(0);
  /*
  const [rerolls, setRerolls] = useState(0);*/
  //const [reRolls, setRerolls] = useState(0);

  // when this app is loaded
  useEffect( () => {
    //get units from db
    getAll().then(initialData => {
      const killteamers = initialData.filter( trooper => trooper.game === 'killTeam');
      setUnits(killteamers);
     }).catch(err => {
       console.log('error', err.response);
     });
     // create options menu
     killTeamFactions.forEach( (item) => {
       const o = document.createElement("option");
       o.text = item.name;
       o.value = item.name;
       o.key = item.name;
       document.getElementById("chooseFacKt").appendChild(o);
     });
  }, []);

  const addFunc = (e) => {
    const clickedEntry = Number(e.target.id);
    let activeRoster = newRoster.concat([]);
    const selectedPlayer = units.filter( player => clickedEntry === player.id);
    const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));

    activeRoster.push(newPlayer);
    setNewRoster(activeRoster);
  }

  const teamSelected = (e) => {
    setFaction(e.target.value);
  }

  const teamToDb = (e) => {
    e.preventDefault();
    const newTeam = {
      teamName: teamName,
    //  reRolls: rerolls,
      roster: newRoster
    }
    if (teamName !== '' && newRoster.length > 0) {
      saveKillTeam(newTeam);
      console.log('team saved');
    } else {
      console.log('empty fields');
    }
    console.log('submitting: ', teamName, newRoster);
  }

  const popPlayer = (e) => {
    if (newRoster.length > 0) {
      let activeRoster = newRoster.concat([]);
  //    const costMod = activeRoster[activeRoster.length - 1].cost;
      activeRoster.pop();
      setNewRoster(activeRoster);
    }
  }

  return(
    <div style= {style}>
      <div>
        <select id = "chooseFacKt" onChange = {teamSelected}>
          <option value = "Choose a faction">Choose a faction</option>
        </select>
        <br />
        <button onClick= {popPlayer}>
          delete latest player
        </button>
        <br />
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
      <div id= "whUnits">
        units:<br/>
        <ShowKtUnits
          selectedFaction = {faction}
          showThese = {units}
         addFunc = {addFunc}/>
      </div>
    </div>
    );
}

export default CreateKTarmy;
