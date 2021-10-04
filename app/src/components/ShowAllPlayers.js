import React from 'react';
import Player from './Player';
import ActionButton from './ActionButton';

const ShowAllPlayers = ({showThese, deleteFunc}) => {
  console.log('show these: ', showThese);
  if (showThese === []) {
    console.log('show all null');
    return null;
  } else {
    return (
      <>
      {showThese.map( person => {
        return(
          <div key= {person.name}>
            <Player
              person= {person}
            />
            <ActionButton
              id= {person.id}
              action= {deleteFunc}
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
