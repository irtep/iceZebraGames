import BloodBowlStadium from './BloodBowlStadium';

const Field = ({game}) => {
  if (game === 'Blood Bowl') {
    return(
      <>
      <BloodBowlStadium />
      </>
    );
  } else {
    return(
      <>
        choose game / game not yet added.
      </>
    );
  }

}

export default Field;
