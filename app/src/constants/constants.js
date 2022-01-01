export const gameOptions = [
  'Blood Bowl',
  'Kill Team',
  '40k',
  'Warmachine',
  'Setup'
];

export const ktMissions = [
  {
    name: 'reconnoitre',
    desc: 'with 1 ap can recon recon points, getting 1,2,3,4 points, depends how far of your zone',
    terrain: [
      {
        name: 'recon point a',
        type: 'rect',
        x: 138,
        y: 123,
        w: 175,
        h: 120,
        levels: 2
      },
      {
        name: 'recon point b',
        type: 'rect',
        x: 630,
        y: 172,
        w: 175,
        h: 120,
        levels: 2
      },
      {
        name: 'recon point c',
        type: 'rect',
        x: 138,
        y: 396,
        w: 175,
        h: 120,
        levels: 2
      },
      {
        name: 'recon point d',
        type: 'rect',
        x: 600,
        y: 450,
        w: 175,
        h: 120,
        levels: 2
      },
      {
        name: 'oil pump',
        type: 'rect',
        x: 440,
        y: 316,
        w: 100,
        h: 90,
        levels: 2
      },
      {
        name: 'small platform',
        type: 'rect',
        x: 440,
        y: 470,
        w: 55,
        h: 55,
        levels: 2
      },
      {
        name: 'wall',
        type: 'rect',
        x: 711,
        y: 100,
        w: 100,
        h: 10,
        levels: 1
      },
      {
        name: 'wall',
        type: 'rect',
        x: 424,
        y: 177,
        w: 100,
        h: 10,
        levels: 1
      },
      {
        name: 'wall',
        type: 'rect',
        x: 90,
        y: 560,
        w: 150,
        h: 10,
        levels: 1
      },
      {
        name: 'rumble',
        type: 'rect',
        x: 207,
        y: 290,
        w: 77,
        h: 77,
        levels: 1
      },
      {
        name: 'rumble',
        type: 'rect',
        x: 680,
        y: 350,
        w: 77,
        h: 77,
        levels: 1
      },
    ]
  }
]

export const bb3InitialGameObject = {
  phase: 'Select teams',
  forLog: [],
  half: 1,
  team1: {
    rerolls: 0,
    team: 'Select team',
    value: 0,
    score: 0,
    turn: 0,
    blitz: true,
    foul: true,
    argue: true,
    pass: true,
    handOff: true,
    colors: [],
    roster: [],
    active: false
  },
  team2: {
    rerolls: 0,
    team: 'Select team',
    value: 0,
    score: 0,
    turn: 0,
    blitz: true,
    foul: true,
    argue: true,
    pass: true,
    handOff: true,
    colors: [],
    roster: [],
    active: false
  },
  ball: {x: 100, y: 100},
  firstKicker: ''
}

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
    x: 100,
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
  {team : 'Skaven', price: 50000},
  {team : 'Dark Elf', price: 50000},
  {team : 'Undead', price: 70000},
  {team : 'Orc', price: 60000}
];

// warmachine factions
export const factions = [
  'cryx', 'circle', 'trollbloods', 'cygnar', 'khador'
];

export const killTeamFactions = [
  {name: 'veteran ig', stratagems:`sgt: movemovemove, take aim, hold position, fix bayonets.
  strategic: overcharge, take cover, into the breach, clear the line.
  tactical: inspirational ld, in readh, atonement, combined arms`},
  {name: 'kommandos', stratagems:`strategic: sssh!, dakka!, waagh!, skulk about.
  tactical: just a scratch, krump em, sneaky git`}
];

export const blockDices = [
  '(player down)',
  '(both down)',
  '(push back)',
  '(push back)',
  '(stumble)',
  '(pow!)'
];
