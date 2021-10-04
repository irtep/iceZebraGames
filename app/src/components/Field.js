import BloodBowlStadium from './BloodBowlStadium';
import Setups from './Setups';

const Field = ({game}) => {
  if (game === 'Blood Bowl') {
    return(
      <>
      <BloodBowlStadium />
      </>
    );
  } else if (game === 'Setup') {
    return(
      <>
      <Setups />
      </>
    );
  }
  else {
    return(
      <>
        choose game / game not yet added.
      </>
    );
  }

}

export default Field;
