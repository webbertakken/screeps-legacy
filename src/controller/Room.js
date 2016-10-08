import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  routine() {
    if(!this.isInitiated()) {
      this.initiate();
      return;
    }
    if((Game.time % 12) == 0) {
      this.countRoles();
      this.populate();
    }
  },

  isInitiated(setter) {
    if(setter === undefined) {
      return !!this.memory.isInitiated;
    } else {
      return this.memory.isInitiated = !!setter;
    }
  },

  initiate() {
    console.log('Initiating room');
    if (!this.memory.buildQueue) {
      this.memory.buildQueue = [];
    }
    if (!this.memory.creeps) {
      this.memory.creeps = {};
    }
    this.memory.sources = [];
    _.forEach(this.find(FIND_SOURCES), (source) => {
      this.memory.sources.push({
        'id': source.id,
        'energyCapacity': source.energyCapacity,
        'pos': source.pos,
        'assignee': false
      });
    });
    this.memory.harvestersNeeded = this.memory.sources.length;
    this.isInitiated(true);
  },

  populate() {
    if(!this.memory.creeps.harvester) {
      this.memory.creeps.harvester = 0;
    }
    if(this.memory.creeps.harvester === 0) {
      this.addPriorityCreepToQueue('harvester', 'initialHarvester', {});
    } else if (this.memory.creeps.harvester < this.memory.harvestersNeeded) {
      this.addCreepToQueue('harvester', 'harvester', {});
    }
  },

  addCreepToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.push({
      role: role,
      template: template,
      memory: memory,
    });
    this.memory.creeps[role] += 1;
  },

  addPriorityCreepToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.unshift({
      role: role,
      template: template,
      memory: memory,
    });
    this.memory.creeps[role] += 1;
  },

  countRoles() {
    var encounteredRoles = [];
    // alive creeps
    _.forEach(this.find(FIND_MY_CREEPS).filter((creep) => {
      return (creep.memory.isInitiated === true && !creep.memory.isOld === true);
    }), (creep) => {
      const role = creep.memory.role;
      if(encounteredRoles.indexOf(role) === -1) {
        encounteredRoles.push(role);
        this.memory.creeps[role] = 1;
      } else {
        this.memory.creeps[role]++;
      }
    });
    // queued creeps
    _.forEach(this.memory.buildQueue, (queueItem) => {
      const role = queueItem.role;
      if(encounteredRoles.indexOf(role) === -1) {
        encounteredRoles.push(role);
        this.memory.creeps[role] = 1;
      } else {
        this.memory.creeps[role]++;
      }
    });
    // vanished creeps
    _.remove(this.memory.creeps, (count, type) => {
      return (encounteredRoles.indexOf(type) === -1);
    });
  },

  removeQueueItemByName(creepName) {
    _.remove(this.memory.buildQueue, (queueItem) => {
      return queueItem.name === creepName;
    });
  }

});
