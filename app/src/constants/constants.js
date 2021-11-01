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
    team: 'Select team',
    value: 0,
    score: 0,
    turn: 0
  },
  team2: {
    rerolls: 0,
    team: 'Select team',
    value: 0,
    score: 0,
    turn: 0
  },
};

export const initialWarmachineObject = {
  team1: {
    points: 0,
    team: 'Select team',
    turn: 0
  },
  team2: {
    points: 0,
    team: 'Select team',
    turn: 0
  },
};

export const wmTerrain1 = [
  {
    name: 'ruin',
    form: 'square',
    w: 190,
    h: 111,
    color: 'black',
    x: 520,
    y: 460
  },
  {
    name: 'forest',
    form: 'circle',
    s: 80,
    color: 'darkGreen',
    x: 250,
    y: 370
  },
  {
    name: 'wall',
    form: 'square',
    w: 110,
    h: 10,
    color: 'black',
    x: 550,
    y: 220
  },
  {
    name: 'wall',
    form: 'square',
    w: 120,
    h: 5,
    color: 'black',
    x: 350,
    y: 320
  },
// maybe ruin, forest and two walls as Pseudok prefers only bit terrain
];

// from here picks all teams too
export const rerollPrices = [
  {team : 'Imperial Nobility', price: 70000},
  {team : 'Black Orc', price: 60000},
  {team : 'Dwarf', price: 50000},
  {team : 'Wood Elf', price: 50000},
  {team : 'Ogre', price: 70000},
  {team : 'Goblin', price: 60000},
  {team : 'Necromantic Horror', price: 70000},
  {team : 'Skaven', price: 50000}
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
