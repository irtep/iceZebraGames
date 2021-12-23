import BloodBowl from './BloodBowl';
import Warmachine from './Warmachine';
import BloodBowl2 from './BloodBowl2';
import BloodBowl3 from './BloodBowl3';
import Setups from './Setups';

const Field = ({game}) => {
  if (game === 'Blood Bowl') {
    return(
      <>
      <BloodBowl />
      </>
    );
  } else if (game === 'Warmachine') {
    return(
      <>
      <Warmachine />
      </>
    );
  } else if (game === 'Setup') {
    return(
      <>
      <Setups />
      </>
    );
  } else if (game === 'Blood Bowl2') {
    return(
      <>
      <BloodBowl />
      </>
    );
  } else if (game === 'Blood Bowl3') {
    return(
      <>
      <BloodBowl3 />
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
