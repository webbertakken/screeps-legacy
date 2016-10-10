import { Room } from 'screeps-globals';

Object.assign(Room.prototype, {

  /**
   *
   */
  routine() {
    if(!this.isInitiated()) {
      this.initiate();
      return;
    }
    if((Game.time % 12) == 0) {
      this.countRoles();
      this.determineStage();
      this.populate();
    }
  },

  /**
   *
   * @param setter
   * @returns {boolean}
   */
  isInitiated(setter) {
    if(setter === undefined) {
      return !!this.memory.isInitiated;
    } else {
      return this.memory.isInitiated = !!setter;
    }
  },

  /**
   *
   */
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
      });
    });
    this.memory.harvestersNeeded = 1; // this.memory.sources.length;
    this.memory.trucksNeeded = this.memory.harvestersNeeded;
    this.memory.upgradersNeeded = 1;
    this.isInitiated(true);
  },

  /**
   *
   * @param setIfUndefined
   * @returns {*}
   */
  determineStage() {
    if(this.find(FIND_MY_CREEPS).length < 2) {
      this.memory.stage = 0;
    } else if(this.energyCapacityAvailable <= 300) {
      this.memory.stage = 1;
    } else {
      //this.memory.stage = 2;
    }
    return this.memory.stage;
  },

  /**
   *
   */
  populate() {
    if(this.memory.buildQueue.length >= 5) {
      return;
    }
    let stage = this.determineStage();
    // initial creeps
    if(stage === 0) {
      if(!this.memory.creeps.harvester) {
        this.addCreepToQueue('harvester', 'starterHarvester', {});
      }
      if(!this.memory.creeps.truck) {
        this.addCreepToQueue('truck', 'starterTruck', {});
      }
    } else if (stage === 1) {
      // backup creeps @ priority
      if (!this.memory.creeps.truck) {
        let template = stage > 1 ? 'truck' : 'initialTruck';
        this.addPriorityCreepToQueue('truck', template, {});
      }
      if (!this.memory.creeps.harvester) {
        let template = stage > 1 ? 'harvester' : 'initialHarvester';
        this.addPriorityCreepToQueue('harvester', template, {});
      }
      // normal queue fill
      if (this.memory.creeps.harvester < this.memory.harvestersNeeded) {
        let template = stage > 1 ? 'harvester' : 'initialHarvester';
        this.addCreepToQueue('harvester', template, {});
      }
      if (this.memory.creeps.truck < this.memory.trucksNeeded) {
        let template = stage > 1 ? 'truck' : 'initialTruck';
        this.addCreepToQueue('truck', template, {});
      }
      if (!this.memory.creeps.upgrader || this.memory.creeps.upgrader < this.memory.upgradersNeeded) {
        let template = stage > 1 ? 'upgrader' : 'initialUpgrader';
        this.addCreepToQueue('upgrader', template, {});
      }
    }
  },

  /**
   * @Description Add creep to end of buildQueue
   *
   * @param role  string  Role that creep will get
   * @param template  string  Reference to template to generate creep from
   * @param memory  Object  Memory to assign to creep on spawn.
   */
  addCreepToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.push({
      role: role,
      template: template,
      memory: memory,
    });
    this.memory.creeps[role] += 1;
  },

  /**
   * @Description Add creep to start of buildQueue
   *
   * @param role  string  Role that creep will get
   * @param template  string  Reference to template to generate creep from
   * @param memory  Object  Memory to assign to creep on spawn.
   */
  addPriorityCreepToQueue(role, template, memory) {
    Object.assign(memory, { role: role });
    this.memory.buildQueue.unshift({
      role: role,
      template: template,
      memory: memory,
    });
    this.memory.creeps[role] += 1;
  },

  /**
   * @function:     Room.countRoles()
   * @description:  Counts active creeps (except old) + queued creeps and
   *                Updates room.memory, adding counts, cleaning up vanished roles
   */
  countRoles() {
    const encounteredRoles = [];
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
    // remove vanished creeps from memory
    _.forEach(this.memory.creeps, (count, type) => {
      if (encounteredRoles.indexOf(type) === -1) {
        delete this.memory.creeps[type];
      }
    });
  },

  setReplacementIdForFirstRoleInQueue(creepId, role) {
    let firstRole = _.find(this.memory.buildQueue, (queueItem) => {
      return queueItem.role === role && !queueItem.memory.replacementFor;
    });
    if(!firstRole) {
      console.log('nothing in queue to mark as replacement');
      return false;
    }
    Object.assign(firstRole.memory, { replacementFor: creepId });
    console.log(JSON.stringify(firstRole.memory));
    console.log(JSON.stringify(this.memory.buildQueue));
    return true;
  },
  /**
   *
   * @param creepName
   */
  removeQueueItemByName(creepName) {
    _.remove(this.memory.buildQueue, (queueItem) => {
      return queueItem.name === creepName;
    });
  },

  findHarvesters() {
    return this.find(FIND_MY_CREEPS).filter((creep) => {
      return creep.memory.role === 'harvester';
    });
  },

  findLonelyHarvesters() {
    return _.filter(this.findHarvesters(), (creep) => {
      return !creep.memory.assignedTruck;
    });
  }

});
