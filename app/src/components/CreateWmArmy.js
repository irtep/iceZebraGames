import { useState, useEffect } from 'react';
import { getAll, saveWhArmy } from '../services/dbControl';
import { callDice } from '../functions/bloodBowl';
import { factions } from '../constants/constants';
import ShowWhUnits from './ShowWhUnits';
import Player from './Player';
const style = {color: 'rgb(170,170,170)'}

const CreateWmArmy = () => {
  const [units, setUnits] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [faction, setFaction] = useState('cryx');
  const [newRoster, setNewRoster] = useState([]);
  const [cost, setCost] = useState(0);
//  const [unitCost, setUnitCost] = useState(0);
//  const [battleGroupPoints, setBattleGroupPoints] = useState(0);
  /*
  const [rerolls, setRerolls] = useState(0);*/
  //const [reRolls, setRerolls] = useState(0);

  // when this app is loaded
  useEffect( () => {
    //get units from db
    getAll().then(initialData => {
       setUnits(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
     // create options menu
     factions.forEach( (item) => {
       const o = document.createElement("option");
       o.text = item;
       o.value = item;
       o.key = item;
       document.getElementById("chooseFac").appendChild(o);
     });
  }, []);

  const updatePoints = (newArmy) => {
    let bgPointsLeft = 0;
    let unitPoints = 0;
    let jackAndBeastPoints = 0;
    let exceedingPoints = 0;

    // gather points from units:
    for (let i = 0; i < newArmy.length; i++) {
      // if warcaster or warlock found:
      if (newArmy[i].unitType === 'caster'){
        bgPointsLeft = Number(newArmy[i].cost);
      }
      // if beast or jack
      if (newArmy[i].unitType === 'jack' || newArmy[i].unitType === 'beast'){
        jackAndBeastPoints = jackAndBeastPoints + Number(newArmy[i].cost);
      }
      // if solo or unit
      if (newArmy[i].unitType === 'solo' || newArmy[i].unitType === 'unit' || newArmy[i].unitType === 'warrior'){
        unitPoints = unitPoints + Number(newArmy[i].cost);
      }
    }

    // deal with jack/beast points
    exceedingPoints = jackAndBeastPoints - bgPointsLeft;
    console.log('ex jb bg ', exceedingPoints, jackAndBeastPoints, bgPointsLeft);
    if (exceedingPoints < 0) { exceedingPoints = 0; }
    unitPoints = unitPoints + exceedingPoints;
  //  console.log();
    setCost(unitPoints);
  }

  const addFunc = (e) => {
    const clickedEntry = Number(e.target.id);
    let activeRoster = newRoster.concat([]);
    const selectedPlayer = units.filter( player => clickedEntry === player.id);
    const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
  //  const newCost = Number(unitCost) + Number(newPlayer.cost);
    console.log('newPlayer', newPlayer);
    activeRoster.push(newPlayer);
    setNewRoster(activeRoster);
    updatePoints(activeRoster);
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

    const selectedPlayer = units.filter( player => clickedEntry === player.id);
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
    //  reRolls: rerolls,
      roster: newRoster
    }
    if (teamName !== '' && newRoster.length > 0) {
      saveWhArmy(newTeam);
      console.log('team saved');
    } else {
      console.log('empty fields');
    }
    console.log('submitting: ', teamName, newRoster);
  }

  const popPlayer = (e) => {
    if (newRoster.length > 0) {
      let activeRoster = newRoster.concat([]);
      const costMod = activeRoster[activeRoster.length - 1].cost;
      const newCost = Number(cost) - Number(costMod);
      activeRoster.pop();
      setNewRoster(activeRoster);
      updatePoints(activeRoster);
    }
  }

  const modRerolls = (e) => {/*
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
    }*/
  }

  return(
    <div style= {style}>
      <div>
        <select id = "chooseFac" onChange = {teamSelected}>
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
          cost: {cost}
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
      <div id= "whUnits">
        units:<br/>
        <ShowWhUnits
          selectedFaction = {faction}
          showThese = {units}
         addFunc = {addFunc}/>
      </div>
    </div>
    );
}

export default CreateWmArmy;
