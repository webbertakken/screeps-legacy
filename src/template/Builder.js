module.exports = {
  cost: 600,
  body: [
    MOVE,
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    CARRY
  ],
  name: 'builder' + _.random(1000, 1999),
  memory: {
    role: 'builder',
    targetResourceId: null,
  },
};