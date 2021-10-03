import React from 'react';
import './App.css';
import Options from './components/Options';
import { gameOptions } from './constants/constants';

const App: React.FC = () => {
  console.log('go: ', gameOptions);
  return (
    <div>
      <Options />
    </div>
  );
}

export default App;
