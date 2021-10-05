import React from 'react';
import Player from './Player';
import ActionButton from './ActionButton';

const ShowAllPlayers = ({showThese, addFunc}) => {

  if (showThese === []) {
    return null;
  } else {
    return (
      <>
      {showThese.map( person => {
        return(
          <div key= {person.name}>
            <Player
              player= {person}
            />
            <ActionButton
              id= {person.id}
              action= {addFunc}
              name= {person.name}
            />
          </div>
         )
      })}
      </>
    )
  }

}

export default ShowAllPlayers;

/*

*/
