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

// from here picks all teams too
export const rerollPrices = [
  {team : 'Imperial Nobility', price: 70000},
  {team : 'Black Orc', price: 60000},
  {team : 'Dwarf', price: 50000},
  {team : 'Wood Elf', price: 50000},
  {team : 'Ogre', price: 70000},
  {team : 'Goblin', price: 60000}
];

// warmachine factions
export const factions = [
  'cryx', 'circle', 'trollbloods', 'cygnar', 'khador'
];

export const blockDices = [
  '(player down)',
  '(both down)',
  '(push back)',
  '(push back)',
  '(stumble)',
  '(pow!)'
];
