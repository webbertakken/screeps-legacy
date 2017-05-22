import {Creep} from 'screeps-globals';
import creepMapper from '../util/creepMapper';

Object.assign(Creep.prototype, {

  initiate() {
    // Remove from this rooms queue
    this.room.removeQueueItemByName(this.name);
    // Set origin
    this.origin(this.room.name);
    // Indicate Creep now exists
    this.isInitiated(true);
  },

  routine() {
    // Initiate when alive
    if (!this.isInitiated() && this.ticksToLive) {
      this.initiate();

      return;
    }

    // Give instructions once Initiated
    if (!this.isGivenInstructions()) {
      this.instruct();

      return;
    }

    // Perform specific role
    this.performRole();
  },

  /**
   * @Description i'm old and empty, time to salvage myself
   */
  task_salvage() {
    if (this.activity() === 'salvaging') {
      if (!this.isNextTo(this.disassemblerLocation())) {
        this.moveTo(this.disassemblerLocation().x, this.disassemblerLocation().y);
      }
    }
  },

  reMap() {
    return creepMapper.mapCreep(this);
  },

  origin(setter) {
    return setter === undefined ? this.memory.origin || false : this.memory.origin = setter;
  },

  isInitiated(setter) {
    return setter === undefined ? !!this.memory.isInitiated : this.memory.isInitiated = setter;
  },

  activity(setter) {
    return setter === undefined ? this.memory.activity || false : this.memory.activity = setter;
  },

  isGivenInstructions(setter) {
    return setter === undefined ? !!this.memory.isInstructed : this.memory.isInstructed = setter;
  },

  isOld() {
    return this.ticksToLive <= 90;
  },

  isVeryOld() {
    return this.ticksToLive <= 35;
  },

  isBeingReplaced(setter) {
    return setter === undefined ? !!this.memory.isBeingReplaced : this.memory.isBeingReplaced = setter;
  },

  isEmpty() {
    return _.sum(this.carry) === 0;
  },

  isFull() {
    return _.sum(this.carry) >= this.carryCapacity;
  },

  isGoodAsFull() {
    return _.sum(this.carry) + this.carryCapacity / 3 * 2 >= this.carryCapacity;
  },

  carriesNoEnergy() {
    return this.carry.energy === 0;
  },

  carriesNoResources() {
    return _.sum(this.carry) - this.carry.energy === 0;
  },

  disassemblerLocation() {
    if (this.memory.disassemblerLocation === undefined) {
      this.memory.disassemblerLocation = this.pos.findClosestByRange(FIND_MY_SPAWNS).pos;
    }
    return this.memory.disassemblerLocation;
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
  },

});
