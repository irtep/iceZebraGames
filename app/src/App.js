import { useState, useEffect } from 'react';
import Field from './components/Field';
import { gameOptions } from './constants/constants';

const App = () => {
  const [chosenGame, setGame] = useState('');
  console.log('cg: ', chosenGame);

  // when this app is loaded
  useEffect(() => {
    gameOptions.forEach( (item) => {
      const o = document.createElement("option");
      o.text = item;
      o.value = item;
      o.key = item;
      document.getElementById("chooseMenu").appendChild(o);
    });
  }, []);

  const collectData = () => {
    const selectPlace = document.getElementById('chooseMenu');
    setGame(selectPlace.value);
  }

  return (
    <div className="App">

      <div>
        <br />
        <select id = "chooseMenu" onChange = {collectData}>
          <option value = "Choose the game">Choose the game</option>
        </select>
        <br />
      </div>

      <div id= "field">
        <Field game= {chosenGame}/>
      </div>

    </div>
  );
}

export default App;
