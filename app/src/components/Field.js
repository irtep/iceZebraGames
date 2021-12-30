import BloodBowl from './BloodBowl';
import Warmachine from './Warmachine';
import KillTeam from './KillTeam';
import Wh40k from './Wh40k';
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
  } else if (game === 'Kill Team') {
    return(
      <>
      <KillTeam />
      </>
    );
  } else if (game === '40k') {
    return(
      <>
      <Wh40k />
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
