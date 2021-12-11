import React from 'react';

const ActionButton = ({id, action, name, desc}) => {
  return(
    <>
      <button
        id= {id}
        onClick= {action}
        name= {name}>
        {desc}
      </button>
    </>
  );
}

export default ActionButton;
