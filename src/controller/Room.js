import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  routine() {
    if(!this.memory.initiated) {
      this.initiate();
    }
  },

  initiate() {
    this.memory.harvestersNeeded = this.find(FIND_SOURCES).length;
  }


});
