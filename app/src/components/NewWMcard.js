import { useState } from 'react';
import { createPlayer } from '../services/dbControl';

const style = {
  margin: 20,
  padding: 10,
  background: 'darkGreen',
  width: 200,
  borderRadius: 5,
  color: 'rgb(180,180,180)'
};
/* name
factions, stats: spd, str, mat, rat, def, arm, cmd, ctrl, base(as
i want these maybe in inches: 30mm = 1.18, 40mm, 1.57, 50mm= 1.97, 120mm= 4.72)
weapons, hitpoints or box or circle, abilities, img
cost
*/
const NewWMcard = () => {
  const [name, setName] = useState('');/*
  const [name, setName] = useState('');*//*
  const [factions, setFactions] = useState('');*//*
  const [baseSize, setBaseSize] = useState('');*//*
  const [weapons, setWeapons] = useState('');*//*
  const [hitpoints, setHitpoints] = useState('');*//* // this is number, spiral or columns
  const [spiralColums, setSpiralColums] = useState('');*/
  const [team, setTeam] = useState(''); // remove this
  const [game, setGame] = useState('');
  const [stats, setStats] = useState('');
  const [skills, setSkills] = useState(''); // these can be those like pathfinder
  const [cost, setCost] = useState('');
  const [specialRules, setSpecials] = useState('');
  const [img, setImg] = useState('');

  const addBBcard = async (event) => {
    event.preventDefault();
    let emptyValue = false;
    setName(name);
    setTeam(team);
    setGame('warmachine')
    setStats(stats);
    setSkills(skills)
    setCost(cost);
    setSpecials(specialRules);

    const cardEntry = {
      name: name,
      team: team,
      game: game,
      stats: stats,
      skills: skills,
      specialRules: specialRules,
      cost: cost,
      img: img
    };

    const allDatas = [
      name, team, game, stats, skills, specialRules, cost, img
    ];

    allDatas.forEach((item, i) => {
      if (item === '') {
        console.log('item is empty: ', item);
        emptyValue = true;
      }
    });

    if (emptyValue === false) {
      await createPlayer(cardEntry);
      console.log('sent to db');
    } else {
      console.log('empty fields');
    }
  }

  return(
    <div>
      <div style = {style}>
        add new WARMACHINE/HORDES card <br/><br/>
        <form id= "addCard" onSubmit={ addBBcard }>

          <div>
            name
            <input
              id= "cardName"
              type="text"
              value={ name }
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div>
            team
            <input
              id= "cardName"
              type="text"
              value={ team }
              onChange={({ target }) => setTeam(target.value)}
            />
          </div>
          <div>
            stats<br/>
            <input
              id= "cardName"
              type="text"
              value={ stats }
              onChange={({ target }) => setStats(target.value)}
            />
          </div>
          <div>
            skills<br/>
            <input
              id= "cardName"
              type="text"
              value={ skills }
              onChange={({ target }) => setSkills(target.value)}
            />
          </div>
          <div>
            specialRules<br/>
            <input
              id= "cardName"
              type="text"
              value={ specialRules }
              onChange={({ target }) => setSpecials(target.value)}
            />
          </div>
          <div>
            cost<br/>
            <input
              id= "cardName"
              type="text"
              value={ cost }
              onChange={({ target }) => setCost(target.value)}
            />
          </div>
          <div>
            img<br/>
            <input
              id= "cardImg"
              type="text"
              value={ img }
              onChange={({ target }) => setImg(target.value)}
            />
          </div>
          <br/>
          <button id= "submitNew" type="submit">send new card</button>
        </form>
      </div>
    </div>
    );
}

export default NewWMcard;
