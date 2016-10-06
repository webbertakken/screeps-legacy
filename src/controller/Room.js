import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  // default routine
  routine() {
    if(!this.memory.initiated) {
      this.initiate();
    }
    if((Game.time & 1) == 0) {
      this.countRoles();
      this.populate();
    }
  },

  // initiate rooms memory
  initiate() {
    if(!this.memory.buildQueue)  { this.memory.buildQueue = []; }
    if(!this.memory.creeps)      { this.memory.creeps = {};     }
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
  },

  // populate room with needed creeps
  populate() {
    if(!this.memory.creeps.harvester) {
      this.memory.creeps.harvester = 0;
    }
    if(this.memory.creeps.harvester === 0) {
      this.addToQueue('harvester', 'initialHarvester', {});
    } else if (this.memory.creeps.harvester < this.memory.harvestersNeeded) {
      this.addToQueue('harvester', 'harvester', {});
    }
  },

  // add creep to queue
  addToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.push({
      role: role,
      template: template,
      memory: memory,
    });
  },

  // count active and queued creeps by role
  countRoles() {
    const encounteredRoles = [];
    _.forEach(this.find(FIND_MY_CREEPS).filter((creep) => {
      return (creep.memory.status != 'beingReplaced' && creep.memory.status != 'iAmOld');
    }), (creep) => {
      const role = creep.memory.role;
      if(!encounteredRoles.indexOf(role)) {
        encounteredRoles.push(role);
        this.memory.creeps[role] = 1;
      } else {
        this.memory.creeps[role]++;
      }
    });
    _.forEach(this.memory.buildQueue, (queueItem) => {
      const role = queueItem.role;
      if(!encounteredRoles.indexOf(role)) {
        encounteredRoles.push(role);
        this.memory.creeps[role] = 1;
      } else {
        this.memory.creeps[role]++;
      }
    });
  },


});
