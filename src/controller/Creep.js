import {Creep} from 'screeps-globals';
import creepMapper from '../util/creepMapper';

Object.assign(Creep.prototype, {

  /*
   * Routine to execute every tick
   */
  routine() {
    this.initiate();
    this.performRole();
  },

  /*
   * Actions to perform for this role
   * Must be overridden in inheriting class
   */
  performRole() {
    this.say('Orders?');
  },

  /*
   * Initial setting up of any creep
   */
  initiate() {
    // Only initiate after spawning
    if (this.isInitiated() || !this.ticksToLive) {
      return;
    }

    // Remove from this rooms queue
    this.room.removeQueueItemByName(this.name);
    // Set origin
    this.origin(this.room.name);
    // Indicate Creep now exists
    this.isInitiated(true);
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

  isOld() {
    return this.ticksToLive <= 120;
  },

  isVeryOld() {
    return this.ticksToLive <= 60;
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

  isCarryingEnergy() {
    return this.carry.energy >= 1;
  },

  isCarryingResources() {
    return _.sum(this.carry) - this.carry.energy >= 1;
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

  role(setter) {
    return setter === undefined ? this.memory.role || false : this.memory.role = setter;
  },

});
