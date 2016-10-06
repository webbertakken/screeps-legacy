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
  name: 'truck' + _.random(1000, 1999),
  memory: {
    role: 'truck',
    targetResourceId: null,
  },
};
