import { arcVsArc, diceThrows } from '../functions/supportFuncs';
import { drawKTfield } from '../functions/killteam';
import { initialWarmachineObject } from '../constants/constants';
import { useEffect, useState } from 'react';
import { getKillTeams, getAll } from '../services/dbControl';
import ShowAllTeams from './ShowAllTeams';
import '../styles/killteam.css';

const KillTeam = ({game}) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState ('Team 1');
  const [roster1, setRoster1] = useState ([]);
  const [roster2, setRoster2] = useState ([]);
  const [gameObject, setGameObject] = useState (initialWarmachineObject);
  const [mousePosition, setMp] = useState('');
  const [action, setAction] = useState('nothing');
  const [attackDices, setAttackDices] = useState('');
  const [defenceDices, setDefenceDices] = useState('');
  const [details, setDetails] = useState('');
  const [ball, setBall] = useState({x:10, y:10});

  // when this app is loaded
  useEffect( () => {
    // size of table is: 22 x 30 ''
    drawKTfield("killteamField", 23, 31);
    getKillTeams().then(initialData => {
       setTeams(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
     getAll().then(initialData => {
        setPlayers(initialData);
      }).catch(err => {
        console.log('error', err.response);
      });
  }, []);

  const attackDiceThrow = (e) => {
    setAttackDices(diceThrows(e.target.id));
  }
  const defenceDiceThrow = (e) => {
    setDefenceDices(diceThrows(e.target.id));
  }

  const hovering = (e) => {
    // get mouse locations offsets to get where mouse is hovering.
    let r = document.getElementById('killteamField').getBoundingClientRect();
    let x = e.clientX - r.left;
    let y = e.clientY - r.top;
    const hoverDetails = {x: x, y: y};
    const allPlayers = roster1.concat(roster2);
    // check if hovering over someone
    allPlayers.forEach((item, i) => {
      const collision = arcVsArc(mousePosition, item, 10, 15);
      if (collision) {
        const presenting = `(${item.name})
        (${item.stats})
        (${item.status})(${item.hitpoints})
        (${item.specialRules})`;
        setDetails(presenting);
      }
    });
    drawKTfield("killteamField", 23, 31, roster1, roster2, ball);
    setMp(hoverDetails)
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
    console.log('mouse: ', mousePosition);
    console.log('action: ', action);
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
  const pointsToggle = (e) => {
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let toggling = 'team1';

    if (activeTeam === "Team 2") {
      toggling = 'team2';
    }
    if (e.target.id === 'pointsPlus') {
      copyOfgameObject[toggling].points++;
    } else {
      copyOfgameObject[toggling].points--;
    }

    setGameObject(copyOfgameObject);
  }


  const clicked = () => {
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);

    // check if someone is moving
    copyOfRoster1.forEach((item, i) => {
      const collision = arcVsArc(mousePosition, item, 10, 15);
      if (item.status === 'move') {
        item.status = 'activated';
        item.x = mousePosition.x;
        item.y = mousePosition.y;
        setRoster1(copyOfRoster1);
      }
      else if (collision && action === 'switchOrder') {
        if (item.order === 'engage') {
          item.order = 'hide';
        } else {
          item.order = 'engage';
        }
        setAction('nothing');
        setRoster1(copyOfRoster1);
      }
    });
    copyOfRoster2.forEach((item, i) => {
      const collision = arcVsArc(mousePosition, item, 10, 15);
      if (item.status === 'move') {
        item.status = 'activated';
        item.x = mousePosition.x;
        item.y = mousePosition.y;
        setRoster2(copyOfRoster2);
      }
      else if (collision && action === 'switchOrder') {
        if (item.order === 'engage') {
          item.order = 'hide';
        } else {
          item.order = 'engage';
        }
        setAction('nothing');
        setRoster2(copyOfRoster2);
      }
    });
    if (action !== 'nothing') {
      // check who and set status
      copyOfRoster1.forEach((item, i) => {
        const collision = arcVsArc(mousePosition, item, 10, 15);
        if (collision) {item.status = action; setRoster1(copyOfRoster1);}
        setAction('nothing');
      });
      // check who and set status
      copyOfRoster2.forEach((item, i) => {
        const collision = arcVsArc(mousePosition, item, 10, 15);
        if (collision) {item.status = action; setRoster2(copyOfRoster2);}
        setAction('nothing');
      });
    }

  }

  const statuses = (e) => {
    const selectedAction = e.target.id;
    const copyOfRoster1 = roster1.concat([]);
    const copyOfRoster2 = roster2.concat([]);

    // clear earlier moves to avoid dublicated positions
    if (selectedAction === 'move') {
      copyOfRoster1.forEach((item, i) => {
        if (item.status === 'move') {
          item.status = 'ready';
        }
      });
      copyOfRoster2.forEach((item, i) => {
        if (item.status === 'move') {
          item.status = 'ready';
        }
      });
    }

    if (selectedAction === 'team1ready') {
        copyOfRoster1.forEach((item, i) => {
          if (item.status === 'activated' || item.status === 'lostBlockZone') {
            item.status = 'ready';
          }
        });
        setRoster1(copyOfRoster1);
    } else if (selectedAction === 'team2ready') {
      copyOfRoster2.forEach((item, i) => {
        if (item.status === 'activated' || item.status === 'lostBlockZone') {
          item.status = 'ready';
        }
      });
      setRoster2(copyOfRoster2);
    } else {
      setAction(selectedAction);
    }
  }

  const addTeam =  (e) => {
    const clickedEntry = Number(e.target.id);
    const copyOfgameObject = JSON.parse(JSON.stringify(gameObject));
    let active = 'team1';
    let startPoint = {x: 50, y: 100};
    let activeRoster = [];
    const selectedTeam = teams.filter( team => team.id === clickedEntry);

    if (activeTeam === 'Team 2') {
      active = 'team2';
      activeRoster = activeRoster.concat(roster2);
      startPoint.y = 450;
    } else {
      activeRoster = activeRoster.concat(roster1);
    }

    copyOfgameObject[active].points = selectedTeam[0].reRolls;
    copyOfgameObject[active].team = selectedTeam[0].teamName;

    selectedTeam[0].roster.forEach((item) => {
      const selectedPlayer = players.filter( player => item.id === player.id);
      const newPlayer = JSON.parse(JSON.stringify(selectedPlayer[0]));
      newPlayer.x = startPoint.x + (activeRoster.length + 1) * 36;
      newPlayer.y = startPoint.y;
      newPlayer.status = 'ready';
      newPlayer.order = 'engage';
      newPlayer.z = 1;
      activeRoster.push(newPlayer);
    });

    if (activeTeam === 'Team 2') {
      setRoster2(activeRoster);
    } else {
      setRoster1(activeRoster);
    }

    setGameObject(copyOfgameObject);
    drawKTfield("killteamField", 23, 31, roster1, roster2, ball);
  }

  return(
    <div id= "container">
      <div id= "controls">
        <div id= "leftSide">
        mouse: {mousePosition.x} {mousePosition.y}<br/>
        <br/>
        <button onClick= {checki}>
          checki
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
        <button id= "pointsPlus" onClick= {pointsToggle}>
          points+
        </button>
        <button id= "pointsMinus" onClick= {pointsToggle}>
          points-
        </button>
        <br/>
        </div>
        <div id= "rightSide">
          <button id= "move" onClick= {statuses}>move</button>
      {/*    <button id= "lostBlockZone" onClick= {statuses}>lostBlockZone</button>
          */}
          <button id= "activated" onClick= {statuses}>activated</button>
          <button id= "ready" onClick= {statuses}>ready</button>
          <button id= "switchOrder" onClick= {statuses}>switch order</button>
          <button id= "hpReduce" className = "greenBg" onClick= {statuses}>hp -</button>
          <button id= "hpAdd" className= "greenBg" onClick= {statuses}>hp +</button>
          <button id= "team1ready" onClick= {statuses}>team 1 ready</button>
          <button id= "team2ready" onClick= {statuses}>team 2 ready</button>
          <br/>
          attack dices
          <button id= "d6" onClick= {attackDiceThrow}>d6</button>
          <button id= "2d6" onClick= {attackDiceThrow}>2d6</button>
          <button id= "3d6" onClick= {attackDiceThrow}>3d6</button>
          <button id= "4d6" onClick= {attackDiceThrow}>4d6</button>
          <button id= "5d6" onClick= {attackDiceThrow}>5d6</button>
          <button id= "6d6" onClick= {attackDiceThrow}>6d6</button>
          <button id= "d3" onClick= {attackDiceThrow}>d3</button>
          <br/>
          <div id= "attackDices">
          {attackDices}
          </div>
          <br/>
          defence dices
          <button id= "d6" onClick= {defenceDiceThrow}>d6</button>
          <button id= "2d6" onClick= {defenceDiceThrow}>2d6</button>
          <button id= "3d6" onClick= {defenceDiceThrow}>3d6</button>
          <button id= "4d6" onClick= {defenceDiceThrow}>4d6</button>
          <button id= "5d6" onClick= {defenceDiceThrow}>5d6</button>
          <button id= "6d6" onClick= {defenceDiceThrow}>6d6</button>
          <button id= "d3" onClick= {defenceDiceThrow}>d3</button>
          <br/>
          <div id= "defenceDices">
          {defenceDices}
          </div>
        </div>
        <div id= "infos">
          Activated team: {activeTeam}<br/>
          {gameObject.team1.team}. turn: {gameObject.team1.turn} points: {gameObject.team1.points}<br/>
          {gameObject.team2.team}. turn: {gameObject.team2.turn} points: {gameObject.team2.points}
        </div>
      </div>
      <div id= "canvasPlace">
        <canvas
          onMouseMove= {hovering}
          onClick= {clicked}
          id= "killteamField"
          width = {1000}
          height = {1000}>
        </canvas>
      </div>
      <div id= "rules">
        {details}
      </div>

      <div id= "teams">
        select team:<br/>
        <ShowAllTeams
         showThese = {teams}
         addFunc = {addTeam}/>

      </div>

    </div>
    );
}

export default KillTeam;

/*
the arena should be
26width
15height
{}
*/
