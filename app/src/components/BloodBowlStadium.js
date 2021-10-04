import { drawBBfield } from '../functions/bloodBowl';
import { useEffect } from 'react';

const style = {
  background: 'green'
};

const BloodBowlStadium = ({game}) => {
  // when this app is loaded
  useEffect(() => {
    drawBBfield("bloodBowlStadium", 16, 27);
  }, []);

  return(
    <div style= {style}>
      <canvas
        id= "bloodBowlStadium"
        width = {950}
        height = {1000}>
      </canvas>
    </div>
    );
}

export default BloodBowlStadium;

/*
the arena should be
26width
15height
*/
