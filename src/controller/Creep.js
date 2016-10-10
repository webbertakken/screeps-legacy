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
    this.origin(this.room.name);
    if(this.instruct) {
      this.instruct();
    }
    this.isInitiated(true);
  },

  origin(setter) {
    if(setter === undefined) {
      return this.memory.origin || false;
    } else {
      return this.memory.origin = setter;
    }
  },

  activity(setter) {
    if(setter === undefined) {
      return this.memory.activity || false;
    } else {
      return this.memory.activity = setter;
    }
  },

  isGivenInstructions(setter) {
    if(setter === undefined) {
      return !!this.memory.isInstructed;
    } else {
      return this.memory.isInstructed = setter;
    }
  },

  isOld() {
    return this.memory.isOld = this.ticksToLive <= 900;
  },

  isBeingReplaced(setter) {
    if(setter === undefined) {
      return !!this.memory.isBeingReplaced;
    } else {
      return this.memory.isBeingReplaced = setter;
    }
  },

  isEmpty() {
    return _.sum(this.carry) === 0;
  },

  carriesNoEnergy() {
    return this.carry.energy === 0;
  },

  carriesNoResources() {
    return _.sum(this.carry) - this.carry.energy === 0;
  },

  disassemblerLocation() {
    if(this.memory.disassemblerLocation === undefined) {
      this.memory.disassemblerLocation = this.pos.findClosestByRange(FIND_MY_SPAWNS).pos;
    }
    return this.memory.disassemblerLocation();
  },

  isNextTo(object) {
    return this.pos.getRangeTo(object) <= 1;
  },

  isAtAttackingRangeFrom(object) {
    return this.pos.getRangeTo(object) <= 3;
  },

  isCloseTo(object) {
    return this.pos.getRangeTo(object) <= 5;
  },

  role() {
    return this.memory.role || false;
  }

});
