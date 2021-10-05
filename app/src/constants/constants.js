export const gameOptions = [
  'Blood Bowl',
  'Kill Team',
  '40k',
  'Warmachine',
  'Setup'
];

export const initialBloodBowlObject = {
  team1: {
    rerolls: 0,
    team: 'Imperial Nobility',
    value: 0,
    score: 0,
    turn: 0
  },
  team2: {
    rerolls: 0,
    team: 'Black Orc',
    value: 0,
    score: 0,
    turn: 0
  },
};

export const rerollPrices = [
  {team : 'Imperial Nobility', price: 70000},
  {team : 'Black Orc', price: 60000},
  {team : 'Dwarf', price: 50000}
];
