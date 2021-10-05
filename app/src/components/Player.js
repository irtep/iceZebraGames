import React from 'react';

const Player = ({player}) => {
  if (player === undefined) {
    return null;
  } else {
    return(
      <>
        {player.name} {player.cost}
      </>
    );
  }
}

export default Player;
