import React from 'react';

const Player = ({player}) => {
  console.log('player: ', player);
  if (player === undefined) {
    console.log('player null');
    return null;
  } else {
    console.log('player not null');
    return(
      <>
        {player.name} {player.cost}
      </>
    );
  }
}

export default Player;
