import React from 'react';
//import Player from './Player';
import ActionButton from './ActionButton';

const ShowAllTeams = ({showThese, addFunc}) => {

  if (showThese === []) {
    return null;
  } else {
    return (
      <>
      {showThese.map( team => {
          return(
            <div key= {team.teamName}>
              {team.teamName}
              <ActionButton
                id= {team.id}
                action= {addFunc}
                name= {team.teamName}
              />
            </div>
           )
      })}
      </>
    )
  }

}

export default ShowAllTeams;
