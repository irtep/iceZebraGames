import React from 'react';
import Player from './Player';
import ActionButton from './ActionButton';

const ShowKtUnits = ({showThese, addFunc, selectedFaction}) => {
  if (showThese === []) {
    return null;
  } else {
    return (
      <>
      {showThese.map( person => {
        const factions = person.factions;
        // only wh cards have factions, others are undefined
        if (factions !== undefined) {
          const splitti = person.factions.split(',');
          const filteringFaction = splitti.filter( fax => fax === selectedFaction);
          if (filteringFaction.length > 0) {
            return(
              <div key= {person.name}>
                <Player
                  player= {person}
                />
                <ActionButton
                  id= {person.id}
                  action= {addFunc}
                  name= {person.name}
                  desc= {'add'}
                />
              </div>
             )
          }
        }

        return null
      })}
      </>
    )
  }

}

export default ShowKtUnits;
