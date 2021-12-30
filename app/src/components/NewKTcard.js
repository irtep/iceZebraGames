import { useState } from 'react';
import { createCard } from '../services/dbControl';

const style = {
  margin: 20,
  padding: 10,
  background: 'rgb(010,010,010)',
  width: 200,
  borderRadius: 5,
  color: 'orange'
};
/* name
factions, stats: spd, str, mat, rat, def, arm, cmd, ctrl, base(as
i want these maybe in inches: 30mm = 1.18, 40mm, 1.57, 50mm= 1.97, 120mm= 4.72)
weapons, hitpoints or box or circle, abilities, img
cost
*/
const NewKTcard = () => {
  const [name, setName] = useState('');
  const [factions, setFactions] = useState('');
  //const [baseSize, setBaseSize] = useState('');
  //const [unitType, setUnitType] = useState('');
  const [weapons, setWeapons] = useState('');
  const [hitpoints, setHitpoints] = useState('');
  const [stats, setStats] = useState('');
  //const [skills, setSkills] = useState(''); // these can be those like pathfinder
  //const [cost, setCost] = useState('');
  const [specialRules, setSpecials] = useState('');
  const [img, setImg] = useState('');
  //const [cardLink, setLink] = useState('');

  const addKTcard = async (event) => {
    event.preventDefault();
    let emptyValue = false;

    const cardEntry = {
      name: name,
    //  unitType: unitType,
      factions: factions,
    //  baseSize: baseSize,
      hitpoints: hitpoints,
      game: 'killTeam',
      stats: stats,
  //    skills: skills,
      specialRules: specialRules,
  //    cost: cost,
      weapons: weapons,
      img: img,
  //    cardLink: cardLink
    };

    const allDatas = [
      name, factions,  weapons, stats, specialRules, hitpoints, img
    ];

    allDatas.forEach((item, i) => {
      if (item === '') {
        console.log('item is empty: ', item);
        emptyValue = true;
      }
    });

    if (emptyValue === false) {
    // i think all is ok, could enable...
      await createCard(cardEntry);
      console.log('send would ok', cardEntry);
    } else {
      console.log('empty fields');
    }
  }

  return(
    <div>
      <div style = {style}>
        add new Kill Team card <br/><br/>
        <form id= "addCard" onSubmit={ addKTcard }>
          <div>
            name<br/>
            <input
              id= "cardName"
              type="text"
              value={ name }
              onChange={({ target }) => setName(target.value)}
            />
            <br/>
            faction
            <br/>
            <input
              id= "cardFaction"
              type="text"
              value={ factions }
              onChange={({ target }) => setFactions(target.value)}
            />
          </div>
          <div>
            weapons<br/>
            <input
              type="text"
              value={ weapons }
              onChange={({ target }) => setWeapons(target.value)}
            />
          </div>
          <div>
            stats<br/>
            <input
              type="text"
              value={ stats }
              onChange={({ target }) => setStats(target.value)}
            />
          </div>
          <div>
            hit points<br/>
            <input
              type="text"
              value={ hitpoints }
              onChange={({ target }) => setHitpoints(target.value)}
            />
          </div>
          <div>
            specials<br/>
            <input
              type="text"
              value={ specialRules }
              onChange={({ target }) => setSpecials(target.value)}
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

export default NewKTcard;
