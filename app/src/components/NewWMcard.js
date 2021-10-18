import { useState } from 'react';
import { createCard } from '../services/dbControl';

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
  const [name, setName] = useState('');
  const [factions, setFactions] = useState('');
  const [baseSize, setBaseSize] = useState('');
  const [unitType, setUnitType] = useState('');
  const [weapons, setWeapons] = useState('');
  const [hitpoints, setHitpoints] = useState('');
  const [stats, setStats] = useState('');
  const [skills, setSkills] = useState(''); // these can be those like pathfinder
  const [cost, setCost] = useState('');
  const [specialRules, setSpecials] = useState('');
  const [img, setImg] = useState('');

  const addWMcard = async (event) => {
    event.preventDefault();
    let emptyValue = false;

    const cardEntry = {
      name: name,
      unitType: unitType,
      factions: factions,
      baseSize: baseSize,
      hitpoints: hitpoints,
      game: 'warmachine',
      stats: stats,
      skills: skills,
      specialRules: specialRules,
      cost: cost,
      weapons: weapons,
      img: img
    };

    const allDatas = [
      name, factions, baseSize, hitpoints, weapons, stats,
      skills, specialRules, cost, img, unitType
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
        add new WARMACHINE/HORDES card <br/><br/>
        <form id= "addCard" onSubmit={ addWMcard }>

          <div>
            name<br/>
            <input
              id= "cardName"
              type="text"
              value={ name }
              onChange={({ target }) => setName(target.value)}
            />
            units type: (caster, beast, warrior, unit, solo, jack)<br/>
            <input
              type="text"
              value={ unitType }
              onChange={({ target }) => setUnitType(target.value)}
            />
            faction (will array for example: cryx or cryx,mercenary,circle)<br/>
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
            hitpoints<br/>
            <input
              type="text"
              value={ hitpoints }
              onChange={({ target }) => setHitpoints(target.value)}
            />
          </div>
          <div>
            basesize (30, 40, 50, 120)<br/>
            <input
              type="text"
              value={ baseSize }
              onChange={({ target }) => setBaseSize(target.value)}
            />
          </div>
          <div>
            stats ( spd, str, mat, rat, def, arm, cmd, focus)<br/>
            <input
              type="text"
              value={ stats }
              onChange={({ target }) => setStats(target.value)}
            />
          </div>
          <div>
            skills, like pathfinder<br/>
            <input
              type="text"
              value={ skills }
              onChange={({ target }) => setSkills(target.value)}
            />
          </div>
          <div>
            specialRules, like special attacks<br/>
            <input
              type="text"
              value={ specialRules }
              onChange={({ target }) => setSpecials(target.value)}
            />
          </div>
          <div>
            cost or if caster then battlegroup points<br/>
            <input
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
