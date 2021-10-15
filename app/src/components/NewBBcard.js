import { useState } from 'react';
import { createPlayer } from '../services/dbControl';

const style = {
  margin: 20,
  padding: 10,
  background: 'navy',
  width: 200,
  borderRadius: 5,
  color: 'rgb(180,180,180)'
};
/*
name,
team,
game,
stats,
skills,
cost,
specialRules
*/
const NewBBcard = () => {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [stats, setStats] = useState('');
  const [skills, setSkills] = useState('');
  const [cost, setCost] = useState('');
  const [specialRules, setSpecials] = useState('');
  const [img, setImg] = useState('');

  const addBBcard = async (event) => {
    event.preventDefault();
    let emptyValue = false;
//    setName(name);
//    setTeam(team);
//    setStats(stats);
//    setSkills(skills)
//    setCost(cost);
//    setSpecials(specialRules);

    const cardEntry = {
      name: name,
      team: team,
      game: 'blood bowl',
      stats: stats,
      skills: skills,
      specialRules: specialRules,
      cost: cost,
      img: img
    };

    const allDatas = [
      name, team, stats, skills, specialRules, cost, img
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
        add new blood bowl card <br/><br/>
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
              type="text"
              value={ team }
              onChange={({ target }) => setTeam(target.value)}
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
            skills<br/>
            <input
              type="text"
              value={ skills }
              onChange={({ target }) => setSkills(target.value)}
            />
          </div>
          <div>
            specialRules<br/>
            <input
              type="text"
              value={ specialRules }
              onChange={({ target }) => setSpecials(target.value)}
            />
          </div>
          <div>
            cost<br/>
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

export default NewBBcard;
