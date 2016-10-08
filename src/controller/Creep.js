import { Creep } from 'screeps-globals';
import creepMapper from '../util/creepMapper';

Object.assign(Creep.prototype, {

  routine() {
    if(!this.isInitiated()) {
      this.initiate();
    }
    if(this.performRole) {
      this.performRole();
    }
  },

  reMap() {
    return creepMapper.mapCreep(this);
  },

  isInitiated(setter) {
    if(setter === undefined) {
      return !!this.memory.isInitiated;
    } else {
      return this.memory.isInitiated = setter;
    }
  },

  initiate() {
    this.room.removeQueueItemByName(this.name);
    this.isInitiated(true);
  },

  isGivenInstructions(setter) {
    if(setter === undefined) {
      return !!this.memory.isInstructed;
    } else {
      return this.memory.isInstructed = setter;
    }
  },

  isOld(setter) {
    if(setter === undefined) {
      return !!this.memory.isOld;
    } else {
      return this.memory.isOld = setter;
    }
  },

  isBeingReplaced(setter) {
    if(setter === undefined) {
      return !!this.memory.isBeingReplaced;
    } else {
      return this.memory.isBeingReplaced = setter;
    }
  },

});
