import { drawBBfield } from '../functions/bloodBowl';
import { useEffect, useState } from 'react';
import { getAll } from '../services/dbControl';
import ShowAllPlayers from './ShowAllPlayers';

const style = {
  background: 'green'
};



const BloodBowlStadium = ({game}) => {
  const [players, setPlayers] = useState([]);

  // when this app is loaded
  useEffect( () => {
    drawBBfield("bloodBowlStadium", 16, 27);
    getAll().then(initialData => {
       setPlayers(initialData);
     }).catch(err => {
       console.log('error', err.response);
     });
  }, []);

  return(
    <div style= {style}>
      <div id= "canvasPlace">
        <canvas
          id= "bloodBowlStadium"
          width = {950}
          height = {1000}>
        </canvas>
      </div>
      <div>
        players:<br/>
        <ShowAllPlayers
         showThese = {players}/>
      </div>
    </div>
    );
}

export default BloodBowlStadium;

/*
the arena should be
26width
15height
*/
