import React from 'react';

const ActionButton = ({id, action, name}) => {
  return(
    <>
      <button
        id= {id}
        onClick= {action}
        name= {name}>
        delete
      </button>
    </>
  );
}

export default ActionButton;
