import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  routine() {
    if(!this.memory.initiated) {
      this.initiate();
    }
    this.buildCreeps();
  },

  initiate() {
    this.memory.harvestersNeeded = this.find(FIND_SOURCES).length;
  },

  buildCreeps() {
    // initial income
    if(this.countCreepsWithRole('harvester') < 1) {
      this.buildCreepWithRole('initialHarvester');
    }
    if(this.countCreepsWithRole('truck') < 1) {
      this.buildCreepWithRole('initialTruck');
    }
    if(this.memory.harvestersNeeded > this.countCreepsWithRole('harvester')) {
      this.buildCreepWithRole('harvester');
    }
  },

  countCreepsWithRole(role) {
    return this.find(FIND_MY_CREEPS).filter( (creep) => {
      return creep.memory.role === role;
    }).length;
  },

  findAvailableSpawn() {
    return this.find(FIND_MY_SPAWNS).filter((spawn) => {
      return (!spawn.spawning && !spawn.memory.build);
    })[0];
  },

  buildCreepWithRole(role) {
    let spawn = this.findAvailableSpawn();
    if(spawn) {
      spawn.memory.build = role;
    }
  },


});
