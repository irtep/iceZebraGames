import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/cards';

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const erase = (id, newObject) => {
  const request = axios.delete(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, erase };

/*
https://github.com/irtep/hyFullStack2020palautukset/blob/main/osa2/puhelinluettelo/src/App.js

*/
