import React from 'react';
import { gameOptions } from '../constants/constants';

const Options: React.FC = () => {
  console.log('go: ', gameOptions);
  return (
    <div>
      <select id= "ddMenu" className= "rollMenus">
        <option value = "choose a game">choose a game</option>
      </select><br />
    </div>
  );
}

export default Options;
