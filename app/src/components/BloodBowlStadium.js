const style = {
  background: 'green'
};

const BloodBowlStadium = ({game}) => {
  return(
    <div style= {style}>
      <canvas
        id= "BloodBowlStadium"
        width = {600}
        height = {600}>
      </canvas>
    </div>
    );
}

export default BloodBowlStadium;
