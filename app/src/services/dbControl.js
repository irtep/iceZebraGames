import axios from 'axios';
const cardUrl = 'http://localhost:3001/cards';
const teamUrl = 'http://localhost:3001/teams';
const whArmiesUrl = 'http://localhost:3001/whArmies';

// gets football players
export const getAll = () => {
  const request = axios.get(cardUrl);
  return request.then(response => response.data);
}

// get saved teams (blood bowl)
export const getTeams = () => {
  const request = axios.get(teamUrl);
  return request.then(response => response.data);
}

// get saved warmachine armies
export const getWhArmies = () => {
  const request = axios.get(whArmiesUrl);
  return request.then(response => response.data);
}

// creates players and units
export const createCard = newObject => {
  const request = axios.post(cardUrl, newObject);
  return request.then(response => response.data);
}

export const saveTeam = newObject => {
  const request = axios.post(teamUrl, newObject);
  return request.then(response => response.data);
}

export const saveWhArmy = newObject => {
  const request = axios.post(whArmiesUrl, newObject);
  return request.then(response => response.data);
}

export const updateBBteam = (id, newObject) => {
  const request = axios.put(`${teamUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export const eraseBBteam = (id) => {
  console.log('delete request for: ', id);
//  console.log('erase param would be: ', `${teamUrl}/${id}`);
  const request = axios.delete(`${teamUrl}/${id}`);
  return request.then(response => response.data);
}

//const commands = 'ee';

//export default { getAll, create, update, erase };

/*
https://github.com/irtep/hyFullStack2020palautukset/blob/main/osa2/puhelinluettelo/src/App.js

*/
