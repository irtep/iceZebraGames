import axios from 'axios';
const cardUrl = 'http://localhost:3001/cards';
const teamUrl = 'http://localhost:3001/teams';

// gets football players
export const getAll = () => {
  const request = axios.get(cardUrl);
  return request.then(response => response.data);
}

// get saved teams
export const getTeams = () => {
  const request = axios.get(teamUrl);
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
/*
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const erase = (id, newObject) => {
  const request = axios.delete(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}
*/
//const commands = 'ee';

//export default { getAll, create, update, erase };

/*
https://github.com/irtep/hyFullStack2020palautukset/blob/main/osa2/puhelinluettelo/src/App.js

*/
