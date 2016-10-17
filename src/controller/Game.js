const customGame = {

  cleanMemoryCreeps() {
    _.forEach(Memory.creeps, (creep, key) => {
      if(!Game.creeps[key]) {
        delete Memory.creeps[key];
      }
    });
  },

  cleanMemoryRooms() {
    _.forEach(Memory.rooms, (room, key) => {
      if(!Game.rooms[key]) {
        delete Memory.rooms[key];
      }
    });
  },

};

export default {
  init() {
    Object.assign(Game, customGame);
  },
};
